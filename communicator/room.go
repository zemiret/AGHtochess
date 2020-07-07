package main

import (
	"log"
	"time"
)

const (
	RoomSize     = 2
	initialHp    = 100
	initialMoney = 5000
)

var phaseDurations = map[GamePhase]time.Duration{
	GamePhaseWaiting:  5 * time.Millisecond,
	GamePhaseStore:    45 * time.Millisecond,
	GamePhaseBattle:   30 * time.Millisecond,
	GamePhaseQuestion: 45 * time.Millisecond,
	GamePhaseGameEnd:  10 * time.Millisecond,
}

type PlayerState struct {
	Player         Player          `json:"player"`
	Question       *Question       `json:"question"`
	Store          []Unit          `json:"store"`
	Units          []Unit          `json:"units"`
	UnitsPlacement []UnitPlacement `json:"unitsPlacement"`
}

type Room struct {
	playersState map[*Client]*PlayerState

	phase        GamePhase
	phaseStarted time.Time

	round int

	BuyUnitChannel        chan BuyUnitMessage
	PlaceUnitChannel      chan PlaceUnitMessage
	AnswerQuestionChannel chan AnswerQuestionMessage
	changePhaseChannel    chan GamePhase
	poisonPillChannel     chan interface{}
}

type BuyUnitMessage struct {
	Client         *Client         `json:"-"`
	BuyUnitPayload *BuyUnitPayload `json:"payload"`
}

type AnswerQuestionMessage struct {
	Client                *Client                `json:"-"`
	AnswerQuestionPayload *AnswerQuestionPayload `json:"payload"`
}

type PlaceUnitMessage struct {
	Client           *Client           `json:"-"`
	PlaceUnitPayload *PlaceUnitPayload `json:"payload"`
}

func newRoom() *Room {
	return &Room{
		playersState:          map[*Client]*PlayerState{},
		phase:                 GamePhaseWaiting,
		BuyUnitChannel:        make(chan BuyUnitMessage),
		AnswerQuestionChannel: make(chan AnswerQuestionMessage),
		PlaceUnitChannel:      make(chan PlaceUnitMessage),
		poisonPillChannel:     make(chan interface{}),
		changePhaseChannel:    make(chan GamePhase),
	}
}

func (r *Room) AddClient(client *Client) {
	r.playersState[client] = &PlayerState{
		Player: Player{
			Username: client.nickname,
			Hp:       initialHp,
			Money:    initialMoney,
		},
		Question:       nil,
		Store:          nil,
		Units:          nil,
		UnitsPlacement: nil,
	}
}

func (r *Room) Full() bool {
	return len(r.playersState) == RoomSize
}

func (r *Room) Shutdown(reason string) {
	for client := range r.playersState {
		if err := client.SendMessage(newInfoMessage(reason)); err != nil {
			log.Println("Error sending shutdown message: ", err)
		}
		//TODO: disconnect client
	}
	r.poisonPillChannel <- struct{}{}
}

func (r *Room) schedulePhase(after time.Duration, phase GamePhase) {
	log.Println("Scheduling phase change ", after, phase)
	time.AfterFunc(after, func() {
		log.Println("Sending new phase", phase)
		r.changePhaseChannel <- phase
	})
}

func (r *Room) getEnemy(client *Client) *Client {
	for candidate := range r.playersState {
		if client != candidate {
			return candidate
		}
	}
	log.Println("CHANGE ME")
	return client
}

func (r *Room) generateClientState(client *Client, gameResult *GameResult, battleStatistics *BattleStatistics) *PlayerStatePayload {
	playerState := r.playersState[client]
	enemy := r.getEnemy(client)
	enemyState := r.playersState[enemy]
	return &PlayerStatePayload{
		Phase:               r.phase,
		PhaseEndsAt:         r.phaseStarted.Add(phaseDurations[r.phase]).Unix(),
		Round:               r.round,
		GameResult:          gameResult,
		Player:              playerState.Player,
		Enemy:               enemyState.Player,
		Question:            playerState.Question,
		Store:               playerState.Store,
		Units:               playerState.Units,
		UnitsPlacement:      playerState.UnitsPlacement,
		EnemyUnits:          enemyState.Units,
		EnemyUnitsPlacement: enemyState.UnitsPlacement,
		BattleStatistics:    battleStatistics,
	}
}

