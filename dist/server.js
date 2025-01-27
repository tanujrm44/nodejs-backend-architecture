"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./database/index");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const config_1 = require("./config");
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const PORT = config_1.port !== null && config_1.port !== void 0 ? config_1.port : 8080;
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({ origin: config_1.corsUrl, optionsSuccessStatus: 200 }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use("/api/users", userRoutes_1.default);
exports.app.use("/api/todo", todoRoutes_1.default);
exports.app.use(errorMiddleware_1.errorHandler);
exports.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
