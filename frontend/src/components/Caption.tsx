import React from "react";

interface Props {
  text: string;
}

const Caption: React.FunctionComponent<Props> = ({ text }: Props) => {
  return (
    <div>
      <div className="caption">
        <h1>{text}</h1>
      </div>
    </div>
  );
};

export default Caption;
