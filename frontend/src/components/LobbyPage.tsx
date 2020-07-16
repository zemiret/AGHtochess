import React from "react";
import { Container, Jumbotron, Spinner, Row } from "reactstrap";

const LobbyPage: React.FunctionComponent = () => {
  const augmentedClips = "exe t-clip-x b-clip-x";

  return (
    <Container>
      <div className="lobby-container">
        <Jumbotron className="my-4 mx-5" augmented-ui={augmentedClips}>
          <h1 className="display-4">Scanning the galaxy to find your enemy...</h1>
          <Row className="justify-content-center">
            <Spinner className="my-4" />
          </Row>
        </Jumbotron>
      </div>
    </Container>
  );
};

export default LobbyPage;
