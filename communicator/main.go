package main

import (
	"fmt"
	"log"
	"net/http"
)

const port = 4000

func main() {

	fmt.Printf("Starting communicator at :%d\n", port)

	hub := newHub()
	go hub.run()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}