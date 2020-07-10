import React, { useEffect } from "react";
import { Alert } from "reactstrap";
import { RootSchema } from "../store/root-schema";
import { connect } from "react-redux";
import { hideMessage } from "../store/actions";
import { Dispatch } from "../store";

interface Props {
  color: "success" | "danger";
  text: string;
  visible: boolean;
  hide: () => void;
}

const Toast: React.FunctionComponent<Props> = ({
  color,
  text,
  visible,
  hide,
}: Props) => {
  useEffect(() => {
    if (visible) {
      const timeout = setInterval(hide, 2000);
      return () => clearTimeout(timeout);
    }
  }, [text, visible, hide]);

  return (
    <Alert size="lg" className="info-toast" isOpen={visible} color={color}>
      {text}
    </Alert>
  );
};

const mapStateToProps = (state: RootSchema) => ({
  text: state.message,
  color: state.messageType,
  visible: state.messageVisible,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hide: () => {
    dispatch(hideMessage());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Toast);
