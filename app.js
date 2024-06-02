const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const mongoose = require("mongoose")

require("dotenv/config")

const api = process.env.API_URL;

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})

const Product = mongoose.model("Product",productSchema);

mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName: "eshop"
})
.then(() => {
    console.log("Database is ready")
})
.catch((err) => console.log(err))

//middleware
// JSON istek gövdelerini ayrıştırmak için body-parser'ı kullanın
app.use(bodyParser.json())
// HTTP isteklerini loglamak için morgan'ı kullanın
app.use(morgan("tiny"))

app.get(api+"/products",(req,res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })
    product.save().then((createdProduct) => {
        res.status(201).json(createdProduct)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: true
        })
    })
})

app.get(api+"/products", async (req,res) => {
    const productList = await Product.find();
    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList)
})

app.listen(3000,() => {
    console.log("server is running on port 3000")
})