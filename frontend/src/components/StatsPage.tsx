import React from "react";
import { Container, Jumbotron, Button, Row, Col } from "reactstrap";
import { PlayerStats } from "../models/stats.model";
import { RootSchema } from "../store/root-schema";
import { Dispatch } from "../store";
import { changeView } from "../store/actions";
import { connect } from "react-redux";

interface Props {
  username: string,
  stats: PlayerStats,
  dispatch: Dispatch
}

const StatsPage: React.FunctionComponent<Props> = ({username, stats, dispatch}: Props) => {
  const back = () => {
    dispatch(changeView("login"))
  }
  return (
    <Container>
      <Jumbotron className="my-4 mx-5">
        <h1 className="display-4">Stats for user {username}</h1>
        {stats && (<Col>
            <Row> Games success ratio: {stats.wonGames/stats.playedGames} </Row>
            <Row> Rounds success ratio: {stats.wonRounds/stats.playedRounds} </Row>
          </Col>
        )}
        {!stats && (<Row> No stats for this user yet </Row>)}
        <Button onClick={back}>Back</Button>
      </Jumbotron>
    </Container>
  );
};

const mapStateToProps = (state: RootSchema) => ({ 
  username: state.username,
  stats: state.stats[state.username],
 });

export default connect(mapStateToProps)(StatsPage);

