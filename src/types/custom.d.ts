import { IPayload } from '../controllers/user.controller';

declare global {
    namespace Express {
        interface Request {
            payload: IPayload,
            email: string | undefined,
            page: number,
            limit: number
        }
    }
  }