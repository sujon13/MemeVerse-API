import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { UserRoutes } from './routes/user.route';
import { AuthRoutes } from './routes/auth.route';
import { MemeRoutes } from './routes/meme.route';

if (process.env.NODE_ENV == undefined) {
    dotenv.config();
}

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();

        this.config();
        this.routes();
        this.mongo();
    }

    private routes(): void {
        this.app.use('/api/v1/users', new UserRoutes().router);
        this.app.use('/api/v1/auth', new AuthRoutes().router);
        this.app.use('/api/v1/memes', new MemeRoutes().router);
    }

    private config(): void {
        this.app.set('port', process.env.PORT || 3010);
        this.app.use('/src/uploads', express.static('src/uploads'));
        this.app.use(express.json({ limit: '25mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet());

        this.app.use(function (req: Request, res: Response, next: NextFunction) {
            console.log(`${req.method} ${req.originalUrl}`);
            console.log(`params: `, req.params);
            console.log(`query: `, req.query);
            console.log(`body: `, req.body);
            next();
        });
    }

    private mongo() {
        mongoose.set('useFindAndModify', false);
        mongoose.connect(
            `mongodb://localhost/${process.env.DATABASE_NAME}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            () => {
                console.log('connected to meme database');
            }
        );
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log(
                'API is running at http://localhost:%d',
                this.app.get('port')
            );
        });
    }
}

const server = new Server();
server.start();
