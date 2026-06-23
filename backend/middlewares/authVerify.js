const jwt = require("jsonwebtoken")


const authVerify = async(req, res, next)=>{
    const token = req.headers["auth"]

    if(!token){
        res.status(400).json({"message":"token not provided"})
    }

    const tokenVerify = jwt.verify(token, process.env.jwtSecret)

    if(!tokenVerify){
        res.status(400).json({"message":"token verification failed"})
    }

    req.user = tokenVerify
    next()
}

module.exports = authVerify