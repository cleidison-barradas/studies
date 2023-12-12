import express from 'express';
import cors from 'cors';

import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(Number(process.env.SOCKET_PORT) || 8089, {
    transports: ['polling', 'websocket'],
    pingInterval: 10000,
    pingTimeout: 60000
});

export { app, server, io };
