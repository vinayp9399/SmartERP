const prisma = require("../db/postgress")
const PDFDocument = require("pdfkit")

exports.getInvoices = async(req, res)=>{
    try{
        const where = { companyId: req.query.companyId }

        if(req.query.invoiceType){
            where.invoiceType = req.query.invoiceType
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include:{
                customer: true,
                voucher:{
                    include:{ voucherItems:{ include:{ stockItem: true } } }
                }
            },
            orderBy:{ date: "desc" }
        })

        return res.status(200).json({"message":"Invoices fetched successfully", invoices:invoices})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getInvoiceById = async(req, res)=>{
    try{
        const invoice = await prisma.invoice.findUnique({
            where:{ id: req.params.id },
            include:{
                customer: true,
                company: true,
                voucher:{
                    include:{ voucherItems:{ include:{ stockItem: true } } }
                }
            }
        })

        if(!invoice){
            return res.status(400).json({"message":"Invoice not found"})
        }

        return res.status(200).json({"message":"Invoice fetched successfully", invoice:invoice})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.createManualInvoice = async(req, res)=>{
    try{
        const { customerId, invoiceType, date, companyId } = req.body

        const count = await prisma.invoice.count({ where:{ companyId } })
        const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`

        const invoice = await prisma.invoice.create({
            data:{
                invoiceNumber,
                invoiceType,
                date: new Date(date),
                companyId,
                customerId
            }
        })

        return res.status(200).json({"message":"Invoice created successfully", invoice:invoice})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.downloadInvoicePDF = async(req, res)=>{
    try{
        const invoice = await prisma.invoice.findUnique({
            where:{ id: req.params.id },
            include:{
                customer: true,
                company: true,
                voucher:{
                    include:{ voucherItems:{ include:{ stockItem: true } } }
                }
            }
        })

        if(!invoice){
            return res.status(400).json({"message":"Invoice not found"})
        }

        const doc = new PDFDocument({ margin: 50 })

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`)

        doc.pipe(res)

        // Header
        doc.fontSize(20).text("SmartERP", { align: "center" })
        doc.fontSize(10).text(invoice.company.name, { align: "center" })
        if(invoice.company.address){
            doc.text(invoice.company.address, { align: "center" })
        }
        if(invoice.company.gstNumber){
            doc.text(`GSTIN: ${invoice.company.gstNumber}`, { align: "center" })
        }
        if(invoice.company.contactInfo){
            doc.text(invoice.company.contactInfo, { align: "center" })
        }

        doc.moveDown()
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
        doc.moveDown(0.5)

        // Invoice info
        doc.fontSize(14).text(invoice.invoiceType, { align: "center" })
        doc.moveDown(0.5)

        doc.fontSize(10)
        doc.text(`Invoice No: ${invoice.invoiceNumber}`, 50)
        doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`)
        doc.moveDown(0.5)

        // Customer info
        doc.text(`Bill To:`, { underline: true })
        doc.text(invoice.customer.name)
        if(invoice.customer.mobileNumber){
            doc.text(`Mobile: ${invoice.customer.mobileNumber}`)
        }
        if(invoice.customer.address){
            doc.text(invoice.customer.address)
        }

        doc.moveDown()
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
        doc.moveDown(0.5)

        // Items table header
        const tableTop = doc.y
        doc.font("Helvetica-Bold")
        doc.text("Item", 50, tableTop)
        doc.text("SKU", 200, tableTop)
        doc.text("Qty", 300, tableTop)
        doc.text("Rate", 370, tableTop)
        doc.text("Amount", 450, tableTop)
        doc.font("Helvetica")

        doc.moveDown(0.5)
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
        doc.moveDown(0.5)

        let total = 0

        if(invoice.voucher && invoice.voucher.voucherItems){
            invoice.voucher.voucherItems.forEach(vi => {
                const y = doc.y
                const amount = Number(vi.qty) * Number(vi.rate)
                total += amount

                doc.text(vi.stockItem?.name || "", 50, y)
                doc.text(vi.stockItem?.sku || "", 200, y)
                doc.text(String(vi.qty), 300, y)
                doc.text(`Rs.${Number(vi.rate).toFixed(2)}`, 370, y)
                doc.text(`Rs.${amount.toFixed(2)}`, 450, y)
                doc.moveDown(0.5)
            })
        }

        doc.moveDown(0.5)
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
        doc.moveDown(0.5)

        // Total
        doc.font("Helvetica-Bold")
        doc.text(`Total: Rs.${total.toFixed(2)}`, { align: "right" })
        doc.font("Helvetica")

        doc.moveDown(2)
        doc.fontSize(9).text("Thank you for your business.", { align: "center" })

        doc.end()
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
