import { useNavigate } from "react-router-dom";
import { io, Socket as SocketClient } from "socket.io-client";


class Socket {
  private socket: SocketClient;

  init(host: string, token: string) {
    this.socket = io(host, {
      transports: ["websocket", "polling"],
      reconnectionDelay: 10000,
      reconnectionDelayMax: 50000,
      query: {
        token,
      },
    });

    this.socket.on("connection_completed", (user) => {
      window.Main.socketConnected(user);
    });
    
    this.socket.on("new-order", (data: any) => {
      window.Main.order(data);
    });
  }

  finishSession() {
    this.socket.emit("finished-session");
  }
}

export default new Socket();
