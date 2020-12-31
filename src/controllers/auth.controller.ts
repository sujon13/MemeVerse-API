import { Request, Response } from 'express';

export class AuthController {
    constructor() {}

    public findAll = (req: Request, res: Response) => {
        res.status(200).send([]);
    } 
}
