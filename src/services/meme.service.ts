import { Meme, IMeme } from '../models/meme.entity';
import { Document, Schema, Model, model, Error } from 'mongoose';

export interface IAuthService {
    //getOrderByOrderId(orderId: string): Promise <IOrder | null>
    //updateOrder(orderId: string, update: any): Promise<IOrder | null>
}

export class MemeService {
    constructor() {
    }

    public getMemeId = (id: string): Promise <IMeme | null> => {
        console.log(`${this.constructor.name}-> getMemeId()->id: ${id}`);

        return new Promise(async (resolve, reject) => {
            try {
                const meme = await Meme.findById(id);
                console.log(`${this.constructor.name}-> getMemeId()->meme: `, meme);
                resolve(meme);
            } catch (error) {
                console.log(`${this.constructor.name}->getMemeId()->error: `, error);
                resolve(null);
            }
        });
    }
}