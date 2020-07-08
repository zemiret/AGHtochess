import React from "react";
import { Container, Jumbotron, Spinner, Row } from "reactstrap";

const LobbyPage: React.FunctionComponent = () => {
  return (
    <Container>
      <Jumbotron className="my-4 mx-5">
        <h1 className="display-4">Lobby</h1>
        <Row className="justify-content-center">
          <Spinner className="my-4" />
        </Row>
      </Jumbotron>
    </Container>
  );
};

export default LobbyPage;
