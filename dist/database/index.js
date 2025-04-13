"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Logger_1 = __importDefault(require("../core/Logger"));
const config_1 = require("../config");
// Build the connection string
const dbURI = `mongodb://${config_1.db.user}:${encodeURIComponent(config_1.db.password)}@${config_1.db.host}:${config_1.db.port}/${config_1.db.name}`;
const options = {
    autoIndex: true,
    minPoolSize: config_1.db.minPoolSize,
    maxPoolSize: config_1.db.maxPoolSize,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
};
Logger_1.default.debug(dbURI);
function setRunValidators() {
    return { runValidators: true };
}
mongoose_1.default.set("strictQuery", true);
// Create the database connection
mongoose_1.default
    .plugin((schema) => {
    schema.pre("findOneAndUpdate", setRunValidators);
    schema.pre("updateMany", setRunValidators);
    schema.pre("updateOne", setRunValidators);
    schema.pre("update", setRunValidators);
})
    .connect(dbURI, options)
    .then(() => {
    Logger_1.default.info("Mongoose connection done");
})
    .catch(e => {
    Logger_1.default.info("Mongoose connection error");
    Logger_1.default.error(e);
});
// CONNECTION EVENTS
// When successfully connected
mongoose_1.default.connection.on("connected", () => {
    Logger_1.default.debug("Mongoose default connection open to " + dbURI);
});
// If the connection throws an error
mongoose_1.default.connection.on("error", err => {
    Logger_1.default.error("Mongoose default connection error: " + err);
});
// When the connection is disconnected
mongoose_1.default.connection.on("disconnected", () => {
    Logger_1.default.info("Mongoose default connection disconnected");
});
// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
    mongoose_1.default.connection.close().finally(() => {
        Logger_1.default.info("Mongoose default connection disconnected through app termination");
        process.exit(0);
    });
});
exports.connection = mongoose_1.default.connection;
