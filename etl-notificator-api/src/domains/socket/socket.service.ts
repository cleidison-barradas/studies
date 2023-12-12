import { io } from '../../app';
import * as Server from 'socket.io';
import { jwtVerify } from '../../services/jwt';
import { IConnection } from './interfaces/Connections';
import { logger } from '@mypharma/api-core';
import OrderService from '../orders/orders.service';

class Socket {
    private io: Server.Server;
    private connections: IConnection[];
    constructor () {
        this.io = io;
        this.connections = [];
    }

    init() {
        this.io.on('connect', (socket) => {
            const { token, publicKey } = socket.handshake.query;

            if(!token || !publicKey || token === 'null' || publicKey === 'null'){
                logger(`Connection rejected. Missing connection arguments.`);
                socket.emit('socket_disconnect', 'Connection rejected. Missing connection arguments.');
                socket.disconnect(true);
                return;
            }

            const payload = jwtVerify(token as string, publicKey as string) as any;
            if(!payload){
                logger(`Connection rejected. Invalid session.`);
                socket.emit('socket_disconnect', 'Connection rejected. Invalid session.');
                socket.disconnect(true);
                return;
            }

            this.connections.push({
                userId: payload.userId ?? "",
                email: payload.email,
                sessionId: socket.id,
                socket,
                tenant: payload.tenant,
                ifoodOrders: []
            });

            this.events(socket);
        })
    }

    events(socket: Server.Socket) {
        socket.on("disconnect", (reason) => {
            const connection = this.findConnection(socket.id);
            if(connection){
                const { sessionId, tenant } = connection;
                logger(`Disconnecting ${tenant} - Reason: ${reason}`);
                this.removeConnection(sessionId);
            }
        });
    }

    async verifyOrders() {
        let index = 0;
        for await(const connection of this.connections) {
            const {tenant, ifoodOrders, sessionId} = connection;
            let foundNewOrder = false;
            logger(`Verificando pedidos de ${tenant} - ${index}`);
            const orderService = new OrderService();

            const newOrders = await orderService.getIFoodOrders(tenant) as any[];
            const orders = await orderService.getRegularOrders(tenant);

            newOrders.forEach(order => {
                const found = ifoodOrders.find(oldOrder => oldOrder.codigoPedido === order.codigoPedido);
                if(!found) {
                    foundNewOrder = true;
                }
            });

            if(foundNewOrder) {
                this.sendNotification(sessionId, "IFOOD");
            }

            if(orders.length > 0){
                this.sendNotification(sessionId, "REGULAR");
            }

            this.connections[index].ifoodOrders = newOrders;
            index++;
        }
    }

    sendNotification(sessionId: string, type: "IFOOD" | "REGULAR") {
        const connection = this.findConnection(sessionId);

        if(connection){
            const { socket } = connection;

            socket.emit('new-order', type);
        }
    }

    findConnection(sessionId: string) {
        return this.connections.find(p => p.sessionId === sessionId);
    }

    removeConnection(sessionId: string){
        const index = this.connections.findIndex(p => p.sessionId === sessionId);

        if(index >= 0){
            this.connections.splice(index, 1);
        }

        return this.connections;
    }
}

export default new Socket();
