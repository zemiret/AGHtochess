package main

type MessageType string
type GamePhase string
type GameResult string
type QuestionResult string
type GameType string

type QuestionDifficulty string

const (
	MessageTypeStateChange    MessageType = "STATE_CHANGE"
	MessageTypeInfo           MessageType = "INFO"
	MessageTypeError          MessageType = "ERROR"
	MessageTypeQuestionResult MessageType = "QUESTION_RESULT"

	MessageTypeBuyUnit     MessageType = "BUY_UNIT"
	MessageTypeSellUnit    MessageType = "SELL_UNIT"
	MessageTypePlaceUnit   MessageType = "PLACE_UNIT"
	MessageTypeUnplaceUnit MessageType = "UNPLACE_UNIT"

	GamePhaseWaiting      GamePhase = "WAITING_FOR_PLAYERS"
	GamePhaseStore        GamePhase = "STORE"
	GamePhaseBattle       GamePhase = "BATTLE"
	GamePhaseBattleResult GamePhase = "BATTLE_RESULT"
	GamePhaseGameEnd      GamePhase = "GAME_END"

	ResultWin  GameResult = "WIN"
	ResultLoss GameResult = "LOSS"
	ResultDraw GameResult = "DRAW"

	GameTypeDuel   = "DUEL"
	GameTypeRoyale = "ROYALE"

	QuestionDifficultyEasy   = "EASY"
	QuestionDifficultyMedium = "MEDIUM"
	QuestionDifficultyHard   = "HARD"
)

type Message struct {
	MessageType MessageType `json:"messageType"`
	Payload     interface{} `json:"payload"`
}

type InfoPayload struct {
	Message string `json:"message"`
}

func newInfoMessage(message string) *Message {
	return &Message{
		MessageType: MessageTypeInfo,
		Payload: InfoPayload{
			Message: message,
		},
	}
}

func newErrorMessage(message string) *Message {
	return &Message{
		MessageType: MessageTypeError,
		Payload: InfoPayload{
			Message: message,
		},
	}
}

type PlayerStatePayload struct {
	Phase               GamePhase         `json:"phase"`
	PhaseEndsAt         int64             `json:"phaseEndsAt"`
	Round               int               `json:"round"`
	GameResult          *GameResult       `json:"gameResult,omitempty"`
	Player              Player            `json:"player"`
	Enemy               *Player           `json:"enemy"`
	Store               []StoreUnit       `json:"store"`
	Units               []Unit            `json:"units"`
	UnitsPlacement      []UnitPlacement   `json:"unitsPlacement"`
	EnemyUnits          []Unit            `json:"enemyUnits"`
	EnemyUnitsPlacement []UnitPlacement   `json:"enemyUnitsPlacement"`
	BattleStatistics    *BattleStatistics `json:"battleStatistics,omitempty"`
}

type Player struct {
	Username string `json:"username"`
	Hp       int    `json:"hp"`
	Money    int    `json:"money"`
}

type Answer struct {
	ID   int    `json:"id"`
	Text string `json:"text"`
}

type Question struct {
	PublicQuestion
	CorrectAnswer int `json:"correctAnswer"`
}

type PublicQuestion struct {
	ID         int                `json:"id"`
	Text       string             `json:"text"`
	Answers    []Answer           `json:"answers"`
	Difficulty QuestionDifficulty `json:"difficulty"`
}

type Unit struct {
	ID             string `json:"id"`
	Attack         int    `json:"attack"`
	Defense        int    `json:"defense"`
	MagicResist    int    `json:"magicResist"`
	CriticalChance int    `json:"criticalChance"`
	Hp             int    `json:"hp"`
	Range          int    `json:"range"`
	AttackSpeed    int    `json:"attackSpeed"`
	Type           string `json:"type"`
	Price          int    `json:"price"`
}

type UnitQuestions map[QuestionDifficulty]Question

type StoreUnit struct {
	Unit      Unit          `json:"unit"`
	Questions UnitQuestions `json:"questions"`
}

type UnitPlacement struct {
	UnitID string `json:"unitId"`
	X      int    `json:"x"`
	Y      int    `json:"y"`
}

type BattleStatistics struct {
	Result         GameResult    `json:"result"`
	PlayerHpChange int           `json:"playerHpChange"`
	Log            []interface{} `json:"log"`
}

type BuyUnitPayload struct {
	ID                 string              `json:"id"`
	QuestionDifficulty *QuestionDifficulty `json:"questionDifficulty,omitempty"`
	QuestionAnswerID   *int                `json:"questionAnswerId,omitempty"`
}

type SellUnitPayload struct {
	ID string `json:"id"`
}

type QuestionResultPayload struct {
	Result QuestionResult `json:"result"`
	Reward int            `json:"reward"`
}

func newQuestionResultMessage(result QuestionResult, reward int) *Message {
	return &Message{
		MessageType: MessageTypeQuestionResult,
		Payload: &QuestionResultPayload{
			Result: result,
			Reward: reward,
		},
	}
}

type PlaceUnitPayload struct {
	ID string `json:"id"`
	X  int    `json:"x"`
	Y  int    `json:"y"`
}

type UnplaceUnitPayload struct {
	ID string `json:"id"`
}
