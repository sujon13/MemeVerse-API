import { Router } from "express";
import { AuthController } from "./../controllers/auth.controller";
import { JWT } from '../verification/jwt';

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
                JWT.verifyToken
            ],
            this.authController.verifyToken
        )
    }
}