"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_1 = require("../controllers/todoController");
const apiKey_1 = __importDefault(require("../auth/apiKey"));
const permission_1 = __importDefault(require("../helpers/permission"));
const apiKeyModel_1 = require("../models/apiKeyModel");
const authentication_1 = __importDefault(require("../auth/authentication"));
const role_1 = __importDefault(require("../helpers/role"));
const roleModel_1 = require("../models/roleModel");
const authorization_1 = __importDefault(require("../auth/authorization"));
const router = express_1.default.Router();
router.use(apiKey_1.default);
router.use((0, permission_1.default)(apiKeyModel_1.Permission.GENERAL));
router.use(authentication_1.default);
router
    .route("/")
    .post(todoController_1.createTodo)
    .get((0, role_1.default)(roleModel_1.RoleCode.ADMIN), authorization_1.default, todoController_1.getTodos);
router.route("/:id").put(todoController_1.editTodo).delete(todoController_1.deleteTodo);
exports.default = router;
