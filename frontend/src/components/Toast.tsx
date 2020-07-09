import React, { useEffect, useState } from "react";
import { Alert } from "reactstrap";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";

interface Props {
  color: "success" | "danger";
  text: string;
}

const Toast: React.FunctionComponent<Props> = ({ color, text }: Props) => {
  const [hidden, setHidden] = useState<boolean>(true);

  useEffect(() => {
    if (text !== "") setHidden(false);
    const timeout = setInterval(() => setHidden(true), 2000);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <Alert size="lg" className="info-toast" isOpen={!hidden} color={color}>
      {text}
    </Alert>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  text: state.message,
  color: state.messageType,
});

export default connect(mapStateToProps)(Toast);
