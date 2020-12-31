import { Router } from "express";
import { MemeController } from "./../controllers/meme.controller";
import { Validator } from '../validator';
import { JWT } from '../verification/jwt';
import { upload } from '../services/multer.service';

export class MemeRoutes {
    router: Router;
    private memeController: MemeController = new MemeController();
    
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        let basePath = "/";

        this.router.get(basePath,
            [
                Validator.pageAndLimitValidation
            ],
            this.memeController.getMemes
        );

        this.router.post(basePath,
            [
                JWT.verifyToken,
                upload.single('image'),
                Validator.validateIncomingFile
            ],
            this.memeController.createMeme
        );

        this.router.patch(`/:id`,
            [
                Validator.mongoDbIdValidation
            ],
            this.memeController.updateMeme
        );

    }
}