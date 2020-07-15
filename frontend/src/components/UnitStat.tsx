import React from "react";

interface Props {
  text: string;
  value: any;
  color?: string;
}

const UnitStat: React.FunctionComponent<Props> = ({ text, value, color }: Props) => {
  return (
    <div className="unit-stat">
      <span
        className="unit-stat-text"
        style={{
          color: color,
        }}
      >
        {text}:
      </span>
      <span>{value}</span>
    </div>
  );
};

export default UnitStat;
