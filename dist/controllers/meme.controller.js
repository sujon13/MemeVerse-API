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
exports.MemeController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const meme_entity_1 = require("../models/meme.entity");
const like_entity_1 = require("../models/like.entity");
const meme_service_1 = require("../services/meme.service");
const validator_1 = require("../validator");
if (process.env.NODE_ENV == undefined) {
    dotenv_1.default.config();
}
class MemeController {
    constructor() {
        this.memeServive = new meme_service_1.MemeService();
        this.getMemes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const page = req.page;
            const limit = req.limit;
            const time = new Date();
            try {
                const memes = yield meme_entity_1.Meme.find({}, '_id owner content url numOfLikes numOfComments sharedAt', {
                    sort: '-sharedAt',
                    skip: (page - 1) * limit,
                    limit: limit
                });
                console.log(`Retrieve meme list, count: `, memes.length);
                res.status(200).send(memes);
            }
            catch (error) {
                console.log(`${this.constructor.name}->getMemes()-> error: `, error);
                res.sendStatus(500);
            }
        });
        this.createMeme = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const isOwnerIdValid = validator_1.Validator.mongoDbIdCheckerFunc((_a = req.payload) === null || _a === void 0 ? void 0 : _a.user_id);
            if (isOwnerIdValid === false) {
                return res.status(400).send('ownerId is invalid');
            }
            const meme = new meme_entity_1.Meme({
                owner: {
                    id: (_b = req.payload) === null || _b === void 0 ? void 0 : _b.user_id,
                    name: (_c = req.payload) === null || _c === void 0 ? void 0 : _c.name,
                    email: (_d = req.payload) === null || _d === void 0 ? void 0 : _d.email
                },
                content: (_e = req.body) === null || _e === void 0 ? void 0 : _e.content,
                url: req.file.path,
                numOfLikes: 0,
                numOfComments: 0,
                sharedAt: new Date(),
            });
            try {
                const createdMeme = yield meme.save();
                console.log(`${this.constructor.name}->createMeme()-> created meme: `, createdMeme);
                res.status(200).send(createdMeme);
            }
            catch (error) {
                console.log(`${this.constructor.name}->createMeme()-> error: `, error);
                res.sendStatus(500);
            }
        });
        this.updateMeme = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _f, _g, _h, _j;
            const memeId = req.params.id;
            const body = req.body;
            const userId = (_f = req.payload) === null || _f === void 0 ? void 0 : _f.user_id;
            const meme = yield this.memeServive.getMemeById(memeId);
            if (meme === null) {
                console.log(`${this.constructor.name}->updateMeme()-> could not get meme for id: ${memeId}`);
                return res.sendStatus(404);
            }
            if (body.like === true) {
                const shouldIncrement = yield this.updateLikeInfo(memeId, userId === null || userId === void 0 ? void 0 : userId.toString());
                meme.numOfLikes = shouldIncrement
                    ? ((_g = meme.numOfLikes) === null || _g === void 0 ? void 0 : _g.valueOf()) + 1
                    : ((_h = meme.numOfLikes) === null || _h === void 0 ? void 0 : _h.valueOf()) - 1;
            }
            if (body.comment === true && body.content) {
                meme.numOfComments = ((_j = meme.numOfComments) === null || _j === void 0 ? void 0 : _j.valueOf()) + 1;
                meme.comments.push({
                    content: body.content,
                    userId: userId,
                    time: new Date()
                });
            }
            try {
                const updatedMeme = yield meme.save();
                console.log(`${this.constructor.name}->updateMeme()-> updated meme for id ${memeId}: `, updatedMeme);
                res.sendStatus(204);
            }
            catch (error) {
                console.log(`${this.constructor.name}->updateMeme()-> update failed for memeId ${memeId}`);
                res.sendStatus(500);
            }
        });
        this.updateLikeInfo = (memeId, userId) => __awaiter(this, void 0, void 0, function* () {
            console.log(`${this.constructor.name}->updateLikeInfo()-> memeId ${memeId}, userId: ${userId}`);
            try {
                const likeInfo = yield like_entity_1.Like.findOne({
                    memeId: memeId,
                    userId: userId
                });
                if (likeInfo) {
                    console.log(`${this.constructor.name}->updateLikeInfo()-> got like info for memeId ${memeId} and is: `, likeInfo);
                    const alreadyLiked = likeInfo.alreadyLiked.valueOf();
                    likeInfo.alreadyLiked = alreadyLiked ? false : true;
                    yield likeInfo.save();
                    return !alreadyLiked;
                }
                else {
                    const newLikeInfo = new like_entity_1.Like({
                        memeId: memeId,
                        userId: userId,
                        alreadyLiked: true
                    });
                    const savedLikeInfo = yield newLikeInfo.save();
                    console.log(`${this.constructor.name}->updateLikeInfo()-> newLikeInfo: `, savedLikeInfo);
                    return true;
                }
            }
            catch (error) {
                console.log(`${this.constructor.name}->userAlreadyLiked()-> error: `, error);
                return true;
            }
        });
        this.getUserLikeInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _k, _l;
            const userId = (_l = (_k = req.payload) === null || _k === void 0 ? void 0 : _k.user_id) === null || _l === void 0 ? void 0 : _l.toString();
            const memeIdList = req.query.memeIdList;
            console.log(`${this.constructor.name}->getUserLikeInfo()->userId: ${userId}`);
            try {
                const list = yield like_entity_1.Like.find({
                    memeId: {
                        $in: memeIdList
                    },
                    userId: userId
                });
                console.log(`${this.constructor.name}->getUserLikeInfo()->likeinfo list: `, list);
                res.status(200).send(list);
            }
            catch (error) {
                console.log(`${this.constructor.name}->getUserLikeInfo()->error: `, error);
                res.sendStatus(500);
            }
        });
    }
}
exports.MemeController = MemeController;
//# sourceMappingURL=meme.controller.js.map