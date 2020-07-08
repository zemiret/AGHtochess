package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"math/rand"
)

const (
	QUESTIONS_FILE = "assets/questions.json"
)

type Questions []*Question

var questions Questions

func GetQuestion() (*Question, error) {
	if questions == nil {
		return nil, errors.New("questions not loaded")
	}
	return questions[rand.Intn(len(questions))], nil
}


func LoadQuestions() error {
	content, err := ioutil.ReadFile(QUESTIONS_FILE)
	if err != nil {
		log.Printf("Error loading file: %s", QUESTIONS_FILE)
		return err
	}

	if err != json.Unmarshal(content, &questions) {
		log.Printf("Error unmarshalling file: %s", QUESTIONS_FILE)
		return err
	}

	return nil
}