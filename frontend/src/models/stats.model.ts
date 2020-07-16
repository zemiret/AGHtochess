export type Stats = { [key: string]: PlayerStats };

export interface PlayerStats {
  playerName: string;
  wonGames: number;
  playedGames: number;
  wonRounds: number;
  playedRounds: number;
  unitsKilled: number;
  unitsLosts: number;
  damageTaken: number;
  damageGiven: number;
  questionsAnswered: { [key: string]: number };
  questionsCorrect: { [key: string]: number };
  moneyLost: number;
  moneySaved: number;
}
