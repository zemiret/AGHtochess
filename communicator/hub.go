package main

import (
	"encoding/json"
	"log"
	"os"
	"time"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	log *log.Logger
	// Registered clients.
	clients map[*Client]*Room

	waitingRoom *Room

	// Inbound messages from the clients.
	inbound chan InboundMessage

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	roomClosing chan *Room
}

func newHub() *Hub {
	roomClosing := make(chan *Room)
	return &Hub{
		log:         log.New(os.Stdout, "[Hub]", log.Flags()),
		inbound:     make(chan InboundMessage),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		clients:     make(map[*Client]*Room),
		roomClosing: roomClosing,
		waitingRoom: newRoom(roomClosing),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.waitingRoom.AddClient(client)
			h.clients[client] = h.waitingRoom

			if h.waitingRoom.Full() {
				go h.waitingRoom.Start()
				h.waitingRoom = newRoom(h.roomClosing)
			}
		case closingRoom := <-h.roomClosing:
			for player, room := range h.clients {
				if room != closingRoom {
					continue
				}
				delete(h.clients, player)

				closeFun := func(client *Client) func() {
					return func() {
						h.log.Printf("Closing %s connection\n", client.nickname)
						close(client.send)
					}
				}

				time.AfterFunc(5*time.Second, closeFun(player))
			}
		case client := <-h.unregister:
			if room, ok := h.clients[client]; ok {
				room.ClientDisconnectChannel <- client
			}
		case inboundMessage := <-h.inbound:
			h.log.Println("Inbound message: ", string(inboundMessage.Message))

			client := inboundMessage.Client
			if clientRoom, ok := h.clients[client]; ok {
				if !clientRoom.Full() {
					h.log.Println("Unexpected message: ", inboundMessage.Message)
					continue
				}
				var messageType struct {
					MessageType MessageType `json:"messageType"`
				}
				if err := json.Unmarshal(inboundMessage.Message, &messageType); err != nil {
					h.log.Println("Inbound message malformed", err)
					continue
				}

				switch messageType.MessageType {
				case MessageTypeBuyUnit:
					var buyUnitMessage BuyUnitMessage
					if err := json.Unmarshal(inboundMessage.Message, &buyUnitMessage); err != nil {
						h.log.Println("Invalid message", err)
						continue
					}
					buyUnitMessage.Client = inboundMessage.Client
					clientRoom.BuyUnitChannel <- buyUnitMessage
				case MessageTypeAnswerQuestion:
					var answerQuestionMessage AnswerQuestionMessage
					if err := json.Unmarshal(inboundMessage.Message, &answerQuestionMessage); err != nil {
						h.log.Println("Invalid message", err)
						continue
					}
					answerQuestionMessage.Client = inboundMessage.Client
					clientRoom.AnswerQuestionChannel <- answerQuestionMessage
				case MessageTypePlaceUnit:
					var placeUnitMessage PlaceUnitMessage
					if err := json.Unmarshal(inboundMessage.Message, &placeUnitMessage); err != nil {
						h.log.Println("Invalid message", err)
						continue
					}
					placeUnitMessage.Client = inboundMessage.Client
					clientRoom.PlaceUnitChannel <- placeUnitMessage
				default:
					h.log.Println("Unknown message type")
				}
			}
		}
	}
}
