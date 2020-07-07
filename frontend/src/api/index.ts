import { Dispatch } from "../store";
import { closeWebSocket } from "../store/actions";

const url = "ws://localhost:4000";

const handleMessage = (event: MessageEvent, dispatch: Dispatch): void => {
  console.log(event);
};

// export const connect = (username: string, dispatch: Dispatch): void => {
//   const socket = new WebSocket(`${url}/${username}`);

//   socket.onopen = () => dispatch(openWebSocket(socket));
//   socket.onclose = () => dispatch(closeWebSocket());
//   socket.onmessage = (event: MessageEvent): void => handleMessage(event, dispatch);
// };

export const connect = (username: string): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const server = new WebSocket(`${url}/${username}`);
    server.onopen = (): void => {
      resolve(server);
    };
    server.onerror = (err): void => {
      reject(err);
    };
  });
};
