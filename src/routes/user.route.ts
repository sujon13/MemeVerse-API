import { Router } from "express";
import { UserController } from "./../controllers/user.controller";
import { Validator } from '../validator';
import { JWT } from '../verification/jwt';

export class UserRoutes {
    router: Router;
    private userController: UserController = new UserController();
    
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        let basePath = "/";

        this.router.post(basePath,
            [
                Validator.signupValidator
            ],
            this.userController.signup
        );
        this.router.post(`/signin`,
            this.userController.signin
        );
        
        this.router.get(`/me`,
            [
                JWT.verifyToken
            ],
            this.userController.getUserById
        );
    }
}