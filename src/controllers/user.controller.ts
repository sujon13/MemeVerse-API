import { NextFunction, Request, Response } from 'express';
import { Document, Schema, Model, model, Error } from 'mongoose';
import dotenv from 'dotenv';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

import { User, IUser } from '../models/user.entity';

if (process.env.NODE_ENV == undefined) {
    dotenv.config();
}

export interface IPayload {
    user_id: Schema.Types.ObjectId,
    email: string,
    isAdmin: boolean,
    isAccessToken: boolean
};

// admin list
const adminList = ['arifurrahmansujon27@gmail.com'];

export class UserController {
    constructor() {}

    public signup = async (req: Request, res: Response) => {
        const body = req.body;
        console.log(req.body);
        
        let hashedPassword = '';
        try {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(body.password, salt);
        } catch (error) {
            res.sendStatus(500);
        }

        const user: IUser = new User({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            isAdmin: false
        });

        // check if request comes from any admin
        if (adminList.includes(body.email)) user.isAdmin = true;
    
        try {
            const savedUser = await user.save();
            if (!savedUser) {
                return res.status(500).send('user could not be saved');
            }
    
            const response = {
                name: savedUser.name,
                email: savedUser.email,
                id: savedUser._id,
            };
            res.status(201).send(response);
        } catch (error) {
            res.status(500).send(error);
        }
    };

    public signin = async (req: Request, res: Response) => {
        const body = req.body;
        console.log('signin req.body: ', req.body);
    
        let user: any;
        try {
            user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).send('Email or password is invalid');
            }
    
            const isPasswordMatched = await bcrypt.compare(
                body.password,
                user.password
            );
            if (!isPasswordMatched) {
                return res.status(401).send('Email or password is invalid');
            }
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    
        const accessToken = this.createAccessToken(user);
        const response = {
            profile: {
                name: user?.name,
                email: user?.email,
                profilePicUrl: user?.profilePicUrl,
                _id: user?._id
            },
            accessToken: accessToken,
        };
        console.log(`${this.constructor.name}->signin()->response: `, response);
        res.status(200).send(response);   
    }

    public getUserById = async (req: Request, res: Response) => {
        try {
            const user = await User.findById(
                req?.payload?.user_id,
                '_id, name email'
            );
            if (!user) {
                return res.status(404).send('Account not found');
            }
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    private createAccessToken = (user: IUser): string => {
        const payload: IPayload = {
            user_id: user?._id,
            email: user?.email?.toString(),
            isAdmin: user?.isAdmin?.valueOf(),
            isAccessToken: true
        };
    
        const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: '24h'
        });
        return accessToken;
    }
}
