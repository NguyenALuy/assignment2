const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        products: [
            {
                productID:{
                    type:String,
                },
                quantity:{
                    type:Number,
                    default: 1,
                }
            }
        ],
        
    }, { timestamps: true }
);

module.exports = mongoose.model("carts", cartSchema);