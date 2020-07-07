package main

import (
	"encoding/json"
	"log"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]*Room

	waitingRoom *Room

	// Inbound messages from the clients.
	inbound chan InboundMessage

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		inbound:     make(chan InboundMessage),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		clients:     make(map[*Client]*Room),
		waitingRoom: newRoom(),
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
				h.waitingRoom = newRoom()
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case inboundMessage := <-h.inbound:
			client := inboundMessage.Client
			if clientRoom, ok := h.clients[client]; ok {
				var messageType struct {
					MessageType MessageType `json:"messageType"`
				}
				if err := json.Unmarshal(inboundMessage.Message, &messageType); err != nil {
					log.Println("Inbound message malformed", err)
					continue
				}

				switch messageType.MessageType {
				case MessageTypeBuyUnit:
					var buyUnitMessage BuyUnitMessage
					if err := json.Unmarshal(inboundMessage.Message, &buyUnitMessage); err != nil {
						log.Println("Invalid message", err)
						continue
					}
					clientRoom.BuyUnitChannel <- buyUnitMessage
				case MessageTypeAnswerQuestion:
					var answerQuestionMessage AnswerQuestionMessage
					if err := json.Unmarshal(inboundMessage.Message, &answerQuestionMessage); err != nil {
						log.Println("Invalid message", err)
						continue
					}
					clientRoom.AnswerQuestionChannel <- answerQuestionMessage
				case MessageTypePlaceUnit:
					var placeUnitMessage PlaceUnitMessage
					if err := json.Unmarshal(inboundMessage.Message, &placeUnitMessage); err != nil {
						log.Println("Invalid message", err)
						continue
					}
					clientRoom.PlaceUnitChannel <- placeUnitMessage
				default:
					log.Println("Unknown message type")
				}
			}
		}
	}
}
