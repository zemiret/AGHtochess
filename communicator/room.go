package main

import (
	"fmt"
	"log"
	"os"
	"time"
)

const (
	RoomSize       = 2
	initialHp      = 100
	initialMoney   = 5000
	questionReward = 100
)

var phaseDurations = map[GamePhase]time.Duration{
	GamePhaseWaiting:  1 * time.Second,
	GamePhaseStore:    30 * time.Second,
	GamePhaseBattle:   1 * time.Second,
	GamePhaseQuestion: 10 * time.Second,
	GamePhaseGameEnd:  1 * time.Second,
}

type PlayerState struct {
	Player         Player          `json:"player"`
	Question       *Question       `json:"question"`
	Store          []Unit          `json:"store"`
	Units          []Unit          `json:"units"`
	UnitsPlacement []UnitPlacement `json:"unitsPlacement"`
}

type Room struct {
	log          *log.Logger
	playersState map[*Client]*PlayerState

	phase        GamePhase
	phaseStarted time.Time

	round int

	BuyUnitChannel        chan BuyUnitMessage
	PlaceUnitChannel      chan PlaceUnitMessage
	UnplaceUnitChannel    chan UnplaceUnitMessage
	AnswerQuestionChannel chan AnswerQuestionMessage
	changePhaseChannel    chan GamePhase

	ClientDisconnectChannel chan *Client
	roomClosing             chan<- *Room

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

type UnplaceUnitMessage struct {
	Client             *Client             `json:"-"`
	UnplaceUnitPayload *UnplaceUnitPayload `json:"payload"`
}

func newRoom(roomClosing chan<- *Room) *Room {
	return &Room{
		log:                     log.New(os.Stdout, "[Room]", log.Flags()),
		playersState:            map[*Client]*PlayerState{},
		phase:                   GamePhaseWaiting,
		BuyUnitChannel:          make(chan BuyUnitMessage),
		AnswerQuestionChannel:   make(chan AnswerQuestionMessage),
		PlaceUnitChannel:        make(chan PlaceUnitMessage),
		UnplaceUnitChannel:      make(chan UnplaceUnitMessage),
		ClientDisconnectChannel: make(chan *Client, 2),
		changePhaseChannel:      make(chan GamePhase),
		alive:                   true,
		roomClosing:             roomClosing,
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
		Units:          []Unit{},
		UnitsPlacement: []UnitPlacement{},
	}

	r.updateLogger()
	r.log.Println("Client ", client.nickname, " connected")
}

func (r *Room) updateLogger() {
	var users []string
	for user := range r.playersState {
		users = append(users, user.nickname)
	}
	r.log.SetPrefix(fmt.Sprintf("[Room] %v: ", users))
}

func (r *Room) Full() bool {
	return len(r.playersState) == RoomSize
}

func (r *Room) Shutdown(reason string) {
	r.log.Println("Shutting down")
	for client := range r.playersState {
		if err := client.SendMessage(newErrorMessage(reason)); err != nil {
			r.log.Println("Error sending shutdown message: ", err)
		}
	}
	r.playersState = nil
	r.alive = false
	r.roomClosing <- r
	if r.phaseChangeTimer != nil {
		r.phaseChangeTimer.Stop()
	}
}

func (r *Room) schedulePhase(after time.Duration, phase GamePhase) {
	r.phaseChangeTimer = time.AfterFunc(after, func() {
		r.changePhaseChannel <- phase
	})
}

func (r *Room) getEnemy(client *Client) *Client {
	for candidate := range r.playersState {
		if client != candidate {
			return candidate
		}
	}
	return client
}

func (r *Room) generateClientState(client *Client, gameResult *GameResult, battleStatistics *BattleStatistics) *Message {
	playerState := r.playersState[client]
	enemy := r.getEnemy(client)
	enemyState := r.playersState[enemy]

	var publicQuestion *PublicQuestion
	if playerState.Question != nil {
		publicQuestion = &playerState.Question.PublicQuestion
	}

	return &Message{
		MessageType: MessageTypeStateChange,
		Payload: &PlayerStatePayload{
			Phase:               r.phase,
			PhaseEndsAt:         r.phaseStarted.Add(phaseDurations[r.phase]).Unix(),
			Round:               r.round,
			GameResult:          gameResult,
			Player:              playerState.Player,
			Enemy:               enemyState.Player,
			Question:            publicQuestion,
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
	r.round++
	for _, state := range r.playersState {
		state.UnitsPlacement = []UnitPlacement{}

		units, err := GetStoreUnits(r.round)
		if err != nil {
			r.log.Println("Failed fetching units ", err)
			r.Shutdown("Failed fetching units")
			return
		}
		state.Store = units
	}

	for c := range r.playersState {
		if err := c.SendMessage(r.generateClientState(c, nil, nil)); err != nil {
			r.Shutdown("Failed to propagate client state")
			r.log.Println("Failed to propagate client state for ", c.nickname, err)
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
		r.log.Println("Failed fetching battle result", err)
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
			r.log.Println("Failed to propagate client state for ", c.nickname, err)
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
		r.log.Println("Failed to fetch question", err)
		return
	}

	for c, state := range r.playersState {
		state.Question = question
		if err := c.SendMessage(r.generateClientState(c, nil, nil)); err != nil {
			r.Shutdown("Failed to propagate client state")
			r.log.Println("Failed to propagate client state for ", c.nickname, err)
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
			r.log.Println("Failed to propagate client state for ", c.nickname, err)
			return
		}
	}
	r.Shutdown("Game ended")
}

func (r *Room) handlePhaseChange(phase GamePhase) {
	r.log.Println("Starting new phase ", phase)
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
		client.SendMessage(newErrorMessage("You can only buy units in store phase"))
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
		client.SendMessage(newErrorMessage("Unit not in store"))
		return
	}

	if state.Player.Money < unitToBuy.Price {
		client.SendMessage(newErrorMessage("You don't have enough money"))
		return
	}

	state.Player.Money -= unitToBuy.Price
	state.Store = append(state.Store[:unitIndex], state.Store[unitIndex+1:]...)
	state.Units = append(state.Units, *unitToBuy)

	if err := client.SendMessage(r.generateClientState(client, nil, nil)); err != nil {
		r.Shutdown("Failed to propagate client state")
		r.log.Println("Failed to propagate client state for ", client.nickname, err)
	}

	if err := client.SendMessage(newInfoMessage("Unit bought")); err != nil {
		r.Shutdown("Failed to send info message")
		r.log.Println("Failed to send info message", client.nickname, err)
	}
}

func (r *Room) handleAnswerQuestion(client *Client, answer AnswerQuestionPayload) {
	if r.phase != GamePhaseQuestion {
		client.SendMessage(newErrorMessage("You can only answer questions in question phase"))
		return
	}

	state := r.playersState[client]

	if state.Question == nil {
		client.SendMessage(newErrorMessage("Missing question"))
		r.log.Println("Missing question while in question phase")
		return
	}

	questionResult := QuestionResultIncorrect
	reward := 0
	if state.Question.CorrectAnswer == answer.AnswerID {
		reward = questionReward
		questionResult = QuestionResultCorrect
		state.Player.Money += reward
	}

	state.Question = nil

	if err := client.SendMessage(r.generateClientState(client, nil, nil)); err != nil {
		r.Shutdown("Failed to propagate client state")
		r.log.Println("Failed to propagate client state for ", client.nickname, err)
	}

	if err := client.SendMessage(newQuestionResultMessage(questionResult, reward)); err != nil {
		r.Shutdown("Failed to propagate question result")
		r.log.Println("Failed to propagate question result", client.nickname, err)
	}

	message := newInfoMessage(fmt.Sprintf("Correct answer, +%d €cts", reward))
	if questionResult == QuestionResultIncorrect {
		message = newErrorMessage("Incorrect answer")
	}

	if err := client.SendMessage(message); err != nil {
		r.Shutdown("Failed to propagate question message")
		r.log.Println("Failed to propagate question message", client.nickname, err)
	}
}

func (r *Room) handleUnplaceUnit(client *Client, payload UnplaceUnitPayload) {
	if r.phase != GamePhaseStore {
		client.SendMessage(newInfoMessage("You can only place units in store phase"))
		return
	}
	state := r.playersState[client]

	var unitToUnplace *Unit
	for _, unit := range state.Units {
		if unit.ID == payload.ID {
			unitToUnplace = &unit
			break
		}
	}

	if unitToUnplace == nil {
		client.SendMessage(newInfoMessage("You don't own that unit"))
		r.log.Println("Client tried to place invalid unit")
		return
	}

	for i, existing := range state.UnitsPlacement {
		if existing.UnitID == payload.ID {
			state.UnitsPlacement = append(state.UnitsPlacement[:i], state.UnitsPlacement[i+1:]...)
			break
		}
	}

	if err := client.SendMessage(r.generateClientState(client, nil, nil)); err != nil {
		r.Shutdown("Failed to propagate client state")
		r.log.Println("Failed to propagate client state for ", client.nickname, err)
	}
}

func (r *Room) handlePlaceUnit(client *Client, payload PlaceUnitPayload) {
	if r.phase != GamePhaseStore {
		client.SendMessage(newErrorMessage("You can only place units in store phase"))
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
		client.SendMessage(newErrorMessage("You don't own that unit"))
		r.log.Println("Client tried to place invalid unit")
		return
	}

	moved := false
	for i, existing := range state.UnitsPlacement {
		if existing.UnitID == placement.UnitID {
			moved = true
			state.UnitsPlacement[i] = placement
			break
		}
	}

	swapped := false
	for i, existing := range state.UnitsPlacement {
		if existing.X == placement.X && existing.Y == placement.Y {
			swapped = true
			state.UnitsPlacement[i] = placement
			break
		}
	}

	if !swapped && !moved {
		state.UnitsPlacement = append(state.UnitsPlacement, placement)
	}

	if err := client.SendMessage(r.generateClientState(client, nil, nil)); err != nil {
		r.Shutdown("Failed to propagate client state")
		r.log.Println("Failed to propagate client state for ", client.nickname, err)
	}
}

func (r *Room) Start() {
	r.log.Println("Starting room")
	// should send battle beginning phase to clients
	r.schedulePhase(phaseDurations[GamePhaseWaiting], GamePhaseStore)

	for r.alive {
		select {
		case <-r.ClientDisconnectChannel:
			r.Shutdown("Client disconnected")
		case phase := <-r.changePhaseChannel:
			r.handlePhaseChange(phase)
		case message := <-r.BuyUnitChannel:
			if message.BuyUnitPayload == nil {
				message.Client.SendMessage(newErrorMessage("Missing payload"))
				continue
			}
			r.handleBuyUnit(message.Client, *message.BuyUnitPayload)
		case message := <-r.AnswerQuestionChannel:
			if message.AnswerQuestionPayload == nil {
				message.Client.SendMessage(newErrorMessage("Missing payload"))
				continue
			}
			r.handleAnswerQuestion(message.Client, *message.AnswerQuestionPayload)
		case message := <-r.PlaceUnitChannel:
			if message.PlaceUnitPayload == nil {
				message.Client.SendMessage(newErrorMessage("Missing payload"))
				continue
			}
			r.handlePlaceUnit(message.Client, *message.PlaceUnitPayload)
		case message := <-r.UnplaceUnitChannel:
			if message.UnplaceUnitPayload == nil {
				message.Client.SendMessage(newInfoMessage("Missing payload"))
				continue
			}
			r.handleUnplaceUnit(message.Client, *message.UnplaceUnitPayload)
		}
	}
}
