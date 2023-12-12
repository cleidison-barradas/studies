import 'reflect-metadata';
require('dotenv').config()
import { colors, logger, ORM } from "@mypharma/api-core"
import { databaseConfig } from "./config/database"
import { useExpressServer } from 'routing-controllers';

//Express Controllers
import OrderController from "./domains/orders/orders.controller"
import SessionController from "./domains/sessions/sessions.controller"
import { app, server } from "./app";
import Socket from "./domains/socket/socket.service";
import { schedule } from 'node-cron';

export default (async() => {
    ORM.config = databaseConfig;
    await ORM.setup();

    useExpressServer(app, {
        controllers: [OrderController, SessionController]
    })

    Socket.init()
    logger(`Socket listening on port: ${process.env.SOCKET_PORT}`, colors.FgCyan)
    schedule('*/2 * * * *', async () => Socket.verifyOrders());

    server.listen(process.env.PORT, () => {
        logger(`Api up and running on ${process.env.PORT}`, colors.FgGreen)
    })
})()
