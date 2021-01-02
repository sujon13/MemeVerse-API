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
exports.UserController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_entity_1 = require("../models/user.entity");
if (process.env.NODE_ENV == undefined) {
    dotenv_1.default.config();
}
;
// admin list
const adminList = ['arifurrahmansujon27@gmail.com'];
class UserController {
    constructor() {
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            console.log(req.body);
            let hashedPassword = '';
            try {
                const salt = yield bcrypt.genSalt(10);
                hashedPassword = yield bcrypt.hash(body.password, salt);
            }
            catch (error) {
                res.sendStatus(500);
            }
            const user = new user_entity_1.User({
                name: body.name,
                email: body.email,
                password: hashedPassword,
                isAdmin: false
            });
            // check if request comes from any admin
            if (adminList.includes(body.email))
                user.isAdmin = true;
            try {
                const savedUser = yield user.save();
                if (!savedUser) {
                    return res.status(500).send('user could not be saved');
                }
                const response = {
                    name: savedUser.name,
                    email: savedUser.email,
                    id: savedUser._id,
                };
                res.status(201).send(response);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
        this.signin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            console.log('signin req.body: ', req.body);
            let user;
            try {
                user = yield user_entity_1.User.findOne({ email: req.body.email });
                if (!user) {
                    return res.status(401).send('Email or password is invalid');
                }
                const isPasswordMatched = yield bcrypt.compare(body.password, user.password);
                if (!isPasswordMatched) {
                    return res.status(401).send('Email or password is invalid');
                }
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
            const accessToken = this.createAccessToken(user);
            const response = {
                profile: {
                    name: user === null || user === void 0 ? void 0 : user.name,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    profilePicUrl: user === null || user === void 0 ? void 0 : user.profilePicUrl,
                    _id: user === null || user === void 0 ? void 0 : user._id
                },
                accessToken: accessToken,
            };
            console.log(`${this.constructor.name}->signin()->response: `, response);
            res.status(200).send(response);
        });
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield user_entity_1.User.findById((_a = req === null || req === void 0 ? void 0 : req.payload) === null || _a === void 0 ? void 0 : _a.user_id, '_id, name email');
                if (!user) {
                    return res.status(404).send('Account not found');
                }
                res.status(200).send(user);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
        this.createAccessToken = (user) => {
            var _a, _b;
            const payload = {
                user_id: user === null || user === void 0 ? void 0 : user._id,
                name: user === null || user === void 0 ? void 0 : user.name,
                email: (_a = user === null || user === void 0 ? void 0 : user.email) === null || _a === void 0 ? void 0 : _a.toString(),
                isAdmin: (_b = user === null || user === void 0 ? void 0 : user.isAdmin) === null || _b === void 0 ? void 0 : _b.valueOf(),
                isAccessToken: true
            };
            const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: '24h'
            });
            return accessToken;
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map