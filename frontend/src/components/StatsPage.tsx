import React from "react";
import { Container, Button, Table } from "reactstrap";
import { PlayerStats } from "../models/stats.model";
import { RootSchema } from "../store/root-schema";
import { Dispatch } from "../store";
import { changeView } from "../store/actions";
import { connect } from "react-redux";
import Caption from "./Caption";

interface Props {
  username: string;
  stats?: PlayerStats;
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
  return (
    <Container>
      <Caption text={`Stats for user ${username}`}></Caption>
      {stats && (
        <Table striped>
          <tbody>
            <tr>
              <td>Games success ratio</td>
              <td>
                {stats.wonGames ?? 0}/{stats.playedGames ?? 0}
              </td>
            </tr>
            <tr>
              <td>Rounds success ratio</td>
              <td>
                {stats.wonRounds ?? 0}/{stats.playedRounds ?? 0}
              </td>
            </tr>
            <tr>
              <td>Overall damage taken</td>
              <td>{stats.damageTaken ?? 0}</td>
            </tr>
            <tr>
              <td>Overall damage given</td>
              <td>{stats.damageGiven ?? 0}</td>
            </tr>
            <tr>
              <td>Killed units</td>
              <td>{stats.unitsKilled ?? 0}</td>
            </tr>
            <tr>
              <td>Lost units</td>
              <td>{stats.unitsLosts ?? 0}</td>
            </tr>
          </tbody>
        </Table>
      )}
      {!stats && <div>You have no statistics yet</div>}
      <Button onClick={back}>Back</Button>
    </Container>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  username: state.username,
  stats: state.stats[state.username],
});

export default connect(mapStateToProps)(StatsPage);
