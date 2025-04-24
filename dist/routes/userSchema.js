"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegisterSchema = exports.userLoginSchema = void 0;
const zod_1 = require("zod");
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email({
        message: "Inavlid email",
    }),
    password: zod_1.z.string(),
});
exports.userRegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, {
        message: "Name must be at least 3 characters long",
    }),
    email: zod_1.z.string().email({
        message: "Inavlid email",
    }),
    password: zod_1.z
        .string()
        .min(6, {
        message: "Password must be at least 6 characters long",
    })
        .max(20, {
        message: "Password must be at most 20 characters long",
    }),
});
