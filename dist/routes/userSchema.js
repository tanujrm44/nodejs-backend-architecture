"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = void 0;
const zod_1 = require("zod");
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email({
        message: "Inavlid email",
    }),
    password: zod_1.z.string(),
});
