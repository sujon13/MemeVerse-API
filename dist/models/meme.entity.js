"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meme = exports.MemeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.MemeSchema = new mongoose_1.Schema({
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    numOfLikes: {
        type: Number,
        default: 0,
    },
    numOfComments: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            content: String,
            time: Date,
            userId: mongoose_1.Schema.Types.ObjectId,
        }
    ],
    sharedAt: Date,
});
exports.Meme = mongoose_1.model("memes", exports.MemeSchema);
//# sourceMappingURL=meme.entity.js.map