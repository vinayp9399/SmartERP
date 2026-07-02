const prisma = require("../db/postgress")

// ─── Inventory Reports ────────────────────────────────────────────────────────

exports.getStockSummary = async(req, res)=>{
    try{
        const items = await prisma.stockItem.findMany({
            where:{ companyId: req.query.companyId },
            include:{ stockGroup: true, unit: true }
        })

        const summary = items.map(item=>({
            id: item.id,
            name: item.name,
            sku: item.sku,
            stockGroup: item.stockGroup?.name || "—",
            unit: item.unit?.name || "—",
            quantity: Number(item.quantity),
            purchasePrice: Number(item.purchasePrice),
            sellingPrice: Number(item.sellingPrice),
            gstPercentage: Number(item.gstPercentage),
            valuation: Number(item.quantity) * Number(item.purchasePrice)
        }))

        return res.status(200).json({ message:"Stock summary fetched", summary })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

exports.getLowStockReport = async(req, res)=>{
    try{
        const threshold = Number(req.query.threshold) || 10

        const items = await prisma.stockItem.findMany({
            where:{
                companyId: req.query.companyId,
                quantity: { lte: threshold }
            },
            include:{ unit: true }
        })

        return res.status(200).json({ message:"Low stock report fetched", items, threshold })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

exports.getItemMovementReport = async(req, res)=>{
    try{
        const transactions = await prisma.inventoryTransaction.findMany({
            where:{ companyId: req.query.companyId },
            include:{
                voucher:{
                    include:{ voucherItems:{ include:{ stockItem: true } } }
                }
            },
            orderBy:{ date: "desc" }
        })

        return res.status(200).json({ message:"Item movement report fetched", transactions })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// ─── Sales Reports ────────────────────────────────────────────────────────────

exports.getDailySales = async(req, res)=>{
    try{
        const vouchers = await prisma.voucher.findMany({
            where:{ companyId: req.query.companyId, voucherType: "Sales" },
            include:{ customer: true, voucherItems: true },
            orderBy:{ date: "desc" }
        })

        const grouped = {}
        vouchers.forEach(v=>{
            const day = new Date(v.date).toLocaleDateString("en-IN")
            if(!grouped[day]){
                grouped[day] = { date: day, total: 0, count: 0 }
            }
            grouped[day].total += Number(v.amount)
            grouped[day].count += 1
        })

        return res.status(200).json({ message:"Daily sales fetched", daily: Object.values(grouped) })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

exports.getMonthlySales = async(req, res)=>{
    try{
        const vouchers = await prisma.voucher.findMany({
            where:{ companyId: req.query.companyId, voucherType: "Sales" },
            orderBy:{ date: "desc" }
        })

        const grouped = {}
        vouchers.forEach(v=>{
            const d = new Date(v.date)
            const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`
            const label = d.toLocaleString("en-IN", { month: "long", year: "numeric" })
            if(!grouped[key]){
                grouped[key] = { month: label, total: 0, count: 0 }
            }
            grouped[key].total += Number(v.amount)
            grouped[key].count += 1
        })

        return res.status(200).json({ message:"Monthly sales fetched", monthly: Object.values(grouped) })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

exports.getTopCustomers = async(req, res)=>{
    try{
        const customers = await prisma.customer.findMany({
            where:{ companyId: req.query.companyId },
            orderBy:{ outstandingBalance: "desc" }
        })

        return res.status(200).json({ message:"Top customers fetched", customers })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// ─── Purchase Reports ─────────────────────────────────────────────────────────

exports.getPurchaseRegister = async(req, res)=>{
    try{
        const vouchers = await prisma.voucher.findMany({
            where:{ companyId: req.query.companyId, voucherType: "Purchase" },
            include:{ supplier: true, voucherItems:{ include:{ stockItem: true } } },
            orderBy:{ date: "desc" }
        })

        return res.status(200).json({ message:"Purchase register fetched", vouchers })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

exports.getSupplierSummary = async(req, res)=>{
    try{
        const suppliers = await prisma.supplier.findMany({
            where:{ companyId: req.query.companyId },
            orderBy:{ outstandingDues: "desc" }
        })

        return res.status(200).json({ message:"Supplier summary fetched", suppliers })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// ─── GST Reports ──────────────────────────────────────────────────────────────

exports.getGSTReport = async(req, res)=>{
    try{
        const vouchers = await prisma.voucher.findMany({
            where:{ companyId: req.query.companyId, voucherType: "Sales" },
            include:{
                customer: true,
                voucherItems:{ include:{ stockItem: true } }
            },
            orderBy:{ date: "desc" }
        })

        const gstRegister = vouchers.map(v=>{
            let taxableAmount = 0
            let cgst = 0
            let sgst = 0
            let igst = 0

            v.voucherItems.forEach(vi=>{
                const amount = Number(vi.qty) * Number(vi.rate)
                const gstRate = Number(vi.stockItem?.gstPercentage || 0)
                const taxable = amount / (1 + gstRate/100)
                const tax = amount - taxable
                taxableAmount += taxable
                // Same state = CGST + SGST; simplified assumption here
                cgst += tax / 2
                sgst += tax / 2
            })

            return {
                voucherNumber: v.voucherNumber,
                date: new Date(v.date).toLocaleDateString("en-IN"),
                customer: v.customer?.name,
                taxableAmount: taxableAmount.toFixed(2),
                cgst: cgst.toFixed(2),
                sgst: sgst.toFixed(2),
                igst: igst.toFixed(2),
                total: Number(v.amount).toFixed(2)
            }
        })

        const taxSummary = {
            totalTaxable: gstRegister.reduce((s,r)=>s+Number(r.taxableAmount),0).toFixed(2),
            totalCGST: gstRegister.reduce((s,r)=>s+Number(r.cgst),0).toFixed(2),
            totalSGST: gstRegister.reduce((s,r)=>s+Number(r.sgst),0).toFixed(2),
            totalIGST: "0.00",
            grandTotal: gstRegister.reduce((s,r)=>s+Number(r.total),0).toFixed(2)
        }

        return res.status(200).json({ message:"GST report fetched", gstRegister, taxSummary })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// ─── Financial Reports ────────────────────────────────────────────────────────

exports.getProfitAndLoss = async(req, res)=>{
    try{
        const salesVouchers = await prisma.voucher.findMany({
            where:{ companyId: req.query.companyId, voucherType: "Sales" }
        })

        const purchaseVouchers = await prisma.voucher.findMany({
            where:{ companyId: req.query.companyId, voucherType: "Purchase" }
        })

        const totalRevenue = salesVouchers.reduce((s,v)=>s+Number(v.amount),0)
        const totalCost = purchaseVouchers.reduce((s,v)=>s+Number(v.amount),0)
        const grossProfit = totalRevenue - totalCost

        return res.status(200).json({
            message:"P&L fetched",
            revenue: totalRevenue.toFixed(2),
            costOfGoods: totalCost.toFixed(2),
            grossProfit: grossProfit.toFixed(2)
        })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

exports.getBalanceSheet = async(req, res)=>{
    try{
        const customers = await prisma.customer.findMany({
            where:{ companyId: req.query.companyId }
        })

        const suppliers = await prisma.supplier.findMany({
            where:{ companyId: req.query.companyId }
        })

        const stockItems = await prisma.stockItem.findMany({
            where:{ companyId: req.query.companyId }
        })

        const totalReceivables = customers.reduce((s,c)=>s+Number(c.outstandingBalance),0)
        const totalPayables = suppliers.reduce((s,s2)=>s+Number(s2.outstandingDues),0)
        const stockValuation = stockItems.reduce((s,i)=>s+Number(i.quantity)*Number(i.purchasePrice),0)

        const assets = {
            accountsReceivable: totalReceivables.toFixed(2),
            stockValuation: stockValuation.toFixed(2),
            totalAssets: (totalReceivables + stockValuation).toFixed(2)
        }

        const liabilities = {
            accountsPayable: totalPayables.toFixed(2),
            totalLiabilities: totalPayables.toFixed(2)
        }

        const equity = (
            totalReceivables + stockValuation - totalPayables
        ).toFixed(2)

        return res.status(200).json({ message:"Balance sheet fetched", assets, liabilities, equity })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

exports.getTrialBalance = async(req, res)=>{
    try{
        const salesTotal = await prisma.voucher.aggregate({
            where:{ companyId: req.query.companyId, voucherType:"Sales" },
            _sum:{ amount: true }
        })

        const purchaseTotal = await prisma.voucher.aggregate({
            where:{ companyId: req.query.companyId, voucherType:"Purchase" },
            _sum:{ amount: true }
        })

        const customers = await prisma.customer.findMany({
            where:{ companyId: req.query.companyId }
        })

        const suppliers = await prisma.supplier.findMany({
            where:{ companyId: req.query.companyId }
        })

        const entries = [
            {
                account: "Sales Revenue",
                debit: "0.00",
                credit: Number(salesTotal._sum.amount||0).toFixed(2)
            },
            {
                account: "Purchase / Cost of Goods",
                debit: Number(purchaseTotal._sum.amount||0).toFixed(2),
                credit: "0.00"
            },
            ...customers.map(c=>({
                account: `Customer: ${c.name}`,
                debit: Number(c.outstandingBalance).toFixed(2),
                credit: "0.00"
            })),
            ...suppliers.map(s=>({
                account: `Supplier: ${s.name}`,
                debit: "0.00",
                credit: Number(s.outstandingDues).toFixed(2)
            }))
        ]

        const totalDebit = entries.reduce((s,e)=>s+Number(e.debit),0).toFixed(2)
        const totalCredit = entries.reduce((s,e)=>s+Number(e.credit),0).toFixed(2)

        return res.status(200).json({ message:"Trial balance fetched", entries, totalDebit, totalCredit })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}
