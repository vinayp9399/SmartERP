require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req,res)=>{
   res.json({"message":"App started"})
})

app.listen(process.env.PORT, ()=>{
    console.log("App started at port " + process.env.PORT)
})