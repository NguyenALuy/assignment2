const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
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
        amount:{
            type:Number,
        },
        address: {
            type: Object,
        },
        status: {
            type: String,
            default: "active",
        }, 
    }, { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);