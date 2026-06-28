const express = require("express")
const controller = require("../controllers/stockitemcontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createStockItem)
router.get("/", authVerify, controller.getStockItems)
router.get("/:id", authVerify, controller.getStockItemById)
router.put("/:id", authVerify, controller.updateStockItem)
router.delete("/:id", authVerify, controller.deleteStockItem)

module.exports = router
