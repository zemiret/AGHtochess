package main

type Room struct {
	players []*Client
}

func(r *Room) AddClient(client *Client) {
	r.players = append(r.players, client)
}

func(r *Room) Start()
