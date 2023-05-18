const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customerName:{
            type:String,
        },
        user:{},
        email:{
            type:String,
        },
        hub:{
            type:String,
        },
        products: [],
        address: {
            type: Object,
        },
        status: {
            type: String,
            enum: ["active","canceled","completed"],
            default: "active",
        }, 
    }, { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);