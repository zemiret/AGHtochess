import React from "react";
import PopoverUnitAvatar from "./PopoverUnitAvatar";
import { BattleAction, Unit } from "../models/game-state.model";
import { Badge, ListGroupItem } from "reactstrap";

interface Props {
  action: BattleAction;
  units: Unit[];
  enemyUnits: Unit[];
}

const BattleLogItem: React.FunctionComponent<Props> = ({
  action,
  units,
  enemyUnits,
}: Props) => {
  const actionVerb = action.action === "kill" ? " kills" : " attacks";
  const allUnits = [...units, ...enemyUnits];
  const who = allUnits.find(unit => unit.id === action.who) || units[0];
  const whom = allUnits.find(unit => unit.id === action.whom) || units[0];

  const positiveNews = units.indexOf(who) !== -1;
  const whoDescription = positiveNews ? "Your " : "Enemy ";
  const whomDescription = !positiveNews ? " " : " ";

  return (
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
  );
};

export default BattleLogItem;
