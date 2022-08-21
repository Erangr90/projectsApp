const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports = (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token,process.env.JWT_SECRET)
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({msg:"Auth Failed"})
        
    }
    
}