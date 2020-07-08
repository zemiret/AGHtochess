package main

func GetQuestion() (*Question, error) {
	return &Question{
		ID:   1,
		Text: "Na kogo głosujesz w drugiej turze",
		Answers: []Answer{
			{
				ID:   1,
				Text: "Czaskoski",
			},
			{
				ID:   2,
				Text: "Dupa",
			},
		},
		CorrectAnswer: 1,
	}, nil
}
