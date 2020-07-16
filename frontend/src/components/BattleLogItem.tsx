import React from "react";
import PopoverUnitAvatar from "./PopoverUnitAvatar";
import { BattleAction, Unit } from "../models/game-state.model";
import { Badge, ListGroupItem } from "reactstrap";

interface Props {
  action: BattleAction;
  positiveNews: boolean;
  who: Unit;
  whom: Unit;
}

const BattleLogItem: React.FunctionComponent<Props> = ({
  action,
  positiveNews,
  who,
  whom,
}: Props) => {
  const actionVerb = action.action === "kill" ? " killed" : " damaged";
  const whoDescription = positiveNews ? "You " : "Enemy ";
  const whomDescription = !positiveNews ? " you " : " enemy ";

  return (
    <>
      <ListGroupItem
        color={action.action === "kill" ? (positiveNews ? "success" : "danger") : ""}
      >
        {whoDescription}
        <PopoverUnitAvatar unit={who} size={20} />
        {actionVerb}
        {whomDescription}
        <PopoverUnitAvatar unit={whom} size={20} /> dealing{" "}
        <Badge pill>{Math.round(action.damage * 10) / 10}</Badge> damage
      </ListGroupItem>
    </>
  );
};

export default BattleLogItem;