func (r *Room) startStorePhase() {
	for _, state := range r.playersState {
		units, err := GetStoreUnits(r.round)
		if err != nil {
			r.Shutdown("Failed fetching units")
			log.Println("Failed fetching units ", err)
			return
		}
		state.Store = units
	}

	for c := range r.playersState {
		if err := c.SendMessage(r.generateClientState(c, nil, nil)); err != nil {
			r.Shutdown("Failed to propagate client state")
			log.Println("Failed to propagate client state for ", c.nickname, err)
			return
		}
	}

	r.schedulePhase(phaseDurations[GamePhaseStore], GamePhaseBattle)
}

func (r *Room) startBattlePhase() {
	var clients []*Client
	for client := range r.playersState {
		clients = append(clients, client)
	}

	player1State := r.playersState[clients[0]]
	player1 := PlayerBattleSetup{
		UnitPlacement: player1State.UnitsPlacement,
		Units:         player1State.Units,
	}

	player2State := r.playersState[clients[1]]
	player2 := PlayerBattleSetup{
		UnitPlacement: player2State.UnitsPlacement,
		Units:         player2State.Units,
	}

	battleResult, err := GetBattleResult(player1, player2)
	if err != nil {
		r.Shutdown("Failed fetching battle result")
		log.Println("Failed fetching battle result", err)
		return
	}

	var finished bool
	for i, c := range clients {
		if i != battleResult.Winner {
			r.playersState[c].Player.Hp += battleResult.PlayerHpChange

			if r.playersState[c].Player.Hp <= 0 {
				finished = true
			}
		}
	}

	for i, c := range clients {
		battleStatistics := BattleStatistics{
			Log: battleResult.Log,
		}
		if i == battleResult.Winner {
			battleStatistics.Result = GameResultWin
		} else {
			battleStatistics.Result = GameResultLoss
			battleStatistics.PlayerHpChange = battleResult.PlayerHpChange
		}

		if err := c.SendMessage(r.generateClientState(c, nil, &battleStatistics)); err != nil {
			r.Shutdown("Failed to propagate client state")
			log.Println("Failed to propagate client state for ", c.nickname, err)
			return
		}
	}

	if finished {
		r.schedulePhase(phaseDurations[GamePhaseBattle], GamePhaseGameEnd)
	} else {
		r.schedulePhase(phaseDurations[GamePhaseBattle], GamePhaseQuestion)
	}
}

func (r *Room) startQuestionPhase() {
	question, err := GetQuestion()
	if err != nil {
		r.Shutdown("Failed to fetch question")
		log.Println("Failed to fetch question", err)
		return
	}

	for c, state := range r.playersState {
		state.Question = question
		if err := c.SendMessage(r.generateClientState(c, nil, nil)); err != nil {
			r.Shutdown("Failed to propagate client state")
			log.Println("Failed to propagate client state for ", c.nickname, err)
			return
		}
	}
	r.schedulePhase(phaseDurations[GamePhaseQuestion], GamePhaseStore)
}

func (r *Room) startGameEndPhase() {
	for c, state := range r.playersState {
		var gameResult GameResult
		if state.Player.Hp > 0 {
			gameResult = GameResultWin
		} else {
			gameResult = GameResultLoss
		}
		if err := c.SendMessage(r.generateClientState(c, &gameResult, nil)); err != nil {
			r.Shutdown("Failed to propagate client state")
			log.Println("Failed to propagate client state for ", c.nickname, err)
			return
		}
	}
	r.Shutdown("Game ended")
}

func (r *Room) handlePhaseChange(phase GamePhase) {
	log.Println("Starting new phase ", phase)
	r.phase = phase
	r.phaseStarted = time.Now()
	switch phase {
	case GamePhaseStore:
		r.startStorePhase()
	case GamePhaseBattle:
		r.startBattlePhase()
	case GamePhaseQuestion:
		r.startQuestionPhase()
	case GamePhaseGameEnd:
		r.startGameEndPhase()
	}
}

func (r *Room) Start() {
	log.Println("Starting room")
	// should send battle beginning phase to clients
	r.schedulePhase(phaseDurations[GamePhaseWaiting], GamePhaseStore)

	for {
		select {
		case <-r.poisonPillChannel:
			log.Println("Shutting down room")
			return
		case phase := <-r.changePhaseChannel:
			r.handlePhaseChange(phase)
		case message := <-r.BuyUnitChannel:
			log.Printf("Buy unit %+v", message)
		case message := <-r.AnswerQuestionChannel:
			log.Printf("answer unit %+v", message)
		case message := <-r.PlaceUnitChannel:
			log.Printf("place unit %+v", message)
		}
	}
}
