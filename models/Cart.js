const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        firstname:{
            type: String,
        },
        lastname:{
            type:String,
        },
        username:{
            type: String,
        },
        email:{
            type:String,
        },
        hub:{
            type:String,
        },
        products: [],
        amount:{
            type:Number,
        },
        address: {
            type: Object,
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("carts", cartSchema);