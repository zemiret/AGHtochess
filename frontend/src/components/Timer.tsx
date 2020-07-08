import React, { useState, useEffect } from "react";

interface Props {
  phase: string;
  phaseEndsAt: number;
  round: number;
}

const Timer: React.FunctionComponent<Props> = ({
  phase,
  phaseEndsAt,
  round,
}: Props) => {
  const initialTimerState = Math.round((phaseEndsAt - Date.now()) / 1000);
  const [timeLeft, setTimeLeft] = useState(initialTimerState);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timeLeft => timeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>{phase} phase</h3>
      <h4>Round number: {round}</h4>
      <p>Time left: {timeLeft}s</p>
    </div>
  );
};

export default Timer;
