import { NextFunction, Request, Response } from 'express';
import { Document, Schema, Model, model, Error } from 'mongoose';
import dotenv from 'dotenv';

import { Meme, IMeme } from '../models/meme.entity';
import { MemeService } from '../services/meme.service';
import { Validator } from '../validator';

if (process.env.NODE_ENV == undefined) {
    dotenv.config();
}

export interface UpdateMemeDTO {
    like: boolean,
    comment: boolean,
    userId?: Schema.Types.ObjectId,
    content?: string
}

export class MemeController {
    private memeServive: MemeService = new MemeService();

    constructor() {}

    public getMemes = async (req: Request, res: Response) => {
        const page = req.page;
        const limit = req.limit;
        const time = new Date();
    
        try {
            const memes = await Meme.find(
                {},
                '_id owner url numOfLikes numOfComments sharedAt',
                {
                    sort: '-sharedAt',
                    skip: (page - 1) * limit,
                    limit: limit
                }
            );
            console.log(`Retrieve meme list, count: `, memes.length);
            res.status(200).send(memes);
        } catch (error) {
            console.log(`${this.constructor.name}->getMemes()-> error: `, error);
            res.sendStatus(500);
        }
    }

    public createMeme = async (req: Request, res: Response) => {
        const isOwnerIdValid = Validator.mongoDbIdCheckerFunc(req.payload?.user_id);
        if (isOwnerIdValid === false) {
            return res.status(400).send('ownerId is invalid');
        }

        const meme = new Meme({
            ownerId: req.payload?.user_id,
            url: req.file.path,
            numOfLikes: 0,
            numOfComments: 0,
            sharedAt: new Date(),
        });

        try {
            const createdMeme = await meme.save();
            console.log(`${this.constructor.name}->createMeme()-> created meme: `, createdMeme);
            res.status(200).send(createdMeme);
        } catch (error) {
            console.log(`${this.constructor.name}->createMeme()-> error: `, error);
            res.sendStatus(500);
        }
    }

    public updateMeme = async (req: Request, res: Response) => {
        const memeId = req.params.id;
        const body: UpdateMemeDTO = req.body;
        
        const meme = await this.memeServive.getMemeId(memeId);
        if (meme === null) {
            console.log(`${this.constructor.name}->updateMeme()-> could not get meme for id: ${memeId}`);
            return res.sendStatus(404);
        }

        if (body.like === true) {
            meme.numOfLikes = meme.numOfLikes?.valueOf() + 1;
        }
        if (body.comment === true && body.userId && body.content) {
            meme.numOfComments = meme.numOfComments?.valueOf() + 1;
            meme.comments.push ({
                content: body.content,
                userId: body.userId,
                time: new Date()
            });  
        }

        try {
            const updatedMeme = await meme.save();
            console.log(`${this.constructor.name}->updateMeme()-> updated meme for id ${memeId}: `, updatedMeme);
            res.status(204);
        } catch (error) {
            console.log(`${this.constructor.name}->updateMeme()-> update failed for memeId ${memeId}`);
            res.sendStatus(500);
        }
    }
}
