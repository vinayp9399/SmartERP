const express = require("express")
const controller = require("../controllers/stockgroupcontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createStockGroup)
router.get("/", authVerify, controller.getStockGroups)
router.put("/:id", authVerify, controller.updateStockGroup)
router.delete("/:id", authVerify, controller.deleteStockGroup)

module.exports = router
