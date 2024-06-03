const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    street: {
        type:String,
        required: true
    },
    apartment: {
        type:String,
        required: true
    },
    city: {
        type:String,
        required: true
    },
    zip: {
        type: String,
        default: ""
    },
    country: {
        type:String,
        default: ""
    },
    isAdmin: {
        type:Boolean,
        default: ""
    }
})

const User = mongoose.model("Users",userSchema);

module.exports = User