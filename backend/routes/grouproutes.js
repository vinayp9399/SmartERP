const express = require("express")
const controller = require("../controllers/groupcontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createGroup)
router.get("/", authVerify, controller.getGroups)
router.get("/:id", authVerify, controller.getGroupById)
router.put("/:id", authVerify, controller.updateGroup)
router.delete("/:id", authVerify, controller.deleteGroup)

module.exports = router
