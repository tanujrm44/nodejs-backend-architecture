"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenInfo = exports.corsUrl = exports.db = exports.logDirectory = exports.port = exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.environment = process.env.NODE_ENV;
exports.port = process.env.PORT;
exports.logDirectory = process.env.LOG_DIR;
exports.db = {
    name: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    port: process.env.DB_PORT || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_USER_PWD || "",
    minPoolSize: parseInt((_a = process.env.DB_MIN_POOL_SIZE) !== null && _a !== void 0 ? _a : "5"),
    maxPoolSize: parseInt((_b = process.env.DB_MAX_POOL_SIZE) !== null && _b !== void 0 ? _b : "10"),
};
exports.corsUrl = process.env.CORS_URL;
exports.tokenInfo = {
    accessTokenValidity: parseInt("30"),
    refreshTokenValidity: parseInt((_c = process.env.REFRESH_TOKEN_VALIDITY_SEC) !== null && _c !== void 0 ? _c : "86400"),
    issuer: (_d = process.env.TOKEN_ISSUER) !== null && _d !== void 0 ? _d : "",
    audience: (_e = process.env.TOKEN_AUDIENCE) !== null && _e !== void 0 ? _e : "",
    secret: (_f = process.env.TOKEN_SECRET) !== null && _f !== void 0 ? _f : "",
    algorithm: (_g = process.env.TOKEN_ALGORITHM) !== null && _g !== void 0 ? _g : "",
};
