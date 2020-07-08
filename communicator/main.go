package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"
	"os"
)

const port = 4000

func main() {
	rand.Seed(time.Now().UTC().UnixNano())

	fmt.Printf("Starting communicator at :%d\n", port)
	loadedQuestions, err := LoadQuestions()
	if err != nil {
		log.Fatal("Did not load questions", err)
	}

	questions = loadedQuestions

	if mechanicsHost = os.Getenv("MECHANICS_HOST"); len(mechanicsHost) == 0 {
		mechanicsHost = "http://localhost:5000"
	}

	hub := newHub()
	go hub.run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	fmt.Printf("Starting communicator at :%d\n", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}