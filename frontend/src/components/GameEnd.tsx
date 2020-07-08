import React from "react";

interface Props {
  gameResult: "WIN" | "LOSS";
}

const GameEnd: React.FunctionComponent<Props> = ({ gameResult }: Props) => {
  if (gameResult === "WIN") {
    return <h1>You Win!</h1>;
  } else {
    return <h1>You Lose!</h1>;
  }
};

export default GameEnd;
