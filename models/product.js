const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})

const Product = mongoose.model("Product",productSchema);


export default Product;
