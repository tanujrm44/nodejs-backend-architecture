"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["BAD_REQUEST"] = "BadRequest";
    ErrorType["NOT_FOUND"] = "NotFound";
    ErrorType["UNAUTHORIZED"] = "Unauthorized";
    ErrorType["FORBIDDEN"] = "Forbidden";
    ErrorType["INTERNAL"] = "Internal";
    ErrorType["TOKEN_EXPIRED"] = "TokenExpired";
    ErrorType["BAD_TOKEN"] = "BadToken";
    ErrorType["ACCESS_TOKEN_ERROR"] = "AccessTokenError";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
class ApiError extends Error {
    constructor(type, statusCode, message) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    static handle(err, res) {
        console.log(err.statusCode);
        res.status(err.statusCode || 500).json({
            type: err.type || ErrorType.INTERNAL,
            message: err.message || "Internal Server Error",
        });
    }
}
exports.ApiError = ApiError;
