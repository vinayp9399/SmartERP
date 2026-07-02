const express = require("express")
const controller = require("../controllers/reportcontrollers")
const authVerify = require("../middlewares/authVerify")
const router = express.Router()

// Inventory Reports
router.get("/stock-summary", authVerify, controller.getStockSummary)
router.get("/low-stock", authVerify, controller.getLowStockReport)
router.get("/item-movement", authVerify, controller.getItemMovementReport)

// Sales Reports
router.get("/daily-sales", authVerify, controller.getDailySales)
router.get("/monthly-sales", authVerify, controller.getMonthlySales)
router.get("/top-customers", authVerify, controller.getTopCustomers)

// Purchase Reports
router.get("/purchase-register", authVerify, controller.getPurchaseRegister)
router.get("/supplier-summary", authVerify, controller.getSupplierSummary)

// GST Reports
router.get("/gst-report", authVerify, controller.getGSTReport)

// Financial Reports
router.get("/profit-loss", authVerify, controller.getProfitAndLoss)
router.get("/balance-sheet", authVerify, controller.getBalanceSheet)
router.get("/trial-balance", authVerify, controller.getTrialBalance)

module.exports = router
