import { Request, Response } from 'express';

export class AuthController {
    constructor() {}
    
    public verifyToken = (req: Request, res: Response) => {
        res.sendStatus(200);
    }
}
