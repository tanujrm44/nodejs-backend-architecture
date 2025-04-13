"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSource = void 0;
const zod_1 = require("zod");
const CustomError_1 = require("../core/CustomError");
var ValidationSource;
(function (ValidationSource) {
    ValidationSource["BODY"] = "body";
    ValidationSource["QUERY"] = "query";
    ValidationSource["HEADER"] = "header";
    ValidationSource["PARAM"] = "params";
})(ValidationSource || (exports.ValidationSource = ValidationSource = {}));
const validateRequest = (schema, source = ValidationSource.BODY) => {
    return (req, res, next) => {
        try {
            const data = schema.parse(req[source]);
            Object.assign(req[source], data);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const message = err.errors.map(e => e.message).join(", ");
                return next(new CustomError_1.BadRequestError(message));
            }
            next(err);
        }
    };
};
exports.default = validateRequest;
