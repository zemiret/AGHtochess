package main

import (
	"fmt"
	"log"
	"math"
	"math/rand"
	"os"
	"time"
)

const (
	initialHp      = 100
	initialMoney   = 5000
	questionReward = 100
	boardWidth     = 6
	boardHeight    = 8

	logActionTime = 200 * time.Millisecond
	logStaleTime  = 2 * time.Second
	unitSellPriceMultiplier = 0.5
)

var phaseDurations = map[GamePhase]time.Duration{
	GamePhaseWaiting:      1 * time.Second,
	GamePhaseStore:        15 * time.Second,
	GamePhaseBattle:       1 * time.Second,
	GamePhaseBattleResult: 4 * time.Second,
	GamePhaseQuestion:     10 * time.Second,
	GamePhaseGameEnd:      1 * time.Second,
}

type PlayerState struct {
	Player           Player            `json:"player"`
	Question         *Question         `json:"question"`
	Store            []Unit            `json:"store"`
	Units            []Unit            `json:"units"`
	UnitsPlacement   []UnitPlacement   `json:"unitsPlacement"`
	BattleStatistics *BattleStatistics `json:"battleStatistics,omitempty"`
	GameResult       *GameResult       `json:"gameResult,omitempty"`
	enemy            *Client           `json:"-"`
}

type Room struct {
	capacity int

	log          *log.Logger
	playersState map[*Client]*PlayerState
	clients      []*Client

	phase       GamePhase
	phaseEndsAt time.Time

	round int

	BuyUnitChannel        chan BuyUnitMessage
	SellUnitChannel       chan SellUnitMessage
	PlaceUnitChannel      chan PlaceUnitMessage
	UnplaceUnitChannel    chan UnplaceUnitMessage
	AnswerQuestionChannel chan AnswerQuestionMessage
	changePhaseChannel    chan GamePhase

	ClientDisconnectChannel chan *Client
	roomClosing             chan<- *Room
	clientClosing           chan<- *Client

	roomAlive bool

	phaseChangeTimer *time.Timer
}

type BuyUnitMessage struct {
	Client         *Client         `json:"-"`
	BuyUnitPayload *BuyUnitPayload `json:"payload"`
}

