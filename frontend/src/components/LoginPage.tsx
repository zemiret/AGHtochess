import React from "react";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import { Dispatch } from "../store";
import { connectWebSocket, setUsername } from "../store/actions";

interface Props {
  username: string;
  connecting: boolean;
  dispatch: Dispatch;
}

const LoginPage: React.FunctionComponent<Props> = ({
  username,
  connecting,
  dispatch,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(setUsername(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(connectWebSocket(username));
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

export default connect(mapStateToProps)(LoginPage);
