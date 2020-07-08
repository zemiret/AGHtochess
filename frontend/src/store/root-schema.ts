export interface RootSchema {
  state: "login" | "lobby" | "game";
  gameState: string;
  username: string;
  socket?: WebSocket;
  socketState: "closed" | "connecting" | "open";
}
