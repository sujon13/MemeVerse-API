"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = exports.LikeSchema = void 0;
const mongoose_1 = require("mongoose");
exports.LikeSchema = new mongoose_1.Schema({
    userId: String,
    memeId: String,
    alreadyLiked: {
        type: Boolean,
        default: false
    }
});
exports.Like = mongoose_1.model("likes", exports.LikeSchema);
//# sourceMappingURL=like.entity.js.map