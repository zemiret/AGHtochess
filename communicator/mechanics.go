package main

const storeURL = ""

type PlayerBattleSetup struct {
	UnitPlacement []UnitPlacement
	Units         []Unit
}

type PlayerBattleResult struct {
	Winner         int           `json:"winner"`
	PlayerHpChange int           `json:"playerHpChange"`
	Log            []interface{} `json:"log"`
}

func GetStoreUnits(round int) ([]Unit, error) {
	return []Unit{
		Unit{
			"1", 10, 2, 3, 4, 5, 6, 7, "ranger", 10,
		},
		Unit{
			"2", 10, 2, 3, 4, 5, 6, 7, "ranger", 10,
		},
	}, nil
}

func GetBattleResult(player1 PlayerBattleSetup, player2 PlayerBattleSetup) (*PlayerBattleResult, error) {
	return &PlayerBattleResult{
		Winner:         0,
		PlayerHpChange: -10,
		Log:            nil,
	}, nil
}
