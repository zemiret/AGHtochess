package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"
)

const port = 4000

const (
	DefaultQuestionsFile = "assets/questions_local.json"
)

func main() {
	log.SetFlags(log.Flags() | log.Lshortfile)

	rand.Seed(time.Now().UTC().UnixNano())

	fmt.Printf("Starting communicator at :%d\n", port)

	questionsFile := os.Getenv("QUESTIONS_FILE")
	if len(questionsFile) == 0 {
		questionsFile = DefaultQuestionsFile
	}

	loadedQuestions, err := LoadQuestions(questionsFile)
	if err != nil {
		log.Fatal("Did not load questions", err)
	}

	questions = loadedQuestions

	mechanicsHost = os.Getenv("GAME_MECHANICS_HOST")
	if len(mechanicsHost) == 0 {
		mechanicsHost = "http://localhost:5000"
	}

	hub := newHub()
	go hub.run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		if r.Method == http.MethodOptions {
			return
		}
		serveWs(hub, w, r)
	})

	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
