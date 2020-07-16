import React, { useEffect, useState } from "react";

interface Props {
  source: string;
  target: string;
  duration: number;
  positiveNews: boolean;
}

interface Coordinates {
  x: number;
  y: number;
}

const center = (element: HTMLElement | null): Coordinates => {
  if (!element) return { x: 0, y: 0 };

  const bb = element.getBoundingClientRect();
  return {
    x: bb.x + bb.width / 2,
    y: bb.y + bb.height / 2,
  };
};

const Projectile: React.FunctionComponent<Props> = ({
  source,
  target,
  duration,
  positiveNews,
}: Props) => {
  const sourceEl = document.getElementById(`board-unit-${source}`);
  const targetEl = document.getElementById(`board-unit-${target}`);
  const sourceCenter = center(sourceEl);
  const targetCenter = center(targetEl);

  const [isStarted, setStarted] = useState<boolean>(false);

  useEffect(() => {
    console.log({ sourceCenter, targetCenter });
    setStarted(true);
  }, []);

  const transform = isStarted
    ? { transform: `translate(${sourceCenter.x}px,${sourceCenter.y}px)` }
    : { transform: `translate(${targetCenter.x}px,${targetCenter.y}px)` };

  const style = {
    ...transform,
    transitionDuration: duration + "s",
    animationDuration: duration + "s",
  };

  return (
    <div
      className={`projectile projectile-${positiveNews ? "ally" : "enemy"}`}
      style={style}
    />
  );
};

export default Projectile;
