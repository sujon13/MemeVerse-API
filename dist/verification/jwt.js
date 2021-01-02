"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.JWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV == undefined) {
    dotenv_1.default.config();
}
class JWT {
    constructor() { }
}
exports.JWT = JWT;
JWT.verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        var token = authHeader.substring(7, authHeader.length);
    }
    else {
        const message = 'Access Denied! Token is invalid';
        console.log(message);
        return res.status(401).send(message);
    }
    //verify a token symmetric
    const JWT_SECRET = process.env.TOKEN_SECRET || 'abcde';
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) {
            console.log(err);
            return res.status(401).send(err);
        }
        console.log(`decoded payload: `, decoded);
        if (decoded.isAccessToken === false) {
            res.status(401).send('Access Denied! Token is invalid');
        }
        else {
            req.payload = decoded;
            next();
        }
    });
});
JWT.verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        var token = authHeader.substring(7, authHeader.length);
    }
    else {
        return res.status(401).send('Access Denied! Token is invalid');
    }
    //verify a token symmetric
    const JWT_SECRET = process.env.TOKEN_SECRET || 'abcde';
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send(err);
        }
        console.log(decoded);
        if (decoded.isAccessToken === false) {
            res.status(401).send('Access Denied! Token is invalid');
        }
        else if (decoded.isAdmin === false) {
            res.status(403).send('Access Denied! You do not have enough permission!');
        }
        else {
            req.payload = decoded;
            next();
        }
    });
});
//# sourceMappingURL=jwt.js.map