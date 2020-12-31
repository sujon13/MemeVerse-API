"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    profilePicUrl: {
        type: String
    }
});
exports.User = mongoose_1.model("accounts", exports.UserSchema);
//# sourceMappingURL=user.entity.js.map