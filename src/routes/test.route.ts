import { Router } from "express";
import { TestController } from "./../controllers/test.controller";

export class TestRoutes {
    router: Router;
    private testController: TestController = new TestController();
    
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        let basePath = "/";
        this.router.get(basePath,
            [
                //this.authController.authenticateJWT
            ],
            this.testController.findAll
        );
    }
}