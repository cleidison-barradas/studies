/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
// MongooseJS
const mongoose = require("mongoose");

// sha256
const sha256 = require("sha256");

// Models
const Models = require("./models");

// Config
const {
  databases: { mongoDB },
} = require("../../config");

// Utils
const {
  logger,
  constants: { Color },
} = require("myp-admin/utils");

// Reconnect config
const MAX_RECONNECT_ATTEMPTS = mongoDB.maxReconnectAttempts;
let CURRENT_RECONNECT_ATTEMPTS = 0;

// Wrapper promise
mongoose.Promise = require("bluebird").Promise;

// Connection instance
let DATABASE = mongoose.connection;

/**
 * It connects to the database, loads the models, and returns the database
 * @returns The database connection
 */
const init = async () => {
  try {
    // Connect
    const connectionConfig = {
      ...mongoDB,
    };

    mongoose.connection.on("connected", (args) => {
      logger(`Mongo connected`, Color.FgGreen);
    });
    mongoose.connection.on("close", () => {
      logger(`Mongo connection closed`, Color.FgGreen);
    });

    DATABASE = await mongoose.connect(
      connectionConfig.connectionString,
      connectionConfig.options
    );

    await loadModels();

    return DATABASE;
  } catch (error) {
    if (error.name && error.name === "MongoNetworkError") {
      reconnect();
    } else {
      console.log("Erro no mongo ", error);
      throw error;
    }
  }
};

/**
 * If the current reconnection attempts is less than the maximum reconnection attempts, increment the
 * current reconnection attempts, log a message to the console, and try to reconnect in 5 seconds. If
 * the current reconnection attempts is greater than the maximum reconnection attempts, log a message
 * to the console
 */
const reconnect = () => {
  if (CURRENT_RECONNECT_ATTEMPTS < MAX_RECONNECT_ATTEMPTS) {
    CURRENT_RECONNECT_ATTEMPTS++;

    logger("Could not reach MongoDB! Retrying in 5 secs...", Color.FgRed);
    setTimeout(() => {
      init();
    }, 5000);
  } else {
    logger(
      "Could not connect to MongoDB. Please check if all services is working and restart the API."
    );
  }
};

/**
 * It loads all the models in the `Models` folder, except for the ones in the `blackListAdmin` array
 */
const loadModels = async () => {
  const blackListAdmin = [
    "ProductPromotion",
    "ShowCaseSchema",
    "GanalyticsSchema",
    "HistoryAboutUsSchema",
    "OpeningHourSchema",
    "StatusOrderSchema",
    "DeliveryFeeSchema",
    "CustomerSchema",
    "BannerSchema",
    "PublicAddressSchema",
    "HistoryOrderSchema",
    "NeighborhoodSchema",
    "CitySchema",
    "StateSchema",
    "CountrySchema",
    "AboutUsSchema",
    "OrderSchema",
    "PaymentMethodSchema",
    "CupomSchema",
    "DeliverySchedule",
    "PaymentOptionSchema",
  ];

  const keys = Object.keys(Models).filter(
    (schemaName) => !blackListAdmin.includes(schemaName)
  );

  for await (const key of keys) {
    try {
      if (!Object.keys(DATABASE.models).includes(key)) {
        const schema = Models[key];

        // Define model
        const model = DATABASE.model(
          key,
          schema.schemaDefinition,
          schema.schemaName.toLowerCase()
        );
        // Save model instance
        schema._setModel(model);

        // Sync model
        await model.syncIndexes();
      }
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 * It checks if the id is a valid mongoose id
 * @param {String} _id - The _id of the document.
 */
const validateId = (_id) => mongoose.Types.ObjectId.isValid(_id);

/**
 * Create default records
 * We need some data for our system gets usable. Such as a default user or default permissions
 */
const createDefaultRecords = async () => {
  const { UserSchema } = Models;
  const UserModel = UserSchema.Model();

  // Does we have already any user created?
  const usersCount = await UserModel.countDocuments();
  if (usersCount === 0) {
    logger("No users were found. Creating default user...", Color.FgYellow);

    await UserModel.create({
      name: "User Default",
      email: "user@localhost",
      password: sha256("123456"),
    });

    logger(`========================`, Color.FgGreen);
    logger(
      `User default created! There is below the default credentials`,
      Color.FgGreen
    );
    logger(`Email: user@localhost`, Color.FgGreen);
    logger(`Password: 123456`, Color.FgGreen);
    logger(`========================`, Color.FgGreen);
  }
};

/**
 * It will return a new connection to the database if the database exists
 * @param {String} tenant - The tenant name
 * @returns A new connection to the database
 */
const getTenantDB = (tenant) => {
  if (mongoose.connection) {
    try {
      // useDb will return new connection
      const db = mongoose.connection.useDb(tenant, { useCache: true });
      logger(`Switching database to ${tenant}`, Color.FgBlue);
      return db;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

/**
 * It returns a mongoose model for a given tenant and model name
 * @param {String} tenant - The tenant name
 * @param {String} modelName - The name of the model you want to get.
 * @returns A mongoose model
 */
const getModelByTenant = (tenant, modelName) => {
  const tenantDb = getTenantDB(tenant);
  const schema = Models[modelName];

  if (!schema) {
    throw new Error("schema_not_found");
  }

  return tenantDb.model(modelName, schema.schemaDefinition, schema.schemaName);
};

module.exports = {
  DATABASE,
  Models,
  init,
  validateId,
  reconnect,
  getModelByTenant,
};
