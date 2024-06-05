const express = require("express")
const router = express.Router();
const Order = require("../models/order")
const OrderItem = require("../models/order-item");
const { populate } = require("dotenv");

router.get("/",async (req,res) => {
    const orderList = await Order.find()
    .populate("user","name").sort({"dateOrdered":-1});

    if(!orderList){
        res.status(500).json({success: false})
    }
    res.send(orderList)
})

router.get("/:id",async (req,res) => {
    const order = await Order.findById(req.params.id)
    .populate("user","name")
    .populate({
        path: "orderItems",populate:{
            path: "product",populate: "category"
        }
    })

    if(!order){
        res.status(500).json({success: false})
    }
    res.send(order)
})

router.put("/:id",async (req,res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.params.status
        },
        {new: true}
    )

    if(!order) {
        return res.status(400).send("category cannot be created")
    }
    res.send(order)
})



router.delete("/:id",(req,res) => {
    Order.findByIdAndRemove(req.params.id).then(order => {
        if(order){
            return res.status(200).json({success: true,message: "the order deleted"})
        }else {
            return res.status(404).json({success: false,message: "order not deleted"})
        }
    }).catch((err) => {
        return res.status(400).json({success: false,error: err})
    })
})
const orderItemsIds = req.body.orderItems.map(async orderItem => {
    let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product
    })

    newOrderItem = await newOrderItem.save();

    return newOrderItem._id;
})

const totalPrices = Promise.all(orderItemsIds.map(async (orderItemsId) => {
    const orderItem = await OrderItem.findById(orderItemsId).populate("product");
    const totalPrice = orderItem.product.price * orderItem.quantity;

    return totalPrice;
}))

const totalPrice = totalPrices.reduce((a,b) => a + b,0);


router.post("/",async (req,res) => {
    let order = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user
    });

    order = await order.save()

    if(!order){
        return res.status(400).send("order cannot be created")
    }
    res.send(order)
})

router.get("/get/totalSales", async (req,res) => {
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalSales: {$sum : '$totalPrice'}}}
    ]);

    if (!totalPrice) {
        return res.status(400).send("The order sales cannot be generated")
    }
    res.send({totalSales: totalSales.pop().totalSales})
})

router.get("/get/count",async (req,res) => {
    const orderCount = await Order.countDocument((count) => count)

    if(!orderCount){
        res.status(500).json({success: false})
    }
    res.send({
        orderCount: orderCount
    })
})

router.get("/get/userorders/:userId",async (req,res) => {
    const userOderList = await Order.find({user: req.params.userid}).populate({
        path: "orderItems",populate: {
            path: "product",populate: "category"
        }.sort({"dateOrdered":-1})
    })

    if(!userOderList) {
        res.status(500).json({success: false})
    }
    res.send(userOderList)
})

module.exports = router;