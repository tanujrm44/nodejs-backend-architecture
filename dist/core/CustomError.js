"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenError = exports.BadTokenError = exports.TokenExpiredError = exports.InternalError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = void 0;
const ApiError_1 = require("./ApiError");
class BadRequestError extends ApiError_1.ApiError {
    constructor(message = "Bad Request") {
        super(ApiError_1.ErrorType.BAD_REQUEST, 400, message);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ApiError_1.ApiError {
    constructor(message = "Not Found") {
        super(ApiError_1.ErrorType.NOT_FOUND, 404, message);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends ApiError_1.ApiError {
    constructor(message = "Unauthorized") {
        super(ApiError_1.ErrorType.UNAUTHORIZED, 401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError_1.ApiError {
    constructor(message = "Forbidden") {
        super(ApiError_1.ErrorType.FORBIDDEN, 403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalError extends ApiError_1.ApiError {
    constructor(message = "Internal Server Error") {
        super(ApiError_1.ErrorType.INTERNAL, 500, message);
    }
}
exports.InternalError = InternalError;
class TokenExpiredError extends ApiError_1.ApiError {
    constructor(message = "Token Expired") {
        super(ApiError_1.ErrorType.TOKEN_EXPIRED, 401, message);
    }
}
exports.TokenExpiredError = TokenExpiredError;
class BadTokenError extends ApiError_1.ApiError {
    constructor(message = "Bad Token") {
        super(ApiError_1.ErrorType.BAD_TOKEN, 401, message);
    }
}
exports.BadTokenError = BadTokenError;
class AccessTokenError extends ApiError_1.ApiError {
    constructor(message = "Access Token Error") {
        super(ApiError_1.ErrorType.ACCESS_TOKEN_ERROR, 401, message);
    }
}
exports.AccessTokenError = AccessTokenError;
