import React, { useState } from "react";

interface Props {
  login: (username: string) => void;
}

const LoginPage: React.FunctionComponent<Props> = ({ login }: Props) => {
  const [username, setUsername] = useState<string>("");

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
      <button type="submit">Play</button>
    </form>
  );
};

export default LoginPage;
