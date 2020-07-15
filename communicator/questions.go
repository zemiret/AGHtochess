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

type QuestionList []*Question
type LoadedQuestions map[QuestionDifficulty]QuestionList

var questions LoadedQuestions

func GetQuestion(difficulty QuestionDifficulty) (*Question, error) {
	if questions == nil {
		return nil, errors.New("questions not loaded")
	}
	questionList := questions[difficulty]
	question := questionList[rand.Intn(len(questionList))]
	answers := make([]Answer, len(question.Answers))
	copy(answers, question.Answers)

	return &Question{
		PublicQuestion: question.PublicQuestion,
		CorrectAnswer: question.CorrectAnswer,
	}, nil
}

func LoadQuestions() (LoadedQuestions, error) {
	questions := make(LoadedQuestions)
	var questionList QuestionList

	content, err := ioutil.ReadFile(QuestionsFile)
	if err != nil {
		log.Printf("Error loading file: %s", QuestionsFile)
		return nil, err
	}

	if err != json.Unmarshal(content, &questionList) {
		log.Printf("Error unmarshalling file: %s", QuestionsFile)
		return nil, err
	}

	questions[QuestionDifficultyEasy] = QuestionList{}
	questions[QuestionDifficultyMedium] = QuestionList{}
	questions[QuestionDifficultyHard] = QuestionList{}

	for _, q := range questionList {
		questions[q.Difficulty] = append(questions[q.Difficulty], q)
	}

	return questions, err
}