package main

const storeURL = ""

func GetStoreUnits(round int) ([]Unit, error) {
	return []Unit{
		Unit{
			1,10,2,3,4,5,6,7,"ranger", 10,
		},
		Unit{
			2,10,2,3,4,5,6,7,"ranger", 10,
		},
	}, nil
}

