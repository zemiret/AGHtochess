import React, { useState } from "react";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import { Dispatch } from "../store";
import { connectWebSocket, setUsername } from "../store/actions";
import { Jumbotron, Container, Form, Input, Button, FormGroup, Row } from "reactstrap";

interface Props {
  username: string;
  connecting: boolean;
  login: (username: string) => void;
}

const LoginPage: React.FunctionComponent<Props> = ({
  username: defaultUsername,
  connecting,
  login,
}: Props) => {
  const [username, setUsername] = useState<string>(defaultUsername);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    login(username);
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
                onChange={handleChange}
                placeholder="Username"
                required={true}
              />
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
  login: (username: string) => {
    dispatch(setUsername(username));
    dispatch(connectWebSocket(username));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
