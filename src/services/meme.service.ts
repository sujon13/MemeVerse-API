import { Meme, IMeme } from '../models/meme.entity';

export class MemeService {
    constructor() {
    }

    public getMemeById = (id: string): Promise <IMeme | null> => {
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