"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./database/index");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const config_1 = require("./config");
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const ApiError_1 = require("./core/ApiError");
const Logger_1 = __importDefault(require("./core/Logger"));
const CustomError_1 = require("./core/CustomError");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: config_1.corsUrl, optionsSuccessStatus: 200 }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/users", userRoutes_1.default);
app.use("/api/todo", todoRoutes_1.default);
app.use((err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        ApiError_1.ApiError.handle(err, res);
        if (err.type === ApiError_1.ErrorType.INTERNAL) {
            Logger_1.default.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        }
        else {
            Logger_1.default.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        }
        Logger_1.default.error(err.stack);
        if (config_1.environment === "development") {
            res.status(500).send({
                message: err.message,
                stack: err.stack,
            });
        }
    }
    ApiError_1.ApiError.handle(new CustomError_1.InternalError(), res);
});
exports.default = app;
