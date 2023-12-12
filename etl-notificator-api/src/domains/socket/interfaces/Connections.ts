import { User } from "@mypharma/api-core";
import { Socket } from "socket.io";

export interface IConnection {
    userId: string | User['_id']
    sessionId: string
    tenant: string
    email: string
    socket: Socket
    ifoodOrders: any[]
}