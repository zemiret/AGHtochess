import React, { useState } from "react";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import { Dispatch } from "../store";
import { changeView, connectWebSocket, setUsername } from "../store/actions";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Jumbotron,
  Label,
  Row,
} from "reactstrap";
import { GameType, WebsocketOptions } from "../models/game-state.model";

interface Props {
  username: string;
  connecting: boolean;
  showStatistics: (username: string) => void;
  login: (wsOptions: WebsocketOptions) => void;
}

const LoginPage: React.FunctionComponent<Props> = ({
  username: defaultUsername,
  connecting,
  login,
  showStatistics,
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
    showStatistics(username);
  };

  const augmentedClips = "exe t-clip-x b-clip-x";

  return (
    <Container>
      <div className="login-container">
        <Jumbotron className="my-4 mx-5 jumbotron" augmented-ui={augmentedClips}>
          <h1 className="display-4">AGHtochess</h1>
          <p className="lead">
            Welcome, savior of the galaxy. How should we address you?
          </p>
          <hr className="my-4" />
          <Form onSubmit={handleSubmit}>
            <FormGroup row>
              <Col sm="3" />
              <Col>
                <Input
                  className="mr-2"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Username"
                  required={true}
                />
              </Col>
              <Col sm="3" />
            </FormGroup>
            <FormGroup row>
              <Col sm="3" />
              <Col>
                <Row noGutters={true}>
                  <Label sm="4" for="gameTypeSelect">
                    Game type:
                  </Label>
                  <Col sm="8">
                    <Input
                      id="gameTypeSelect"
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
                  </Col>
                </Row>
              </Col>
              <Col sm="3" />
            </FormGroup>
            <FormGroup row>
              <Col sm="3" />
              <Col>
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
              </Col>
              <Col sm="3" />
            </FormGroup>
            <FormGroup row>
              <Col sm="3" />
              <Col>
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
                    Statistics
                  </Button>
                )}
              </Col>
              <Col sm="3" />
            </FormGroup>
          </Form>
        </Jumbotron>
      </div>
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
  showStatistics: (username: string) => {
    dispatch(setUsername(username));
    dispatch(changeView("stats"));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
