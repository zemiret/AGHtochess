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
  const roundStat = (stat: number) => {
    return Math.round(stat * 10) / 10;
  };

  return (
    <Container className="statistics-container">
      <Caption text={`${username} progress in exploring the galaxy`} />
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
              <td>{roundStat(stats.damageTaken ?? 0)}</td>
            </tr>
            <tr>
              <td>Overall damage given</td>
              <td>{roundStat(stats.damageGiven ?? 0)}</td>
            </tr>
            <tr>
              <td>Killed units</td>
              <td>{stats.unitsKilled ?? 0}</td>
            </tr>
            <tr>
              <td>Lost units</td>
              <td>{stats.unitsLosts ?? 0}</td>
            </tr>
            {["EASY", "MEDIUM", "HARD"].map(qkey => (
              <tr key={qkey}>
                <td>Correct {qkey} answers ratio</td>
                <td>
                  {stats.questionsCorrect?.[qkey] ?? 0}/
                  {stats.questionsAnswered?.[qkey] ?? 0}
                </td>
              </tr>
            ))}
            <tr>
              <td>Money saved due to correct answers</td>
              <td>{stats.moneySaved ?? 0}</td>
            </tr>
            <tr>
              <td>Money lost due to incorrect answers</td>
              <td>{stats.moneyLost ?? 0}</td>
            </tr>
          </tbody>
        </Table>
      )}
      {!stats && <div>You have no statistics yet</div>}
      <Button className="stats-back-btn" onClick={back}>
        Back
      </Button>
    </Container>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  username: state.username,
  stats: state.stats[state.username],
});

export default connect(mapStateToProps)(StatsPage);
