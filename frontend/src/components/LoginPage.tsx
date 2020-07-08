import React, { useState } from "react";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import { Dispatch } from "../store";
import { connectWebSocket, setUsername } from "../store/actions";

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
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={handleChange} />
      {!connecting && <button type="submit">Play</button>}
      {connecting && (
        <button type="submit" disabled>
          Connecting
        </button>
      )}
    </form>
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
