import { MessageType } from "../models/message-type.enum";
import { GameState } from "../models/game-state.model";
import { InfoMessage } from "../models/info-message.model";

const url = "ws://localhost:4000";

export interface Message {
  messageType: MessageType;
  payload: GameState | InfoMessage;
}

export const connect = (
  username: string,
  onMessage: (message: Message) => void,
  onClosed: () => void,
): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const server = new WebSocket(`${url}/${username}`);
    server.onopen = (): void => {
      resolve(server);
    };
    server.onerror = (err): void => {
      reject(err);
    };
    server.onmessage = (event: MessageEvent): void => onMessage(event.data as Message);
    server.onclose = onClosed;
  });
};
