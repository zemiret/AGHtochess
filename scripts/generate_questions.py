#!/bin/python

import json

questions = []
difficulties = ["EASY", "MEDIUM", "HARD"]

start_id = input('> ID for the first quesiton (default: 0): ')

try:
    start_id = int(start_id)
except:
    start_id = 0

question_id = start_id

while True:
    print('--- --- ---')
    text = input('> Question text: \n')

    answers = []
    while True:
        answers.append(input('> An answer: \n'))
        flag = input('> Type next answer? y/n ')
        if flag.lower() != 'y':
            break

    for i, ans in enumerate(answers):
        print('{}) {}'.format(i, ans))

    correct_id = -1
    while correct_id < 0 or correct_id >= len(answers):
        try:
            correct_id = int(input('> Which answer is correct? '))
        except:
            pass

    for i, d in enumerate(difficulties):
        print('{}) {}'.format(i, d))

    difficulty_idx = -1
    while difficulty_idx < 0 or difficulty_idx >= len(difficulties):
        try:
            difficulty_idx = int(input('> Which difficulty? '))
        except:
            pass

    difficulty = difficulties[difficulty_idx]

    questions.append({
        'id': question_id,
        'text': text,
        'difficulty': difficulty,
        'answers': list(map(lambda x: { 'id': x[0], 'text': x[1] },
                            enumerate(answers))),
        'correctAnswer': correct_id
    })

    flag = input('> Type next question? y/n ')
    if flag.lower() != 'y':
        break

    question_id += 1


print()
print('--- --- ---')
print()
print(json.dumps(questions))
