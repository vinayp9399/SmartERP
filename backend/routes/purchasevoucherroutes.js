const express = require("express")
const controller = require("../controllers/purchasevouchercontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createPurchaseVoucher)
router.get("/", authVerify, controller.getPurchaseVouchers)
router.get("/:id", authVerify, controller.getPurchaseVoucherById)

module.exports = router
