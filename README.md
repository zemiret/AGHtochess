# AGHtochess
Live deploy at [https://aghtochess.mionskowski.pl/](https://aghtochess.mionskowski.pl/)

## Installation

In order to deploy the application locally run:

```bash
docker-compose up -d --build
```

and navigate to `localhost:8080`

## Generating questions

The file with questions is located at `communicator/assets/questions.json`.
You can modify its content to change the questions present in the game
(make sure there is at least one question of each difficulty).

There is also a script for generating new questions.
```
scripts/generate_questions.py
```
It will lead you through generating questions, then you can just paste the geneated json
into the `communicator/assets/questions.json` file.

## Architecture

![Architecture](assets/architecture.png)

---
## The team

* Antoni Mleczko - zemiret
* Grzegorz Wcisło - grzegorz-wcislo
* Tomasz Zawadzki - tomekzaw
* Mateusz Hurbol - matix522
* Mateusz Naróg - narogm
* Arkadiusz Kraus - arkadiuss
* Maciej Mionskowski - maciekmm
* Piotr Matląg
