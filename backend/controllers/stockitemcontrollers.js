const prisma = require("../db/postgress")

exports.createStockItem = async(req, res)=>{
    try{
        const stockItem = await prisma.stockItem.create({
            data:{
                name: req.body.name,
                sku: req.body.sku,
                purchasePrice: req.body.purchasePrice,
                sellingPrice: req.body.sellingPrice,
                quantity: req.body.quantity,
                gstPercentage: req.body.gstPercentage,
                companyId: req.body.companyId,
                stockGroupId: req.body.stockGroupId || null,
                unitId: req.body.unitId || null
            }
        })

        return res.status(200).json({"message":"Stock item created successfully", stockItem:stockItem})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getStockItems = async(req, res)=>{
    try{
        const where = { companyId: req.query.companyId }

        if(req.query.search){
            where.name = { contains: req.query.search, mode: "insensitive" }
        }

        const stockItems = await prisma.stockItem.findMany({where})

        return res.status(200).json({"message":"Stock items fetched successfully", stockItems:stockItems})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getStockItemById = async(req, res)=>{
    try{
        const stockItem = await prisma.stockItem.findUnique({where:{id:req.params.id}})

        if(!stockItem){
            return res.status(400).json({"message":"Stock item not found"})
        }

        return res.status(200).json({"message":"Stock item fetched successfully", stockItem:stockItem})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.updateStockItem = async(req, res)=>{
    try{
        const exist = await prisma.stockItem.findUnique({where:{id:req.params.id}})

        if(!exist){
            return res.status(400).json({"message":"Stock item not found"})
        }

        const stockItem = await prisma.stockItem.update({
            where:{id:req.params.id},
            data:{
                name: req.body.name,
                sku: req.body.sku,
                purchasePrice: req.body.purchasePrice,
                sellingPrice: req.body.sellingPrice,
                quantity: req.body.quantity,
                gstPercentage: req.body.gstPercentage,
                stockGroupId: req.body.stockGroupId || null,
                unitId: req.body.unitId || null
            }
        })

        return res.status(200).json({"message":"Stock item updated successfully", stockItem:stockItem})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.deleteStockItem = async(req, res)=>{
    try{
        const exist = await prisma.stockItem.findUnique({where:{id:req.params.id}})

        if(!exist){
            return res.status(400).json({"message":"Stock item not found"})
        }

        await prisma.stockItem.delete({where:{id:req.params.id}})

        return res.status(200).json({"message":"Stock item deleted successfully"})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
