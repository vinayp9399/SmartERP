const express = require("express")
const controller = require("../controllers/suppliercontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createSupplier)
router.get("/", authVerify, controller.getSuppliers)
router.get("/:id", authVerify, controller.getSupplierById)
router.put("/:id", authVerify, controller.updateSupplier)
router.delete("/:id", authVerify, controller.deleteSupplier)

module.exports = router
