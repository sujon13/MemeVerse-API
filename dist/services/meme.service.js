"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemeService = void 0;
const meme_entity_1 = require("../models/meme.entity");
class MemeService {
    constructor() {
        this.getMemeById = (id) => {
            console.log(`${this.constructor.name}-> getMemeId()->id: ${id}`);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const meme = yield meme_entity_1.Meme.findById(id);
                    console.log(`${this.constructor.name}-> getMemeId()->meme: `, meme);
                    resolve(meme);
                }
                catch (error) {
                    console.log(`${this.constructor.name}->getMemeId()->error: `, error);
                    resolve(null);
                }
            }));
        };
    }
}
exports.MemeService = MemeService;
//# sourceMappingURL=meme.service.js.map