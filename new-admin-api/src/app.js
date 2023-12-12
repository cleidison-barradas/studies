// Sentry
const Sentry = require("@sentry/node");

// Api Core
const { QueuePlugin } = require("@mypharma/api-core");
const {
  main_queue,
  dead_queue,
  QueuePluginHandler,
} = require("./plugins/queues");

// Database
const { Mongo } = require("./database");

// HTTP
const HTTP = require("./http");

// Services
const Services = require("./services");
const { consumeOrder } = require("./services/ErpOrdersService/consumeOrders");
const {
  cronDeadOrder,
  consumeDeadOrder,
} = require("./services/ErpOrdersService/deadOrders");
// Config
const Config = require("./config");

// Utils
const {
  logger,
  constants: { Color },
} = require("./utils");

/**
 * Initialization singleton
 */
const init = async () => {
  try {
    // Initialize Mongo database
    await Mongo.init();

    // Initialize services
    await Services.init();

    // Init Queue
    await main_queue.init(Config.erpMain);
    await dead_queue.init(Config.erpMain);
    await QueuePlugin.init(Config.amqpHost);
    await QueuePluginHandler.init(Config.amqpHostHandlerApi);

    await QueuePlugin.start("mongo-invalidate-product");
    await QueuePlugin.start("affiliate-store-change", "confirmation");
    await QueuePluginHandler.start("import-process-service", "confirmation");
    await QueuePluginHandler.start("handle-process-service-specials", 'confirmation');

    await main_queue.start("erp-main-queue");
    await dead_queue.start("erp-dead-queue");

    // Initialize HTTP server
    HTTP.init();

    // Order Consumer from ERP
    await consumeOrder();
    await consumeDeadOrder();
    await cronDeadOrder();

    logger("API initialized!", Color.FgGreen);
  } catch (error) {
    console.log(error);
    Sentry.captureException(error);
  }
};

/**
 * Defaut export
 */
module.exports = async () => {
  await init();
};
