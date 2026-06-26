const express = require("express")
const controller = require("../controllers/ledgercontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createLedger)
router.get("/", authVerify, controller.getLedgers)
router.get("/:id", authVerify, controller.getLedgerById)
router.put("/:id", authVerify, controller.updateLedger)
router.delete("/:id", authVerify, controller.deleteLedger)

module.exports = router
