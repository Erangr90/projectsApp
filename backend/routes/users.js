const express = require("express");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require("../models/user");
require('dotenv').config()


router.post("/signup",(req,res)=>{
    bcrypt.hash(req.body.password, 10).then(hash=>{
        const newUser = new User({
            email:req.body.email,
            password:hash
        })
        newUser.save().then(result=>{
            res.status(201).json({msg: "New User Create",result:result})
        }).catch(error=>{
            console.log(error)
            res.status(500).json(error.message)
        })
    })
})

router.post("/login", (req,res)=>{
    let fetchedUser;
    User.findOne({email:req.body.email}).then(user=>{
        if(!user){
            res.status(401).json({
                msg:"Auth failed"
            })
        }
        fetchedUser = user
        bcrypt.compare(req.body.password, user.password).then(result=>{
            if(!result){
                res.status(401).json({
                    msg:"Auth failed"
                })
            }
            const token = jwt.sign({email:fetchedUser.email, userId:fetchedUser._id},process.env.JWT_SECRET,{expiresIn:'1h'})
            res.status(200).json({token:token, expiresIn: 3600})
        }).catch(error=>{
            res.status(401).json({
                msg:"Auth failed"
            })
        })
    })
})

module.exports = router;
