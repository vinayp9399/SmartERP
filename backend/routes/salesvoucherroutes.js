const express = require("express")
const controller = require("../controllers/salesvouchercontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createSalesVoucher)
router.get("/", authVerify, controller.getSalesVouchers)
router.get("/:id", authVerify, controller.getSalesVoucherById)

module.exports = router
