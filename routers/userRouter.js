const express = require("express")
const router = express.Router();
const User = require("../models/user")


router.post("/",async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        password: req.body.password,
        phone: req.body.phone,
        isAdmin : req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })

    if(!await user.save()){
        return res.status(400).send("user not registered")
    }
    res.status(200).send(user)
})

module.exports = router