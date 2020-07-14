import { MessageType } from "../models/message-type.enum";
import { GameState, UnitPlacement } from "../models/game-state.model";
import { InfoMessage } from "../models/info-message.model";

const url = `${process.env.REACT_APP_API_HOST}/ws`;

export interface Message {
  messageType: MessageType;
  payload: GameState | InfoMessage;
}

const socketUrl = (username: string, gameType: string): string => {
  return `${url}?nickname=${username}&gameType=${gameType}`;
};

let socket: WebSocket | undefined;

export const connect = (
  username: string,
  gameType: string,
  onMessage: (message: Message) => void,
  onClosed: () => void,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    socket = new WebSocket(socketUrl(username, gameType));
    socket.onopen = (): void => {
      resolve();
    };
    socket.onerror = (err): void => {
      reject(err);
    };
    socket.onmessage = (event: MessageEvent): void => {
      onMessage(JSON.parse(event.data) as Message);
    };
    socket.onclose = onClosed;
  });
};

export const buyUnit = (id: string): void => {
  socket?.send(JSON.stringify({ messageType: "BUY_UNIT", payload: { id } }));
};

export const sellUnit = (id: string): void => {
  socket?.send(JSON.stringify({ messageType: "SELL_UNIT", payload: { id } }));
};

export const answerQuestion = (q: number, a: number): void => {
  socket?.send(
    JSON.stringify({
      messageType: "ANSWER_QUESTION",
      payload: { questionId: q, answerId: a },
    }),
  );
};

export const placeUnit = (unitPlacement: UnitPlacement): void => {
  socket?.send(
    JSON.stringify({
      messageType: "PLACE_UNIT",
      payload: { id: unitPlacement.unitId, x: unitPlacement.x, y: unitPlacement.y },
    }),
  );
};

export const unplaceUnit = (unitId: string): void => {
  socket?.send(
    JSON.stringify({
      messageType: "UNPLACE_UNIT",
      payload: { id: unitId },
    }),
  );
};
