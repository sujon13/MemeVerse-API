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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const user_entity_1 = require("./models/user.entity");
const Joi = require('@hapi/joi');
const minimumPasswordLength = 6;
class Validator {
    constructor() { }
}
exports.Validator = Validator;
Validator.signupValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string()
            .min(6)
            .max(100)
            .email({ minDomainSegments: 2 })
            .required(),
        password: Joi.string().min(minimumPasswordLength).required()
    });
    // input data validation
    const { error } = schema.validate(req.body);
    if (error) {
        console.log('error: ', error);
        return res.status(400).send(error.details[0].message);
    }
    try {
        // duplicate check
        const exists = yield user_entity_1.User.findOne({
            email: req.body.email
        });
        if (exists) {
            return res.status(409).send('Email already exists');
        }
        next();
    }
    catch (error) {
        res.sendStatus(500);
    }
});
Validator.passwordValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    if (!password || password.length < minimumPasswordLength) {
        console.log('password must be strong! It should be atleast 6 characters long');
        return res.status(400).send('Password should be atleast 6 characters long');
    }
    next();
});
Validator.emailValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check if it is email
    let schema = Joi.object({
        email: Joi.string()
            .min(6)
            .max(100)
            .email({ minDomainSegments: 2 })
            .required()
    });
    const { error } = schema.validate(req.query);
    if (!error) {
        console.log('It is valid email');
        req.email = (_a = req.query.email) === null || _a === void 0 ? void 0 : _a.toString();
        next();
    }
    else {
        res.status(400).send('Email is invalid!');
    }
});
Validator.pageAndLimitValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const page = parseInt(((_b = req.query.page) === null || _b === void 0 ? void 0 : _b.toString()) || '1');
    const limit = parseInt(((_c = req.query.limit) === null || _c === void 0 ? void 0 : _c.toString()) || '5');
    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
        return res.status(400).send('page or limit is invalid');
    }
    req.page = page;
    req.limit = limit;
    next();
});
Validator.mongoDbIdValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mongoDbIdChecker = new RegExp('^[0-9a-fA-F]{24}$');
    const id = req.params.id;
    if (id === undefined) {
        next();
        return;
    }
    if (mongoDbIdChecker.test(id) === false) {
        return res.status(400).send('id is invalid');
    }
    next();
});
Validator.mongoDbIdCheckerFunc = (id) => {
    const mongoDbIdChecker = new RegExp('^[0-9a-fA-F]{24}$');
    if (id === undefined) {
        return false;
    }
    if (mongoDbIdChecker.test(id) === false) {
        return false;
    }
    return true;
};
Validator.validateIncomingFile = (req, res, next) => {
    if (req.file && req.file.path) {
        console.log('This is valid file');
        next();
    }
    else {
        res.status(400).send('This file type is not allowed');
    }
};
//# sourceMappingURL=validator.js.map