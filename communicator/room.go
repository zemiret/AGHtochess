package main

import (
	"log"
	"time"
)

const (
	RoomSize       = 2
	initialHp      = 100
	initialMoney   = 5000
	questionReward = 100
)

var phaseDurations = map[GamePhase]time.Duration{
	GamePhaseWaiting:  5 * time.Second,
	GamePhaseStore:    45 * time.Second,
	GamePhaseBattle:   30 * time.Second,
	GamePhaseQuestion: 45 * time.Second,
	GamePhaseGameEnd:  10 * time.Second,
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

	ClientDisconnectChannel     chan *Client

	alive bool

	phaseChangeTimer *time.Timer
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
		ClientDisconnectChannel:     make(chan *Client),
		changePhaseChannel:    make(chan GamePhase),
		alive: true,
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
		Store:          []Unit{},
		Units:         	[]Unit{},
		UnitsPlacement: []UnitPlacement{},
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
		close(client.send)
	}
	r.playersState = nil
	r.alive = false
	if r.phaseChangeTimer != nil {
		r.phaseChangeTimer.Stop()
	}
}

func (r *Room) schedulePhase(after time.Duration, phase GamePhase) {
	log.Println("Scheduling phase change ", after, phase)
	r.phaseChangeTimer = time.AfterFunc(after, func() {
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

func (r *Room) generateClientState(client *Client, gameResult *GameResult, battleStatistics *BattleStatistics) *Message {
	playerState := r.playersState[client]
	enemy := r.getEnemy(client)
	enemyState := r.playersState[enemy]
	return &Message{
		MessageType: MessageTypeStateChange,
		Payload: &PlayerStatePayload{
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
		},
	}
}

func (r *Room) startStorePhase() {
	for _, state := range r.playersState {
		units, err := GetStoreUnits(r.round)
		if err != nil {
			log.Println("Failed fetching units ", err)
			r.Shutdown("Failed fetching units")
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

func (r *Room) handleBuyUnit(client *Client, order BuyUnitPayload) {
	if r.phase != GamePhaseStore {
		client.SendMessage(newInfoMessage("You can only buy units in store phase"))
		return
	}

	state := r.playersState[client]

	var unitToBuy *Unit
	var unitIndex int
	for i, unitInStore := range state.Store {
		if unitInStore.ID == order.ID {
			unitToBuy = &unitInStore
			unitIndex = i
			break
		}
	}

	if unitToBuy == nil {
		client.SendMessage(newInfoMessage("Unit not in store"))
		return
	}

	if state.Player.Money < unitToBuy.Price {
		client.SendMessage(newInfoMessage("You don't have enough money"))
		return
	}

	state.Player.Money -= unitToBuy.Price
	state.Store = append(state.Store[:unitIndex], state.Store[unitIndex+1:]...)
	state.Units = append(state.Units, *unitToBuy)

	if err := client.SendMessage(r.generateClientState(client, nil, nil)); err != nil {
		r.Shutdown("Failed to propagate client state")
		log.Println("Failed to propagate client state for ", client.nickname, err)
	}
}

func (r *Room) handleAnswerQuestion(client *Client, answer AnswerQuestionPayload) {
	if r.phase != GamePhaseQuestion {
		client.SendMessage(newInfoMessage("You can only answer questions in question phase"))
		return
	}

	state := r.playersState[client]

	if state.Question == nil {
		client.SendMessage(newInfoMessage("Missing question"))
		log.Println("Missing question while in question phase LOL")
		return
	}

	if state.Question.CorrectAnswer == answer.AnswerID {
		state.Player.Money += questionReward
	}

	if err := client.SendMessage(r.generateClientState(client, nil, nil)); err != nil {
		r.Shutdown("Failed to propagate client state")
		log.Println("Failed to propagate client state for ", client.nickname, err)
	}
}

func (r *Room) handlePlaceUnit(client *Client, payload PlaceUnitPayload) {
	if r.phase != GamePhaseStore {
		client.SendMessage(newInfoMessage("You can only place units in store phase"))
		return
	}
	state := r.playersState[client]

	placement := UnitPlacement{
		UnitID: payload.ID,
		X:      payload.X,
		Y:      payload.Y,
	}

	var unitToPlace *Unit
	for _, unit := range state.Units {
		if unit.ID == placement.UnitID {
			unitToPlace = &unit
			break
		}
	}

	if unitToPlace == nil {
		client.SendMessage(newInfoMessage("You don't own that unit"))
		log.Println("Client tried to place invalid unit")
		return
	}

	swapped := false
	for i, existing := range state.UnitsPlacement {
		if existing.X == placement.X && existing.Y == placement.Y {
			swapped = true
			state.UnitsPlacement[i] = placement
			break
		}
	}

	if !swapped {
		state.UnitsPlacement = append(state.UnitsPlacement, placement)
	}

	if err := client.SendMessage(r.generateClientState(client, nil, nil)); err != nil {
		r.Shutdown("Failed to propagate client state")
		log.Println("Failed to propagate client state for ", client.nickname, err)
	}
}

func (r *Room) Start() {
	log.Println("Starting room")
	// should send battle beginning phase to clients
	r.schedulePhase(phaseDurations[GamePhaseWaiting], GamePhaseStore)

	for r.alive {
		select {
		case <- r.ClientDisconnectChannel:
			r.Shutdown("Client disconnected")
		case phase := <-r.changePhaseChannel:
			r.handlePhaseChange(phase)
		case message := <-r.BuyUnitChannel:
			log.Printf("Buy unit %+v", message)
			if message.BuyUnitPayload == nil {
				message.Client.SendMessage(newInfoMessage("Missing payload"))
				continue
			}
			r.handleBuyUnit(message.Client, *message.BuyUnitPayload)
		case message := <-r.AnswerQuestionChannel:
			if message.AnswerQuestionPayload == nil {
				message.Client.SendMessage(newInfoMessage("Missing payload"))
				continue
			}
			r.handleAnswerQuestion(message.Client, *message.AnswerQuestionPayload)
		case message := <-r.PlaceUnitChannel:
			log.Printf("place unit %+v", message)
			if message.PlaceUnitPayload == nil {
				message.Client.SendMessage(newInfoMessage("Missing payload"))
				continue
			}
			r.handlePlaceUnit(message.Client, *message.PlaceUnitPayload)
		}
	}
}
