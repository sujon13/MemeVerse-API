"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = require("./routes/user.route");
const auth_route_1 = require("./routes/auth.route");
const meme_route_1 = require("./routes/meme.route");
if (process.env.NODE_ENV == undefined) {
    dotenv_1.default.config();
}
class Server {
    constructor() {
        this.handleError = (err, req, res, next) => {
            console.error(`statusCode: ${err.statusCode}`);
            console.error(`message: ${err.message}`);
            console.error(`stack: ${err.stack}`);
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            // render the error page
            if (err.statusCode && err.statusCode != 500) {
                res.status(err.statusCode).send(err.message);
            }
            else {
                res.status(500).send('Internal server error');
            }
        };
        this.app = express_1.default();
        this.config();
        this.routes();
        this.mongo();
    }
    routes() {
        this.app.use('/api/v1/users', new user_route_1.UserRoutes().router);
        this.app.use('/api/v1/auth', new auth_route_1.AuthRoutes().router);
        this.app.use('/api/v1/memes', new meme_route_1.MemeRoutes().router);
    }
    config() {
        /*this.app.use(
            fileUpload({
                name: "",
                data: {},
                mimetype: "",
                useTempFiles: true,
                tempFileDir: "/tmp/",
            })
        );*/
        this.app.set('port', process.env.PORT || 3010);
        this.app.use('/src/uploads', express_1.default.static('src/uploads'));
        this.app.use(express_1.default.json({ limit: '25mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(cors_1.default());
        this.app.use(helmet_1.default());
        this.app.use(function (req, res, next) {
            console.log(`${req.method} ${req.originalUrl}`);
            console.log(`params: `, req.params);
            console.log(`query: `, req.query);
            console.log(`body: `, req.body);
            next();
        });
        // error handler
        /*this.app.use( (err: Error, req: Request, res: Response, next: NextFunction) => {
            console.log('error: ', err);
            res.sendStatus(500);
            
            console.error(`statusCode: ${err.statusCode}`);
            console.error(`message: ${err.message}`);
            console.error(`stack: ${err.stack}`);
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
    
            // render the error page
            if (err.statusCode && err.statusCode != 500) {
                res.status(err.statusCode).send(err.message);
            } else {
                res.status(500).send('Internal server error');
            }
        });
        */
    }
    mongo() {
        mongoose_1.default.set('useFindAndModify', false);
        mongoose_1.default.connect(
        //process.env.DB_CONNECTION || '',
        'mongodb://localhost/meme', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {
            console.log('connected to meme database');
        });
    }
    start() {
        this.app.listen(this.app.get("port"), () => {
            console.log('API is running at http://localhost:%d', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
//# sourceMappingURL=server.js.map