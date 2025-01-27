"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    if (err.name === "CastError") {
        message = "Resource Not Found";
        statusCode = 404;
    }
    res.status(statusCode);
    res.json({
        message: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
