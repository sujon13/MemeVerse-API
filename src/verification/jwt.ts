import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

if (process.env.NODE_ENV == undefined) {
    dotenv.config();
}

export class JWT {
    constructor() {}

    public static verifyToken = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            var token = authHeader.substring(7, authHeader.length);
        } else {
            const message = 'Access Denied! Token is invalid';
            console.log(message);
            return res.status(401).send(message);
        }
    
        //verify a token symmetric
        const JWT_SECRET = process.env.TOKEN_SECRET || 'abcde';
        jwt.verify(token, JWT_SECRET, function (err: any, decoded: any) {
            if (err) {
                console.log(err);
                return res.status(401).send(err);
            }
            console.log(`decoded payload: `, decoded);

            if (decoded.isAccessToken === false) {
                res.status(401).send('Access Denied! Token is invalid');
            } else {
                req.payload = decoded;
                next();
            }
        });
    }

    public static verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            var token = authHeader.substring(7, authHeader.length);
        } else {
            return res.status(401).send('Access Denied! Token is invalid');
        }
    
        //verify a token symmetric
        const JWT_SECRET = process.env.TOKEN_SECRET || 'abcde';
        jwt.verify(token, JWT_SECRET, function (err: any, decoded: any) {
            if (err) {
                return res.status(401).send(err);
            }
            console.log(decoded);

            if (decoded.isAccessToken === false) {
                res.status(401).send('Access Denied! Token is invalid')
            } else if (decoded.isAdmin === false) {
                res.status(403).send('Access Denied! You do not have enough permission!');
            } else {
                req.payload = decoded;
                next();
            }
        });
    }
}
