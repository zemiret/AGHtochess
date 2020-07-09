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
  const calcTimeLeft = (end: number): number => {
    return Math.round(end - Date.now() / 1000);
  };

  const initialTimerState = calcTimeLeft(phaseEndsAt);
  const [timeLeft, setTimeLeft] = useState<number>(initialTimerState);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(phaseEndsAt));
    }, 100);

    return () => clearInterval(interval);
  }, [phaseEndsAt]);

  return (
    <div>
      <h3>{phase} phase</h3>
      <h4>Round number: {round}</h4>
      <p>Time left: {timeLeft}s</p>
    </div>
  );
};

export default Timer;
