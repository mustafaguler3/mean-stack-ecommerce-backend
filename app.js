const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv/config")
const api = process.env.API_URL;
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName: "eshop"
})
.then(() => {
    console.log("Database is ready")
})
.catch((err) => console.log(err))

app.use(cors())
app.options("*",cors())

//middleware
// JSON istek gövdelerini ayrıştırmak için body-parser'ı kullanın
app.use(bodyParser.json())
// HTTP isteklerini loglamak için morgan'ı kullanın
app.use(morgan("tiny"))


const productsRouter = require("./routers/productRouter");

app.use(api+"/products",productsRouter)





app.listen(3000,() => {
    console.log("server is running on port 3000")
})