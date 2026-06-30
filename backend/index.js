require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use("/user", require("./routes/userroutes"))
app.use("/company", require("./routes/companyroutes"))
app.use("/ledger", require("./routes/ledgerroutes"))
app.use("/group", require("./routes/grouproutes"))
app.use("/unit", require("./routes/unitroutes"))
app.use("/stock-group", require("./routes/stockgrouproutes"))
app.use("/stock-item", require("./routes/stockitemroutes"))
app.use("/supplier", require("./routes/supplierroutes"))
app.use("/purchase-voucher", require("./routes/purchasevoucherroutes"))
app.use("/customer", require("./routes/customerroutes"))
app.use("/sales-voucher", require("./routes/salesvoucherroutes"))

app.get("/", (req,res)=>{
   res.json({"message":"App started"})
})

app.listen(process.env.PORT, ()=>{
    console.log("App started at port " + process.env.PORT)
})