package main

const (
	RoomSize = 2
)

type Room struct {
	players []*Client
	gamePhase GamePhase
	//gameState ..sth

	BuyUnitChannel chan BuyUnitMessage
	PlaceUnitChannel chan PlaceUnitMessage
	AnswerQuestionChannel chan AnswerQuestionMessage
}

type BuyUnitMessage struct {
	Client *Client `json:"-"`
	BuyUnitPayload *BuyUnitPayload `json:"payload"`
}

type AnswerQuestionMessage struct {
	Client *Client `json:"-"`
	AnswerQuestionPayload *AnswerQuestionPayload `json:"payload"`
}

type PlaceUnitMessage struct {
	Client *Client `json:"-"`
	PlaceUnitPayload *PlaceUnitPayload `json:"payload"`
}

func newRoom() *Room {
	return &Room{}
}

func(r *Room) AddClient(client *Client) {
	r.players = append(r.players, client)
}

func (r *Room) Full() bool {
	return len(r.players) == RoomSize
}

func(r *Room) Start() {
	// should send battle beginning phase to clients
}
