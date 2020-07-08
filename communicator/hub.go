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

			log.Printf("Register: %+v", client)

			if h.waitingRoom.Full() {
				go h.waitingRoom.Start()
				h.waitingRoom = newRoom()
			}
		case client := <-h.unregister:
			if closingRoom, ok := h.clients[client]; ok {
				h.clients[client].ClientDisconnectChannel <- client

				for player, room := range h.clients {
					if room != closingRoom {
						continue
					}
					delete(h.clients, player)
				}
			}
		case inboundMessage := <-h.inbound:
			log.Println("Inbound message: ", string(inboundMessage.Message))

			client := inboundMessage.Client
			if clientRoom, ok := h.clients[client]; ok {
				if !clientRoom.Full() {
					log.Println("Unexpected message: ", inboundMessage.Message)
					continue
				}
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
					buyUnitMessage.Client = inboundMessage.Client
					clientRoom.BuyUnitChannel <- buyUnitMessage
				case MessageTypeAnswerQuestion:
					var answerQuestionMessage AnswerQuestionMessage
					if err := json.Unmarshal(inboundMessage.Message, &answerQuestionMessage); err != nil {
						log.Println("Invalid message", err)
						continue
					}
					answerQuestionMessage.Client = inboundMessage.Client
					clientRoom.AnswerQuestionChannel <- answerQuestionMessage
				case MessageTypePlaceUnit:
					var placeUnitMessage PlaceUnitMessage
					if err := json.Unmarshal(inboundMessage.Message, &placeUnitMessage); err != nil {
						log.Println("Invalid message", err)
						continue
					}
					placeUnitMessage.Client = inboundMessage.Client
					clientRoom.PlaceUnitChannel <- placeUnitMessage
				default:
					log.Println("Unknown message type")
				}
			}
		}
	}
}
