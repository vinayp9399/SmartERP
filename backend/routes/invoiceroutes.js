const express = require("express")
const controller = require("../controllers/invoicecontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createManualInvoice)
router.get("/", authVerify, controller.getInvoices)
router.get("/:id", authVerify, controller.getInvoiceById)
router.get("/:id/pdf", authVerify, controller.downloadInvoicePDF)

module.exports = router
