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

	duelWaitingRoom   *Room
	royaleWaitingRoom *Room

	// Inbound messages from the clients.
	inbound chan InboundMessage

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	roomClosing   chan *Room
	clientClosing chan *Client
}

func newHub() *Hub {
	roomClosing := make(chan *Room)
	clientClosing := make(chan *Client)
	return &Hub{
		log:               log.New(os.Stdout, "[Hub]", log.Flags()),
		inbound:           make(chan InboundMessage),
		register:          make(chan *Client),
		unregister:        make(chan *Client),
		clients:           make(map[*Client]*Room),
		roomClosing:       roomClosing,
		clientClosing:     clientClosing,
		duelWaitingRoom:   newDuelRoom(roomClosing),
		royaleWaitingRoom: newRoyaleRoom(roomClosing, clientClosing),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			var roomForClient *Room
			if client.gameType == GameTypeDuel {
				h.log.Printf("Adding %v to duel room\n", client.nickname)
				roomForClient = h.duelWaitingRoom
			} else if client.gameType == GameTypeRoyale {
				h.log.Printf("Adding %v to royale room\n", client.nickname)
				roomForClient = h.royaleWaitingRoom
			} else {
				h.log.Printf("Invalid gameType %v for %v\n", client.gameType, client.nickname)
				continue
			}

			roomForClient.AddClient(client)
			h.clients[client] = roomForClient

			if roomForClient.Full() {
				go roomForClient.Start()

				if client.gameType == GameTypeDuel {
					h.duelWaitingRoom = newDuelRoom(h.roomClosing)
				} else if client.gameType == GameTypeRoyale {
					h.royaleWaitingRoom = newRoyaleRoom(h.roomClosing, h.clientClosing)
				}
			}
		case closingRoom := <-h.roomClosing:
			for client, room := range h.clients {
				if room != closingRoom {
					continue
				}
				h.closeClient(client)
			}
		case closingClient := <-h.clientClosing:
			h.closeClient(closingClient)
		case client := <-h.unregister:
			if room, ok := h.clients[client]; ok {
				room.ClientDisconnectChannel <- client
			}
		case inboundMessage := <-h.inbound:
			h.log.Println("Inbound message: ", string(inboundMessage.Message))

			client := inboundMessage.Client
			if clientRoom, ok := h.clients[client]; ok {
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
				case MessageTypeUnplaceUnit:
					var unplaceUnitMessage UnplaceUnitMessage
					if err := json.Unmarshal(inboundMessage.Message, &unplaceUnitMessage); err != nil {
						h.log.Println("Invalid message", err)
						continue
					}
					unplaceUnitMessage.Client = inboundMessage.Client
					clientRoom.UnplaceUnitChannel <- unplaceUnitMessage
				default:
					h.log.Println("Unknown message type")
				}
			}
		}
	}
}

func (h *Hub) closeClient(client *Client) {
	delete(h.clients, client)
	closeFun := func(client *Client) func() {
		return func() {
			h.log.Printf("Closing %s connection\n", client.nickname)
			close(client.send)
		}
	}

	time.AfterFunc(5*time.Second, closeFun(client))
}
