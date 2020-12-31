"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRoutes = void 0;
const express_1 = require("express");
const test_controller_1 = require("./../controllers/test.controller");
class TestRoutes {
    constructor() {
        this.testController = new test_controller_1.TestController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        let basePath = "/";
        this.router.get(basePath, [
        //this.authController.authenticateJWT
        ], this.testController.findAll);
    }
}
exports.TestRoutes = TestRoutes;
//# sourceMappingURL=test.route.js.map