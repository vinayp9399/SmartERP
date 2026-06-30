const prisma = require("../db/postgress")

exports.createSalesVoucher = async(req, res)=>{
    try{
        const { customerId, voucherNumber, date, companyId, items } = req.body

        let total = 0
        items.forEach(item=>{
            total += item.qty * item.rate
        })

        const result = await prisma.$transaction(async (tx)=>{
            const voucher = await tx.voucher.create({
                data:{
                    voucherType: "Sales",
                    voucherNumber: voucherNumber,
                    date: new Date(date),
                    amount: total,
                    companyId: companyId,
                    customerId: customerId
                }
            })

            for(const item of items){
                const stockItem = await tx.stockItem.findUnique({where:{id:item.stockItemId}})

                if(!stockItem || Number(stockItem.quantity) < Number(item.qty)){
                    throw new Error(`Insufficient stock for item: ${stockItem ? stockItem.name : item.stockItemId}`)
                }

                await tx.voucherItem.create({
                    data:{
                        voucherId: voucher.id,
                        stockItemId: item.stockItemId,
                        qty: item.qty,
                        rate: item.rate,
                        amount: item.qty * item.rate
                    }
                })

                await tx.stockItem.update({
                    where:{id:item.stockItemId},
                    data:{quantity: {decrement: item.qty}}
                })

                await tx.inventoryTransaction.create({
                    data:{
                        type: "Stock Out",
                        quantity: item.qty,
                        date: new Date(date),
                        companyId: companyId,
                        voucherId: voucher.id
                    }
                })
            }

            await tx.customer.update({
                where:{id:customerId},
                data:{outstandingBalance: {increment: total}}
            })

            const invoice = await tx.invoice.create({
                data:{
                    invoiceNumber: voucherNumber,
                    invoiceType: "GST Invoice",
                    date: new Date(date),
                    companyId: companyId,
                    customerId: customerId,
                    voucherId: voucher.id
                }
            })

            return { voucher, invoice }
        })

        return res.status(200).json({"message":"Sales voucher created successfully", voucher:result.voucher, invoice:result.invoice})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getSalesVouchers = async(req, res)=>{
    try{
        const vouchers = await prisma.voucher.findMany({
            where:{companyId:req.query.companyId, voucherType:"Sales"},
            include:{customer:true, voucherItems:{include:{stockItem:true}}, invoice:true},
            orderBy:{date:"desc"}
        })

        return res.status(200).json({"message":"Sales vouchers fetched successfully", vouchers:vouchers})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getSalesVoucherById = async(req, res)=>{
    try{
        const voucher = await prisma.voucher.findUnique({
            where:{id:req.params.id},
            include:{customer:true, voucherItems:{include:{stockItem:true}}, invoice:true}
        })

        if(!voucher){
            return res.status(400).json({"message":"Sales voucher not found"})
        }

        return res.status(200).json({"message":"Sales voucher fetched successfully", voucher:voucher})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
