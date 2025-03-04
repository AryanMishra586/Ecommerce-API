/**
 * Middleware file here we verify token and check authorization
 */
const router = require("express").Router()
const jwt = require("jsonwebtoken")


/**
 * Verify the authenticity and validity of a token passed in the request header.
 */
const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
            if(err){
                res.status(403).json({"response": "403","message": "Token is not valid"});
            }
            req.user = user
            console.log(user)
            next()
        })
    }else{
        return res.status(401).json({"response": "401","message": "You are not authenticated"})
    }
}


/**
 * Verify if the user associated with the token is authorized to access the requested resource.
 */
const verifyTokenAndAuth = (req, res, next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id == req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json({"response": "403","message": "You are not allowed!"})
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuth}