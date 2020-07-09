import React from "react";

interface Props {
  text: string;
  value: any;
}

const UnitStat: React.FunctionComponent<Props> = ({ text, value }: Props) => {
  return (
    <div className="unit-stat">
      <span className="unit-stat-text">{text}:</span>
      <span>{value}</span>
    </div>
  );
};

export default UnitStat;
