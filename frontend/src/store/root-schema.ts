export interface RootSchema {
  gameState: string;
  username: string;
  socket: WebSocket | undefined;
  socketState: "closed" | "connecting" | "open";
}