type SellUnitMessage struct {
	Client          *Client          `json:"-"`
	SellUnitPayload *SellUnitPayload `json:"payload"`
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

func newRoom(roomClosing chan<- *Room, clientClosing chan<- *Client, capacity int) *Room {
	return &Room{
		capacity:                capacity,
		log:                     log.New(os.Stdout, "[Room]", log.Flags()),
		playersState:            map[*Client]*PlayerState{},
		clients:                 []*Client{},
		phase:                   GamePhaseWaiting,
		BuyUnitChannel:          make(chan BuyUnitMessage),
		SellUnitChannel:         make(chan SellUnitMessage),
		AnswerQuestionChannel:   make(chan AnswerQuestionMessage),
		PlaceUnitChannel:        make(chan PlaceUnitMessage),
		UnplaceUnitChannel:      make(chan UnplaceUnitMessage),
		ClientDisconnectChannel: make(chan *Client, capacity),
		changePhaseChannel:      make(chan GamePhase),
		roomAlive:               true,
		roomClosing:             roomClosing,
		clientClosing:           clientClosing,
	}
}

func (r *Room) AddClient(client *Client) {
	r.clients = append(r.clients, client)
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
	return len(r.playersState) == r.capacity
}

func (r *Room) Shutdown(reason string) {
	r.log.Println("Shutting down")
	for client := range r.playersState {
		if err := client.SendMessage(newErrorMessage(reason)); err != nil {
			r.log.Println("Error sending shutdown message: ", err)
		}
	}
	r.playersState = nil
	r.roomAlive = false
	r.roomClosing <- r
	if r.phaseChangeTimer != nil {
		r.phaseChangeTimer.Stop()
	}
}

func (r *Room) ShutdownOrFinish(client *Client, reason string) {
	if r.duelMode() {
		r.Shutdown(reason)
	} else {
		r.finishGameForPlayer(client, false)
	}
}

func (r *Room) duelMode() bool {
	return len(r.clients) <= 2
}

func (r *Room) schedulePhase(after time.Duration, phase GamePhase) {
	r.log.Printf("Scheduling %s after %s\n", phase, after)
	r.phaseEndsAt = time.Now().Add(after)
	r.phaseChangeTimer = time.AfterFunc(after, func() {
		r.changePhaseChannel <- phase
	})
}

func (r *Room) getEnemy(client *Client) *Client {
	return r.playersState[client].enemy
}

func (r *Room) generateClientState(client *Client) *Message {
	playerState := r.playersState[client]
	enemy := r.getEnemy(client)

	var enemyPlayer *Player
	var enemyUnits = []Unit{}
	var enemyUnitsPlacement = []UnitPlacement{}

	if enemy != nil {
		enemyState := r.playersState[enemy]
		enemyPlayer = &enemyState.Player
		enemyUnits = enemyState.Units
		enemyUnitsPlacement = mirrorUnitPlacements(enemyState.UnitsPlacement)
	}

	var publicQuestion *PublicQuestion
	if playerState.Question != nil {
		publicQuestion = &playerState.Question.PublicQuestion
	}

	return &Message{
		MessageType: MessageTypeStateChange,
		Payload: &PlayerStatePayload{
			Phase:               r.phase,
			PhaseEndsAt:         r.phaseEndsAt.Unix(),
			Round:               r.round,
			GameResult:          playerState.GameResult,
			Player:              playerState.Player,
			Enemy:               enemyPlayer,
			Question:            publicQuestion,
			Store:               playerState.Store,
			Units:               playerState.Units,
			UnitsPlacement:      playerState.UnitsPlacement,
			EnemyUnits:          enemyUnits,
			EnemyUnitsPlacement: enemyUnitsPlacement,
			BattleStatistics:    playerState.BattleStatistics,
		},
	}
}

func (r *Room) rerollPlayersMatching() {
	for _, state := range r.playersState {
		state.enemy = nil
	}
	rand.Shuffle(len(r.clients), func(i, j int) { r.clients[i], r.clients[j] = r.clients[j], r.clients[i] })
	for i := 0; i < len(r.clients)/2; i++ {
		player1 := r.clients[i]
		player2 := r.clients[len(r.clients)-i-1]
		r.playersState[player1].enemy = player2
		r.playersState[player2].enemy = player1
	}
}

func (r *Room) startStorePhase() {
	r.rerollPlayersMatching()
	r.round++

	for _, state := range r.playersState {
		units, err := GetStoreUnits(r.round)
		if err != nil {
			r.log.Println("Failed fetching units ", err)
			r.Shutdown("Failed fetching units")
			return
		}
		state.Store = units
	}

	r.schedulePhase(phaseDurations[GamePhaseStore], GamePhaseBattle)

	for c := range r.playersState {
		if err := c.SendMessage(r.generateClientState(c)); err != nil {
			r.statePropagationFail(c, err)
			if r.duelMode() {
				return
			}
		}
	}

}

func (r *Room) statePropagationFail(client *Client, err error) {
	r.ShutdownOrFinish(client, "Failed to propagate client state")
	r.log.Println("Failed to propagate client state for ", client.nickname, err)
}

func (r *Room) startBattlePhase() {
	type PlayerPair struct {
		players  [2]*Client
		loserIdx int
	}
	var alreadyMatched []*Client
	var playerPairs []*PlayerPair

	battleDuration := phaseDurations[GamePhaseBattle]

	for client := range r.playersState {
		playerPair := &PlayerPair{
			players: [2]*Client{client, r.getEnemy(client)},
		}
		if clientInSlice(client, alreadyMatched) || playerPair.players[1] == nil {
			continue
		}

		alreadyMatched = append(alreadyMatched, playerPair.players[0], playerPair.players[1])
		playerPairs = append(playerPairs, playerPair)
	}

	for _, playerPair := range playerPairs {
		player1State := r.playersState[playerPair.players[0]]
		player1 := PlayerBattleSetup{
			UnitPlacement: player1State.UnitsPlacement,
			Units:         player1State.Units,
		}

		player2State := r.playersState[playerPair.players[1]]
		player2 := PlayerBattleSetup{
			UnitPlacement: mirrorUnitPlacements(player2State.UnitsPlacement),
			Units:         player2State.Units,
		}

		battleResult, err := GetBattleResult(player1, player2)
		if err != nil {
			r.Shutdown("Failed fetching battle result")
			r.log.Println("Failed fetching battle result", err)
			return
		}

		duration := calculateBattleDuration(battleResult)
		if duration > battleDuration {
			battleDuration = duration
		}

		for i, c := range playerPair.players {
			if i != battleResult.Winner {
				playerPair.loserIdx = i
				r.playersState[c].Player.Hp += battleResult.PlayerHpChange
			}
		}

		for i, c := range playerPair.players {
			battleStatistics := BattleStatistics{
				Log: battleResult.Log,
			}
			if i == battleResult.Winner {
				battleStatistics.Result = GameResultWin
			} else {
				battleStatistics.Result = GameResultLoss
				battleStatistics.PlayerHpChange = battleResult.PlayerHpChange
			}

			r.playersState[c].BattleStatistics = &battleStatistics
		}
	}

	var newClients []*Client
	for _, client := range r.clients {
		if r.playersState[client].Player.Hp > 0 {
			newClients = append(newClients, client)
		}
	}
	r.clients = newClients

	r.schedulePhase(battleDuration, GamePhaseBattleResult)

	for c := range r.playersState {
		if err := c.SendMessage(r.generateClientState(c)); err != nil {
			r.statePropagationFail(c, err)
			if r.duelMode() {
				return
			}
		}
	}
}

func (r *Room) startBattleResultPhase() {
	if len(r.clients) > 1 {
		r.schedulePhase(phaseDurations[GamePhaseBattleResult], GamePhaseQuestion)
	} else {
		r.schedulePhase(phaseDurations[GamePhaseBattleResult], GamePhaseGameEnd)
	}

	for c, state := range r.playersState {
		if err := c.SendMessage(r.generateClientState(c)); err != nil {
			r.statePropagationFail(c, err)
			if r.duelMode() {
				return
			}
		}
		state.BattleStatistics = nil
	}
}

func (r *Room) finishGameForPlayer(c *Client, sendState bool) {
	r.log.Printf("Finishing game for: %v\n", c.nickname)

	// I am disconnecting, so my enemy loses his opponent (me)
	enemy := r.getEnemy(c)
	if enemy != nil {
		r.playersState[enemy].enemy = nil
		if err := enemy.SendMessage(newErrorMessage("Enemy disconnected")); err != nil {
			r.log.Println("Error sending disconnect message message: ", err)
		}

		if err := enemy.SendMessage(r.generateClientState(enemy)); err != nil {
			r.statePropagationFail(enemy, err)
			if r.duelMode() {
				return
			}
		}
	}

	r.log.Printf("Finishing game for %v\n", c.nickname)
	if sendState {
		r.sendGameEndState(c, r.playersState[c])
		if err := c.SendMessage(newInfoMessage("Game finished")); err != nil {
			r.log.Println("Error sending finishing message: ", err)
		}
	}

	r.clients = removeClientFromSlice(r.clients, findClientInSlice(c, r.clients))
	delete(r.playersState, c)
	r.clientClosing <- c
}

func (r *Room) startQuestionPhase() {
	question, err := GetQuestion()
	if err != nil {
		r.Shutdown("Failed to fetch question")
		r.log.Println("Failed to fetch question", err)
		return
	}

	r.schedulePhase(phaseDurations[GamePhaseQuestion], GamePhaseStore)

	for c, state := range r.playersState {
		state.Question = question
		if err := c.SendMessage(r.generateClientState(c)); err != nil {
			r.statePropagationFail(c, err)
			if r.duelMode() {
				return
			}
		}
	}
}

func (r *Room) startGameEndPhase() {
	for c, state := range r.playersState {
		r.sendGameEndState(c, state)
	}
	r.Shutdown("Game ended")
}

func (r *Room) sendGameEndState(c *Client, state *PlayerState) {
	var gameResult GameResult
	if state.Player.Hp > 0 {
		gameResult = GameResultWin
	} else {
		gameResult = GameResultLoss
	}
	state.GameResult = &gameResult
	if err := c.SendMessage(r.generateClientState(c)); err != nil {
		r.statePropagationFail(c, err)
		if r.duelMode() {
			return
		}
	}
}

func (r *Room) handlePhaseChange(phase GamePhase) {
	r.log.Println("Starting new phase ", phase)

	for client, state := range r.playersState {
		state.Question = nil
		state.Store = []Unit{}
		state.GameResult = nil

		if state.Player.Hp <= 0 {
			r.finishGameForPlayer(client, true)
		}
	}

	r.phase = phase
	switch phase {
	case GamePhaseStore:
		r.startStorePhase()
	case GamePhaseBattle:
		r.startBattlePhase()
	case GamePhaseBattleResult:
		r.startBattleResultPhase()
	case GamePhaseQuestion:
		r.startQuestionPhase()
	case GamePhaseGameEnd:
		r.startGameEndPhase()
	}
}

func (r *Room) handleBuyUnit(c *Client, payload BuyUnitPayload) {
	if r.phase != GamePhaseStore {
		c.SendMessage(newErrorMessage("You can only buy units in store phase"))
		return
	}

	state := r.playersState[c]

	var unitToBuy *Unit
	var unitIndex int
	for i, unitInStore := range state.Store {
		if unitInStore.ID == payload.ID {
			unitToBuy = &unitInStore
			unitIndex = i
			break
		}
	}

	if unitToBuy == nil {
		c.SendMessage(newErrorMessage("Unit not in store"))
		return
	}

	if state.Player.Money < unitToBuy.Price {
		c.SendMessage(newErrorMessage("You don't have enough money"))
		return
	}

	state.Player.Money -= unitToBuy.Price
	state.Store = append(state.Store[:unitIndex], state.Store[unitIndex+1:]...)
	state.Units = append(state.Units, *unitToBuy)

	if err := c.SendMessage(r.generateClientState(c)); err != nil {
		r.statePropagationFail(c, err)
		if r.duelMode() {
			return
		}
	}

	if err := c.SendMessage(newInfoMessage("Unit bought")); err != nil {
		r.statePropagationFail(c, err)
		if r.duelMode() {
			return
		}
	}
}

func (r *Room) handleSellUnit(c *Client, payload SellUnitPayload) {
	state := r.playersState[c]

	var unitToSell *Unit
	var unitIndex int
	for i, unitInBackpack := range state.Units {
		if unitInBackpack.ID == payload.ID {
			unitToSell = &unitInBackpack
			unitIndex = i
			break
		}
	}

	if unitToSell == nil {
		c.SendMessage(newErrorMessage("Unit not in backpack"))
		return
	}

	for i, unitPlacement := range state.UnitsPlacement {
		if unitPlacement.UnitID == payload.ID {
			state.UnitsPlacement = append(state.UnitsPlacement[:i], state.UnitsPlacement[i+1:]...)
			break
		}
	}

	state.Player.Money += int(math.Ceil(float64(unitToSell.Price) * unitSellPriceMultiplier))
	state.Units = append(state.Units[:unitIndex], state.Units[unitIndex+1:]...)

	if err := c.SendMessage(r.generateClientState(c)); err != nil {
		r.statePropagationFail(c, err)
		if r.duelMode() {
			return
		}
	}

	if err := c.SendMessage(newInfoMessage("Unit sold")); err != nil {
		r.statePropagationFail(c, err)
		if r.duelMode() {
			return
		}
	}
}

func (r *Room) handleAnswerQuestion(c *Client, answer AnswerQuestionPayload) {
	if r.phase != GamePhaseQuestion {
		c.SendMessage(newErrorMessage("You can only answer questions in question phase"))
		return
	}

	state := r.playersState[c]

	if state.Question == nil {
		c.SendMessage(newErrorMessage("Missing question"))
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

	if err := c.SendMessage(r.generateClientState(c)); err != nil {
		r.statePropagationFail(c, err)
		if r.duelMode() {
			return
		}
	}

	if err := c.SendMessage(newQuestionResultMessage(questionResult, reward)); err != nil {
		r.statePropagationFail(c, err)
		if r.duelMode() {
			return
		}
	}

	message := newInfoMessage(fmt.Sprintf("Correct answer, +%d €cts", reward))
	if questionResult == QuestionResultIncorrect {
		message = newErrorMessage("Incorrect answer")
	}

	if err := c.SendMessage(message); err != nil {
		r.statePropagationFail(c, err)
		if r.duelMode() {
			return
		}
	}
}

func (r *Room) handlePlaceUnit(client *Client, payload PlaceUnitPayload) {
	if r.phase != GamePhaseStore {
		client.SendMessage(newErrorMessage("You can only place units in store phase"))
		return
	}

	if payload.X < 0 || payload.X >= boardWidth || payload.Y < boardHeight/2 || payload.Y >= boardHeight {
		client.SendMessage(newErrorMessage("You can only place units on your side"))
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

	var existingPlacement *UnitPlacement
	for i, existing := range state.UnitsPlacement {
		if existing.UnitID == payload.ID {
			existingPlacement = &existing
			state.UnitsPlacement = append(state.UnitsPlacement[:i], state.UnitsPlacement[i+1:]...)
			break
		}
	}

	for i, existing := range state.UnitsPlacement {
		if existing.X == placement.X && existing.Y == placement.Y {
			if existingPlacement != nil {
				state.UnitsPlacement[i].X = existingPlacement.X
				state.UnitsPlacement[i].Y = existingPlacement.Y
			} else {
				state.UnitsPlacement = append(state.UnitsPlacement[:i], state.UnitsPlacement[i+1:]...)
			}
			break
		}
	}

	state.UnitsPlacement = append(state.UnitsPlacement, placement)

	for _, player := range []*Client{client, r.getEnemy(client)} {
		if player == nil {
			continue
		}

		if err := player.SendMessage(r.generateClientState(player)); err != nil {
			r.statePropagationFail(player, err)
			if r.duelMode() {
				return
			}
		}
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

	for _, player := range []*Client{client, r.getEnemy(client)} {
		if player == nil {
			continue
		}

		if err := player.SendMessage(r.generateClientState(player)); err != nil {
			r.statePropagationFail(player, err)
			if r.duelMode() {
				return
			}
		}
	}
}

func (r *Room) Start() {
	r.log.Println("Starting room")
	// should send battle beginning phase to clients
	r.schedulePhase(phaseDurations[GamePhaseWaiting], GamePhaseStore)

	for r.roomAlive {
		select {
		case client := <-r.ClientDisconnectChannel:
			r.ShutdownOrFinish(client, "Client disconnected")
		case phase := <-r.changePhaseChannel:
			r.handlePhaseChange(phase)
		case message := <-r.SellUnitChannel:
			if message.SellUnitPayload == nil {
				message.Client.SendMessage(newErrorMessage("Missing payload"))
				continue
			}
			r.handleSellUnit(message.Client, *message.SellUnitPayload)
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

func findClientInSlice(client *Client, arr []*Client) int {
	for i, c := range arr {
		if c == client {
			return i
		}
	}
	return -1
}

func clientInSlice(client *Client, arr []*Client) bool {
	return findClientInSlice(client, arr) != -1
}

func removeClientFromSlice(s []*Client, i int) []*Client {
	if i == -1 {
		return s
	}
	s[i] = s[len(s)-1]
	return s[:len(s)-1]
}

func calculateBattleDuration(battle *PlayerBattleResult) time.Duration {
	return time.Duration(len(battle.Log))*logActionTime + logStaleTime
}
