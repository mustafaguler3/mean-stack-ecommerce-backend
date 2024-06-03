const express = require("express")
const router = express.Router();
const User = require("../models/user")
const hash= require("bcryptjs")
const jwt = require("jsonwebtoken")

router.get("/",async (req,res) => {
    const userList = await User.find().select("name street")

    if(!userList){
        return res.status(500).json({success: false})
    }

    res.status(200).send(userList)
})

router.get("/:id",async (req,res) => {
    const user = await User.findById(req.params.id).select("-password");

    if(!user){
        return res.status(500).json("user not found")
    }
    res.send(user)
})

router.put("/:id",async (req,res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;

    if(req.body.password){
        newPassword = hash.hashSync(req.body.password,10)
    }else{
        newPassword = userExist.password;
    }

    let user = await User.findByIdAndUpdate(
        req.params.id,
        {
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        password: hash.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin : req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    },
    {new: true})

    if(!user){
        return res.send("user not updated")
    }

    res.send(user)
})

router.post("/register",async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        password: hash.hashSync(req.body.password,10),
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


router.post("/login",async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;

    if(!user){
        return res.status(400).send("user not found")
    }
    if(user && hash.compareSync(req.body.password, user.password)){
        
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        },
        secret
    )

        res.status(200).send({user: user.email,token: token})
    }else {
        res.status(400).send("password is wrong")
    }
})

router.get("/get/count",async (req,res) => {
    const userCount = await User.countDocuments((count) => count);

    if(!userCount){
        return res.status(500).json({success: false})
    }
    res.send({
        userCount: userCount
    })
})

module.exports = router