import { NextFunction, Request, Response } from 'express';
import { User } from './models/user.entity';
const Joi = require('@hapi/joi');

const minimumPasswordLength = 6;

export class Validator {
    constructor(){}

    public static signupValidator = async (req: Request, res: Response, next: NextFunction) => {
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
            const exists = await User.findOne(
                {
                    email: req.body.email    
                }
            );
            if (exists) {
                return res.status(409).send('Email already exists');
            }
            next();
        } catch (error) {
            res.sendStatus(500);
        }
    };

    public static passwordValidator = async (req: Request, res: Response, next: NextFunction) => {
        const password = req.body.password;
    
        if (!password || password.length < minimumPasswordLength) {
            console.log('password must be strong! It should be atleast 6 characters long');
            return res.status(400).send('Password should be atleast 6 characters long');
        }
        next();
    };

    public static emailValidator = async (req: Request, res: Response, next: NextFunction) => {
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
            req.email = req.query.email?.toString();
            next();
        } else {
            res.status(400).send('Email is invalid!');
        }
    };

    public static pageAndLimitValidation = async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page?.toString() || '1');
        const limit = parseInt(req.query.limit?.toString() || '5');

        if (!Number.isInteger(page) || !Number.isInteger(limit)) {
            return res.status(400).send('page or limit is invalid');
        }

        req.page = page;
        req.limit = limit;
        next();
    };
    
    public static mongoDbIdValidation = async (req: Request, res: Response, next: NextFunction) => {
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
    };
    
    public static mongoDbIdCheckerFunc = (id: any): boolean => {
        const mongoDbIdChecker = new RegExp('^[0-9a-fA-F]{24}$');
        if (id === undefined) {
            return false;
        }
    
        if (mongoDbIdChecker.test(id) === false) {
            return false;
        }
        return true;
    }

    public static validateIncomingFile = (req: Request, res: Response, next: NextFunction) => {
        if (req.file && req.file.path) {
            console.log('This is valid file');
            next();
        } else {
            res.status(400).send('This file type is not allowed');
        }
    }
}