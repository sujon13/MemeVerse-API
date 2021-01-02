"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemeRoutes = void 0;
const express_1 = require("express");
const meme_controller_1 = require("./../controllers/meme.controller");
const validator_1 = require("../validator");
const jwt_1 = require("../verification/jwt");
const multer_service_1 = require("../services/multer.service");
class MemeRoutes {
    constructor() {
        this.memeController = new meme_controller_1.MemeController();
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        let basePath = "/";
        this.router.get(basePath, [
            validator_1.Validator.pageAndLimitValidation
        ], this.memeController.getMemes);
        this.router.get(`/like`, [
            jwt_1.JWT.verifyToken
        ], this.memeController.getUserLikeInfo);
        this.router.post(basePath, [
            jwt_1.JWT.verifyToken,
            multer_service_1.upload.single('image'),
            validator_1.Validator.validateIncomingFile
        ], this.memeController.createMeme);
        this.router.patch(`/:id`, [
            validator_1.Validator.mongoDbIdValidation,
            jwt_1.JWT.verifyToken
        ], this.memeController.updateMeme);
        this.router.get(`/:id/like`, [
            validator_1.Validator.mongoDbIdValidation,
            jwt_1.JWT.verifyToken
        ], this.memeController.getUserLikeInfo);
    }
}
exports.MemeRoutes = MemeRoutes;
//# sourceMappingURL=meme.route.js.map