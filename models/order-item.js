const mongoose = require("mongoose")

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
})

const OrderItem = mongoose.model("Order",orderItemSchema);

module.exports = OrderItem;