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
    return Math.max(0, Math.round(end - Date.now() / 1000));
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
    <div className="timer-bar">
      <p>
        <span className="bolded">Phase:</span> {phase}
      </p>
      <p>
        <span className="bolded">Round:</span> {round}
      </p>
      <p>
        <span className="bolded">Time left:</span> {timeLeft}s
      </p>
    </div>
  );
};

export default Timer;
