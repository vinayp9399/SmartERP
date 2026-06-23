const prisma = require("../db/postgress")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async(req, res)=>{
   const userexist = await prisma.user.findUnique({where:{email:req.body.email}})

   if(userexist){
     res.status(400).json({"message":"The user already exists"})   
   }

   const hashpassword = await bcrypt.hash(req.body.password,10)

   const userregister = await prisma.user.create({
    data: {name:req.body.name,
           email:req.body.email,
           password:hashpassword},
    });

    res.status(200).json({"message":"User registration succesfull", user:{name:req.body.name,
           email:req.body.email,
           password:req.body.password}}) 
} 

exports.login = async(req, res)=>{
    try{
       const userexist = await prisma.user.findUnique({where:{email:req.body.email}})

   if(!userexist){
     return res.status(400).json({"message":"The user does not exist"})   
   }

   const verifypassword = await bcrypt.compare(req.body.password, userexist.password)

   if(!verifypassword){
     return res.status(400).json({"message":"Wrong password"})   
   }

   const token = jwt.sign({
    id:userexist.id,
    email:userexist.email
   },
   process.env.jwtSecret,
   {expiresIn:"1d"}
   )

    return res.status(200).json({"message":"User Login succesfull", token:token}) 
    }
    catch(err){
       return res.status(200).json({"message":err}) 
    }
   
} 

