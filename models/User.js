const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        realname: {
            type: String,
        },
        address: {
            type: String,
        },
        hub: {
            type: String,
        },
        role: {
            type: String,
            required: true,
        },
        profile: {
            type: String,
        }
    }, { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);