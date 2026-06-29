const prisma = require("../db/postgress")

exports.createPurchaseVoucher = async(req, res)=>{
    try{
        const { supplierId, voucherNumber, date, companyId, items } = req.body

        let total = 0
        items.forEach(item=>{
            total += item.qty * item.rate
        })

        const result = await prisma.$transaction(async (tx)=>{
            const voucher = await tx.voucher.create({
                data:{
                    voucherType: "Purchase",
                    voucherNumber: voucherNumber,
                    date: new Date(date),
                    amount: total,
                    companyId: companyId,
                    supplierId: supplierId
                }
            })

            for(const item of items){
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
                    data:{quantity: {increment: item.qty}}
                })

                await tx.inventoryTransaction.create({
                    data:{
                        type: "Stock In",
                        quantity: item.qty,
                        date: new Date(date),
                        companyId: companyId,
                        voucherId: voucher.id
                    }
                })
            }

            await tx.supplier.update({
                where:{id:supplierId},
                data:{outstandingDues: {increment: total}}
            })

            return voucher
        })

        return res.status(200).json({"message":"Purchase voucher created successfully", voucher:result})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getPurchaseVouchers = async(req, res)=>{
    try{
        const vouchers = await prisma.voucher.findMany({
            where:{companyId:req.query.companyId, voucherType:"Purchase"},
            include:{supplier:true, voucherItems:{include:{stockItem:true}}},
            orderBy:{date:"desc"}
        })

        return res.status(200).json({"message":"Purchase vouchers fetched successfully", vouchers:vouchers})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getPurchaseVoucherById = async(req, res)=>{
    try{
        const voucher = await prisma.voucher.findUnique({
            where:{id:req.params.id},
            include:{supplier:true, voucherItems:{include:{stockItem:true}}}
        })

        if(!voucher){
            return res.status(400).json({"message":"Purchase voucher not found"})
        }

        return res.status(200).json({"message":"Purchase voucher fetched successfully", voucher:voucher})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
