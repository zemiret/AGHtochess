#!/bin/python

import random
import re
import json
import sys 

args = sys.argv

def print_usage():
    print(f"Usage: {args[0]} drill-file [start-id]")
    sys.exit(1)
  

if len(args) < 2:
    print_usage()

questions = []
difficulties = ["EASY", "MEDIUM", "HARD"]

id=0

if len(args) > 2:
    try:
        id = int(args[2])
    except:
        print_usage()

questions=[]

r_question_start = r"""\[#\d+\](.*)"""
r_answer = r"""(>+)?\S\)(.*)"""


with open(args[1], 'r', encoding="utf8") as drill:
    content = drill.readlines()
    question = {}
    for line in content:
        if line.strip() == "":
            continue

        answer_match = re.match(r_answer, line)
        if question == {}:
            question = {
                "id": id,
                "text": line,
                "answers": [],
                "difficulty": random.choice(difficulties)
            }
            id = id + 1
        elif answer_match is not None:
            answer = {
                "id": len(question["answers"]),
                "text": answer_match.group(2),
                "correct": line.startswith(">>")
            }
            question["answers"].append(answer)
        elif len(question["answers"]) > 0:
            questions.append(question)
            question = {
                "id": id,
                "text": line,
                "answers": [],
                "difficulty": random.choice(difficulties)
            }
            id = id + 1
        else:
            question["text"] += line

    questions.append(question)

question_candidates = []

for question in questions:
    found_correct = False
    incorrect_answers = [answer for answer in question["answers"] if not answer["correct"]]
    correct_answers = [answer for answer in question["answers"] if answer["correct"]]
    if len(correct_answers) > 0 and len(incorrect_answers) > 0:
        correct_answer = random.choice(correct_answers)
        question["answers"] = incorrect_answers + [correct_answer]
        random.shuffle(question["answers"])
        question["correctAnswer"] = correct_answer["id"]
        for answer in question["answers"]:
            answer.pop("correct", None)
        
        if 5 >= len(question["answers"]) >= 3:
            question_candidates.append(question)


print(json.dumps(question_candidates))
