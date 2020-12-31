import { Router } from "express";
import { AuthController } from "./../controllers/auth.controller";

export class AuthRoutes {
    router: Router;
    private authController: AuthController = new AuthController();
    
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
            this.authController.findAll
        )
    }
}