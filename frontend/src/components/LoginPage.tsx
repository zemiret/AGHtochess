import React, { useState } from "react";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import { Dispatch } from "../store";
import { connectWebSocket, setUsername } from "../store/actions";
import {
  Jumbotron,
  Container,
  Form,
  Input,
  Button,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import { GameType, WebsocketOptions } from "../models/game-state.model";

interface Props {
  username: string;
  connecting: boolean;
  login: (wsOptions: WebsocketOptions) => void;
}

const LoginPage: React.FunctionComponent<Props> = ({
  username: defaultUsername,
  connecting,
  login,
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
            <FormGroup>
              <Row noGutters={true}>
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
              </Row>
              <Row noGutters={true}>
                <Col sm="3" />
                <Col>
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
                </Col>
                <Col sm="3" />
              </Row>
              <Row noGutters={true}>
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
              </Row>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
