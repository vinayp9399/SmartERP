const express = require("express")
const controller = require("../controllers/companycontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

router.post("/", authVerify, controller.createCompany)
router.get("/", authVerify, controller.getCompanies)
router.get("/:id", authVerify, controller.getCompanyById)
router.put("/:id", authVerify, controller.updateCompany)
router.delete("/:id", authVerify, controller.deleteCompany)

module.exports = router
