const prisma = require("../db/postgress")

exports.createStockGroup = async(req, res)=>{
    try{
        const stockGroup = await prisma.stockGroup.create({
            data:{
                name: req.body.name,
                companyId: req.body.companyId
            }
        })

        return res.status(200).json({"message":"Stock group created successfully", stockGroup:stockGroup})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getStockGroups = async(req, res)=>{
    try{
        const stockGroups = await prisma.stockGroup.findMany({where:{companyId:req.query.companyId}})
        return res.status(200).json({"message":"Stock groups fetched successfully", stockGroups:stockGroups})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.updateStockGroup = async(req, res)=>{
    try{
        const exist = await prisma.stockGroup.findUnique({where:{id:req.params.id}})

        if(!exist){
            return res.status(400).json({"message":"Stock group not found"})
        }

        const stockGroup = await prisma.stockGroup.update({
            where:{id:req.params.id},
            data:{name: req.body.name}
        })

        return res.status(200).json({"message":"Stock group updated successfully", stockGroup:stockGroup})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.deleteStockGroup = async(req, res)=>{
    try{
        const exist = await prisma.stockGroup.findUnique({where:{id:req.params.id}})

        if(!exist){
            return res.status(400).json({"message":"Stock group not found"})
        }

        await prisma.stockGroup.delete({where:{id:req.params.id}})

        return res.status(200).json({"message":"Stock group deleted successfully"})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
