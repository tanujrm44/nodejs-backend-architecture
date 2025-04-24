"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_1 = require("../controllers/todoController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const apiKey_1 = __importDefault(require("../auth/apiKey"));
const permission_1 = __importDefault(require("../helpers/permission"));
const ApiKeyModel_1 = require("../models/ApiKeyModel");
const router = express_1.default.Router();
router.use(apiKey_1.default);
router.use((0, permission_1.default)(ApiKeyModel_1.Permission.GENERAL));
router.route("/").post(authMiddleware_1.protect, todoController_1.createTodo).get(todoController_1.getTodos);
router.route("/:id").put(authMiddleware_1.protect, todoController_1.editTodo).delete(authMiddleware_1.protect, todoController_1.deleteTodo);
exports.default = router;
