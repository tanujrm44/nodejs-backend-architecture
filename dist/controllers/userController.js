"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.registerUser = exports.loginUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (user && (yield ((_a = user === null || user === void 0 ? void 0 : user.matchPassword) === null || _a === void 0 ? void 0 : _a.call(user, password)))) {
        (0, generateToken_1.default)(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(401);
        throw new Error(" Invalid email or password");
    }
}));
exports.loginUser = loginUser;
const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userExists = yield userModel_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already Exists");
    }
    const user = yield userModel_1.default.create({ name, email, password });
    if (user) {
        (0, generateToken_1.default)(res, user._id);
        res.status(201);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid User Credentials");
    }
}));
exports.registerUser = registerUser;
// const forgotPassword = asyncHandler(
//   async (req: ProtectedRequest, res: Response) => {
//     const { email } = req.body
//     const user = await User.findOne({ email })
//     if (!user) {
//       res.status(404)
//       throw new Error("User Not Found")
//     }
//     const resetToken = user.createPasswordResetToken()
//     user.save()
//     const resetUrl = `${req.protocol}://localhost:3000/reset-password/${resetToken}`
//     const message = `Forgot Password? Click on this this link to reset your Password: ${resetUrl}`
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: "Your Password reset token. (valid for 10mins)",
//         message,
//       })
//       res.status(200).json({
//         message: "Token Sent to email!",
//       })
//     } catch (error) {
//       user.passwordResetToken = undefined
//       user.passwordResetExpires = undefined
//       user.save()
//       console.log(error)
//       res.status(500).json({
//         status: "error",
//         message:
//           "There was an error in sending the email. Please Try again later",
//       })
//     }
//   }
// )
// const resetPassword = asyncHandler(
//   async (req: ProtectedRequest, res: Response) => {
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.resetToken)
//       .digest("hex")
//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passwordResetExpires: { $gt: Date.now() },
//     })
//     if (!user) {
//       res.status(400).json({
//         status: "fail",
//         message: "Token is invalid or has expired",
//       })
//     }
//     user.password = req.body.password
//     user.passwordResetToken = undefined
//     user.passwordResetExpires = undefined
//     user.save()
//     generateToken(res, user._id)
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     })
//   }
// )
const logoutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        message: "Logged Out Successfully",
    });
}));
exports.logoutUser = logoutUser;
