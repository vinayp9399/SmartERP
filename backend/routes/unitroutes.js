const express = require("express")
const controller = require("../controllers/unitcontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createUnit)
router.get("/", authVerify, controller.getUnits)
router.put("/:id", authVerify, controller.updateUnit)
router.delete("/:id", authVerify, controller.deleteUnit)

module.exports = router
