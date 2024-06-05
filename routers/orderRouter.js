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

router.post("/",async (req,res) => {

    const orderItemsIds = req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    })


    let order = new Order({
        orderItems: orderItemsIds,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user
    });

    order = await order.save()

    if(!order){
        return res.status(400).send("order cannot be created")
    }
    res.send(order)
})



module.exports = router;