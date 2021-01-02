import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

import { Meme, IMeme } from '../models/meme.entity';
import { Like, ILike } from '../models/like.entity';
import { MemeService } from '../services/meme.service';
import { Validator } from '../validator';

if (process.env.NODE_ENV == undefined) {
    dotenv.config();
}

export interface UpdateMemeDTO {
    like: boolean,
    comment: boolean,
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
                '_id owner content url numOfLikes numOfComments sharedAt',
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
            owner: {
                id: req.payload?.user_id,
                name: req.payload?.name,
                email: req.payload?.email
            },
            content: req.body?.content,
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
        const userId = req.payload?.user_id;
        
        const meme = await this.memeServive.getMemeById(memeId);
        if (meme === null) {
            console.log(`${this.constructor.name}->updateMeme()-> could not get meme for id: ${memeId}`);
            return res.sendStatus(404);
        }
        
        if (body.like === true) {
            const shouldIncrement = await this.updateLikeInfo(memeId, userId?.toString());
            meme.numOfLikes = shouldIncrement
                ? meme.numOfLikes?.valueOf() + 1
                : meme.numOfLikes?.valueOf() - 1;
        }
        if (body.comment === true && body.content) {
            meme.numOfComments = meme.numOfComments?.valueOf() + 1;
            meme.comments.push ({
                content: body.content,
                userId: userId,
                time: new Date()
            });  
        }

        try {
            const updatedMeme = await meme.save();
            console.log(`${this.constructor.name}->updateMeme()-> updated meme for id ${memeId}: `, updatedMeme);
            res.sendStatus(204);
        } catch (error) {
            console.log(`${this.constructor.name}->updateMeme()-> update failed for memeId ${memeId}`);
            res.sendStatus(500);
        }
    }

    private updateLikeInfo = async (memeId: string, userId: string) => {
        console.log(`${this.constructor.name}->updateLikeInfo()-> memeId ${memeId}, userId: ${userId}`);
        try {
            const likeInfo = await Like.findOne(
                {
                    memeId: memeId,
                    userId: userId
                }
            );

            if (likeInfo) {
                console.log(`${this.constructor.name}->updateLikeInfo()-> got like info for memeId ${memeId} and is: `, likeInfo);
                const alreadyLiked = likeInfo.alreadyLiked.valueOf();
                likeInfo.alreadyLiked = alreadyLiked ? false : true;
                await likeInfo.save();
                return !alreadyLiked;
            } else {
                const newLikeInfo = new Like({
                    memeId: memeId,
                    userId: userId,
                    alreadyLiked: true
                });
                const savedLikeInfo = await newLikeInfo.save();
                console.log(`${this.constructor.name}->updateLikeInfo()-> newLikeInfo: `, savedLikeInfo);
                return true;
            }
        } catch (error) {
            console.log(`${this.constructor.name}->userAlreadyLiked()-> error: `, error);
            return true;
        }
    }

    public getUserLikeInfo = async (req: Request, res: Response) => {
        const userId = req.payload?.user_id?.toString();
        const memeIdList: any = req.query.memeIdList;
        console.log(`${this.constructor.name}->getUserLikeInfo()->userId: ${userId}`);

        try {
            const list = await Like.find(
                {
                    memeId: {
                        $in: memeIdList
                    },
                    userId: userId
                }
            );
            console.log(`${this.constructor.name}->getUserLikeInfo()->likeinfo list: `, list);
            res.status(200).send(list);
        } catch (error) {
            console.log(`${this.constructor.name}->getUserLikeInfo()->error: `, error);
            res.sendStatus(500);
        }
    }
}
