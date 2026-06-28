const prisma = require("../db/postgress")

exports.createUnit = async(req, res)=>{
    try{
        const unit = await prisma.unit.create({
            data:{
                name: req.body.name,
                companyId: req.body.companyId
            }
        })

        return res.status(200).json({"message":"Unit created successfully", unit:unit})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getUnits = async(req, res)=>{
    try{
        const units = await prisma.unit.findMany({where:{companyId:req.query.companyId}})
        return res.status(200).json({"message":"Units fetched successfully", units:units})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.updateUnit = async(req, res)=>{
    try{
        const unitexist = await prisma.unit.findUnique({where:{id:req.params.id}})

        if(!unitexist){
            return res.status(400).json({"message":"Unit not found"})
        }

        const unit = await prisma.unit.update({
            where:{id:req.params.id},
            data:{name: req.body.name}
        })

        return res.status(200).json({"message":"Unit updated successfully", unit:unit})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.deleteUnit = async(req, res)=>{
    try{
        const unitexist = await prisma.unit.findUnique({where:{id:req.params.id}})

        if(!unitexist){
            return res.status(400).json({"message":"Unit not found"})
        }

        await prisma.unit.delete({where:{id:req.params.id}})

        return res.status(200).json({"message":"Unit deleted successfully"})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
