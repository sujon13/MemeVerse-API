"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./../controllers/auth.controller");
class AuthRoutes {
    constructor() {
        this.authController = new auth_controller_1.AuthController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        let basePath = "/";
        this.router.get(basePath, [
        //this.authController.authenticateJWT
        ], this.authController.findAll);
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=auth.route.js.map