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
exports.deleteTodo = exports.editTodo = exports.getTodos = exports.createTodo = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const todoModel_1 = __importDefault(require("../models/todoModel"));
const createTodo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    console.log(req.user);
    if (!title || !description) {
        res.status(400);
        throw new Error("Title and Description are required");
    }
    yield todoModel_1.default.create({ user: req.user, title, description });
    res.status(201).json({ title, description });
}));
exports.createTodo = createTodo;
const getTodos = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const todos = yield todoModel_1.default.find({
        user: user,
    });
    res.json(todos);
}));
exports.getTodos = getTodos;
const editTodo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status } = req.body;
    const user = req.user;
    if (!title || !description || !status) {
        res.status(400);
        throw new Error("Title, Description, and Status are required");
    }
    const todo = yield todoModel_1.default.findById(req.params.id);
    if ((todo === null || todo === void 0 ? void 0 : todo.user.toString()) !== user._id.toString()) {
        res.status(401);
        throw new Error("Not authorized to update this todo");
    }
    if (!todo) {
        res.status(404);
        throw new Error("Todo not found");
    }
    todo.title = title;
    todo.description = description;
    todo.status = status;
    const updatedTodo = yield todo.save();
    res.json(updatedTodo);
}));
exports.editTodo = editTodo;
const deleteTodo = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = yield todoModel_1.default.findById(req.params.id);
    if (todo) {
        yield todo.deleteOne();
        res.json({ message: "Todo removed" });
    }
    else {
        res.status(404);
        throw new Error("Todo not found");
    }
}));
exports.deleteTodo = deleteTodo;
