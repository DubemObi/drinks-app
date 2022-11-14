const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    owner : {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required: [true, "Please enter your ID to upload a product"],
    },
    name : {
        type : String,
        required : [true, "Please enter the product name"],
    },
    category : {
        type : String,
        required : [true, "Please enter the product description"]
    },
    price : {
        type : Number,
        required : [true, "Please enter the amount of the product"]
    },
    productImage : {
        type : String,
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;