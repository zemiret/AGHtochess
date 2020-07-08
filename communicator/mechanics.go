package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
)

var mechanicsHost string

func init() {
	if mechanicsHost = os.Getenv("MECHANICS_HOST"); len(mechanicsHost) == 0 {
		mechanicsHost = "http://localhost:5000"
	}
}

func GetStoreUnits(round int) ([]Unit, error) {
	type response struct {
		Units []Unit `json:"units"`
	}

	type request struct {
		Round int `json:"round"`
	}

	requestData := request{Round: round}
	body, err := json.Marshal(&requestData)
	if err != nil {
		return []Unit{}, err
	}

	resp, err := http.Post(fmt.Sprintf("%s/generate_units", mechanicsHost), "application/json", bytes.NewReader(body))
	if err != nil {
		return []Unit{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return []Unit{}, errors.New("invalid status code")
	}

	var store response
	decoder := json.NewDecoder(resp.Body)
	if err := decoder.Decode(&store); err != nil {
		return []Unit{}, err
	}
	return store.Units, nil
}

type PlayerBattleSetup struct {
	UnitPlacement []UnitPlacement `json:"unitsPlacement"`
	Units         []Unit          `json:"units"`
}

type PlayerBattleResult struct {
	Winner         int           `json:"winner"`
	PlayerHpChange int           `json:"playerHpChange"`
	Log            []interface{} `json:"log"`
}

func GetBattleResult(player1 PlayerBattleSetup, player2 PlayerBattleSetup) (*PlayerBattleResult, error) {
	type request struct {
		Player1 PlayerBattleSetup `json:"player1"`
		Player2 PlayerBattleSetup `json:"player2"`
	}

	requestData := request{Player1: player1, Player2: player2}
	body, err := json.Marshal(&requestData)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(fmt.Sprintf("%s/resolve_battle", mechanicsHost), "application/json", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("invalid status code")
	}

	var battleResult PlayerBattleResult
	decoder := json.NewDecoder(resp.Body)
	if err := decoder.Decode(&battleResult); err != nil {
		return nil, err
	}
	return &battleResult, nil
}
