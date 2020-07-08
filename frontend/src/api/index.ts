const url = "ws://localhost:4000";

export const connect = (username: string): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const server = new WebSocket(`${url}/${username}`);
    server.onopen = (): void => {
      resolve(server);
    };
    server.onerror = (err): void => {
      reject(err);
    };
    // TODO: get dispatch from thunk, add explicit message types and handling
    //   socket.onmessage = (event: MessageEvent): void => handleMessage(event, dispatch);
    //   socket.onclose = () => dispatch(closeWebSocket());
  });
};
