import React from "react";
import { Container, Button, Table } from "reactstrap";
import { PlayerStats } from "../models/stats.model";
import { RootSchema } from "../store/root-schema";
import { Dispatch } from "../store";
import { changeView } from "../store/actions";
import { connect } from "react-redux";

interface Props {
  username: string;
  stats: PlayerStats;
  dispatch: Dispatch;
}

const StatsPage: React.FunctionComponent<Props> = ({
  username,
  stats,
  dispatch,
}: Props) => {
  const back = () => {
    dispatch(changeView("login"));
  };
  const gameSuccessRatio =
    stats && stats.playedGames ? (stats.wonGames ?? 0) / stats.playedGames : "No info";
  const roundsSuccessRatio =
    stats && stats.playedRounds
      ? (stats.wonRounds ?? 0) / stats.playedRounds
      : "No info";
  return (
    <Container>
      <h1 className="stats-header">Stats for user {username}</h1>
      {stats && (
        <Table striped>
          <tbody>
            <tr>
              <td>Games success ratio</td>
              <td>{gameSuccessRatio}</td>
            </tr>
            <tr>
              <td>Rounds success ratio</td>
              <td>{roundsSuccessRatio}</td>
            </tr>
            <tr>
              <td>Overall damage taken</td>
              <td>{stats.damageTaken}</td>
            </tr>
            <tr>
              <td>Overall damage given</td>
              <td>{stats.damageGiven}</td>
            </tr>
            <tr>
              <td>Killed units</td>
              <td>{stats.unitsKilled}</td>
            </tr>
            <tr>
              <td>Lost units</td>
              <td>{stats.unitsLosts}</td>
            </tr>
          </tbody>
        </Table>
      )}
      {!stats && <div>No stats for this user yet</div>}
      <Button onClick={back}>Back</Button>
    </Container>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  username: state.username,
  stats: state.stats[state.username],
});

export default connect(mapStateToProps)(StatsPage);
