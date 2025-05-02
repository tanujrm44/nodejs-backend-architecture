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
exports.logoutUser = exports.registerUser = exports.loginUser = exports.refreshAccessToken = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const mongoose_1 = require("mongoose");
const CustomError_1 = require("../core/CustomError");
const userSchema_1 = require("../routes/userSchema");
const crypto_1 = __importDefault(require("crypto"));
const keyStoreController_1 = require("./keyStoreController");
const utils_1 = require("../auth/utils");
const config_1 = require("../config");
const JWT_1 = __importDefault(require("../core/JWT"));
const keyStoreModel_1 = require("../models/keyStoreModel");
const roleController_1 = __importDefault(require("./roleController"));
const roleModel_1 = require("../models/roleModel");
const loginUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    const data = userSchema_1.userLoginSchema.safeParse({ email, password });
    if (!data.success) {
        throw new CustomError_1.BadRequestError("Invalid User Credentials");
    }
    const user = yield userModel_1.default.findOne({ email });
    if (user && (yield ((_a = user === null || user === void 0 ? void 0 : user.matchPassword) === null || _a === void 0 ? void 0 : _a.call(user, password)))) {
        const accessTokenKey = crypto_1.default.randomBytes(64).toString("hex");
        const refreshTokenKey = crypto_1.default.randomBytes(64).toString("hex");
        yield (0, keyStoreController_1.create)(user, accessTokenKey, refreshTokenKey);
        const tokens = yield (0, utils_1.createTokens)(user, accessTokenKey, refreshTokenKey);
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: config_1.environment === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, //ms
        });
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: config_1.environment === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, //ms
        });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else {
        throw new CustomError_1.BadRequestError("Invalid User Credentials");
    }
}));
exports.loginUser = loginUser;
const registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const userExists = yield userModel_1.default.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already Exists");
        }
        const user = yield userModel_1.default.create({
            name,
            email,
            password,
            roles: [yield (0, roleController_1.default)(roleModel_1.RoleCode.USER)],
        });
        if (user) {
            const accessTokenKey = crypto_1.default.randomBytes(64).toString("hex");
            const refreshTokenKey = crypto_1.default.randomBytes(64).toString("hex");
            yield (0, keyStoreController_1.create)(user, accessTokenKey, refreshTokenKey);
            const tokens = yield (0, utils_1.createTokens)(user, accessTokenKey, refreshTokenKey);
            res.cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                secure: config_1.environment === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000, //ms
            });
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: config_1.environment === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000, //ms
            });
            res.status(201);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        }
        else {
            throw new CustomError_1.BadRequestError("Invalid user credentials");
        }
    }
    catch (error) {
        console.log(error);
    }
}));
exports.registerUser = registerUser;
exports.refreshAccessToken = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.accessToken = (0, utils_1.getAccessToken)(req.headers.authorization);
    const accessTokenPayload = yield JWT_1.default.decode(req.accessToken);
    (0, utils_1.validateTokenData)(accessTokenPayload);
    const user = yield userModel_1.default.findById(new mongoose_1.Types.ObjectId(accessTokenPayload.sub));
    if (!user)
        throw new CustomError_1.BadRequestError("User not registered");
    req.user = user;
    const refreshTokenPayload = yield JWT_1.default.validate(req.body.refreshToken, config_1.tokenInfo.secret);
    (0, utils_1.validateTokenData)(refreshTokenPayload);
    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
        throw new CustomError_1.BadRequestError("Invalid access token");
    const keystore = yield keyStoreModel_1.KeyStoreModel.find({
        client: req.user,
        primaryKey: accessTokenPayload.prm,
        secondaryKey: refreshTokenPayload.prm,
    });
    if (!keystore)
        throw new CustomError_1.BadRequestError("Invalid access token");
    yield keyStoreModel_1.KeyStoreModel.deleteOne({
        client: req.user,
        primaryKey: accessTokenPayload.prm,
        secondaryKey: refreshTokenPayload.prm,
    });
    const accessTokenKey = crypto_1.default.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto_1.default.randomBytes(64).toString("hex");
    yield (0, keyStoreController_1.create)(req.user, accessTokenKey, refreshTokenKey);
    const tokens = yield (0, utils_1.createTokens)(req.user, accessTokenKey, refreshTokenKey);
    res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: config_1.environment === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, //ms
    });
    res.status(200).json({
        message: "Access Token Refreshed",
    });
}));
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
const logoutUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        message: "Logged Out Successfully",
    });
}));
exports.logoutUser = logoutUser;
