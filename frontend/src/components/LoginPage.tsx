import React, { useState } from "react";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import { Dispatch } from "../store";
import { connectWebSocket, setUsername, changeView } from "../store/actions";
import { Jumbotron, Container, Form, Input, Button, FormGroup, Row } from "reactstrap";
import { GameType, WebsocketOptions } from "../models/game-state.model";

interface Props {
  username: string;
  connecting: boolean;
  changeView: (username: string) => void;
  login: (wsOptions: WebsocketOptions) => void;
}

const LoginPage: React.FunctionComponent<Props> = ({
  username: defaultUsername,
  connecting,
  login,
  changeView,
}: Props) => {
  const [username, setUsername] = useState<string>(defaultUsername);
  const [gameType, setGameType] = useState<string>(GameType.DUEL);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
  };

  const handleGameTypeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setGameType(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    login({ username, gameType });
  };

  const handleStatsClicked = () => {
    changeView(username);
  };

  return (
    <Container>
      <Jumbotron className="my-4 mx-5">
        <h1 className="display-4">AGHtochess</h1>
        <p className="lead">In order to play the game you need to log in.</p>
        <hr className="my-4" />
        <Form onSubmit={handleSubmit} inline={true}>
          <FormGroup>
            <Row noGutters={true}>
              <Input
                className="mr-2"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Username"
                required={true}
              />
              <Input
                type="select"
                value={gameType}
                className="mr-2"
                onChange={handleGameTypeChange}
                placeholder="Game type"
                required={true}
              >
                <option>{GameType.DUEL}</option>
                <option>{GameType.ROYALE}</option>
              </Input>
              {!connecting && (
                <Button color="primary" type="submit">
                  Play
                </Button>
              )}
              {connecting && (
                <Button type="submit" disabled={true}>
                  Connecting
                </Button>
              )}
              {!connecting && (
                <Button
                  className="stats-button"
                  color="info"
                  onClick={handleStatsClicked}
                >
                  Stats
                </Button>
              )}
            </Row>
          </FormGroup>
        </Form>
      </Jumbotron>
    </Container>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  username: state.username,
  connecting: state.socketState === "connecting",
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (wsOptions: WebsocketOptions) => {
    dispatch(setUsername(wsOptions.username));
    dispatch(connectWebSocket(wsOptions));
  },
  changeView: (username: string) => {
    dispatch(setUsername(username));
    dispatch(changeView("stats"));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
