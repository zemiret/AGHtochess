package main

func mirrorUnitPlacement(placement UnitPlacement) UnitPlacement {
	return UnitPlacement{
		UnitID: placement.UnitID,
		X:      boardWidth - placement.X - 1,
		Y:      boardHeight - placement.Y - 1,
	}
}

func mirrorUnitPlacements(placements []UnitPlacement) []UnitPlacement {
	mirrored := make([]UnitPlacement, len(placements))
	for i, placement := range placements {
		mirrored[i] = mirrorUnitPlacement(placement)
	}
	return mirrored
}
