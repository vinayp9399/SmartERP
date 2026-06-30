const express = require("express")
const controller = require("../controllers/customercontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createCustomer)
router.get("/", authVerify, controller.getCustomers)
router.get("/:id", authVerify, controller.getCustomerById)
router.put("/:id", authVerify, controller.updateCustomer)
router.delete("/:id", authVerify, controller.deleteCustomer)

module.exports = router
