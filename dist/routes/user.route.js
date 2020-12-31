"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./../controllers/user.controller");
const validator_1 = require("../validator");
const jwt_1 = require("../verification/jwt");
class UserRoutes {
    constructor() {
        this.userController = new user_controller_1.UserController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        let basePath = "/";
        this.router.post(basePath, [
            validator_1.Validator.signupValidator
        ], this.userController.signup);
        this.router.post(`/signin`, this.userController.signin);
        this.router.get(`/me`, [
            jwt_1.JWT.verifyToken
        ], this.userController.getUserById);
    }
}
exports.UserRoutes = UserRoutes;
//# sourceMappingURL=user.route.js.map