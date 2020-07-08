package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"math/rand"
)

const (
	QuestionsFile = "assets/questions.json"
)

type Questions []*Question

var questions Questions

func GetQuestion() (*Question, error) {
	if questions == nil {
		return nil, errors.New("questions not loaded")
	}
	question := questions[rand.Intn(len(questions))]
	answers := make([]Answer, len(question.Answers))
	copy(answers, question.Answers)

	return &Question{
		ID:            question.ID,
		Text:          question.Text,
		Answers:       answers,
		CorrectAnswer: question.CorrectAnswer,
	}, nil
}


func LoadQuestions() (Questions, error) {
	var questions Questions

	content, err := ioutil.ReadFile(QuestionsFile)
	if err != nil {
		log.Printf("Error loading file: %s", QuestionsFile)
		return nil, err
	}

	if err != json.Unmarshal(content, &questions) {
		log.Printf("Error unmarshalling file: %s", QuestionsFile)
		return nil, err
	}

	return questions, err
}