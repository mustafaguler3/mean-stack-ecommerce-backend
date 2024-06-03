const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
const authJwt = require("./helpers/jwt")

require("dotenv/config")
const api = process.env.API_URL;
mongoose.connect(process.env.CONNECTION_STRING,{
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
app.use(authJwt())

const productsRouter = require("./routers/productRouter");
const categoryRouter = require("./routers/categoryRouter");
const userRouter = require("./routers/userRouter");

app.use(api+"/products",productsRouter)
app.use(api+"/categories",categoryRouter)
app.use(api+"/users",userRouter);



app.listen(process.env.PORT,() => {
    console.log(`server is running on port ${process.env.PORT}`)
})