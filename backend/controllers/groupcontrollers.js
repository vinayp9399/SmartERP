const prisma = require("../db/postgress")

exports.createGroup = async(req, res)=>{
    try{
        const group = await prisma.group.create({
            data:{
                name: req.body.name,
                companyId: req.body.companyId
            }
        })

        return res.status(200).json({"message":"Group created successfully", group:group})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getGroups = async(req, res)=>{
    try{
        const where = { companyId: req.query.companyId }

        if(req.query.search){
            where.name = { contains: req.query.search, mode: "insensitive" }
        }

        const groups = await prisma.group.findMany({where})
        return res.status(200).json({"message":"Groups fetched successfully", groups:groups})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getGroupById = async(req, res)=>{
    try{
        const group = await prisma.group.findUnique({where:{id:req.params.id}})

        if(!group){
            return res.status(400).json({"message":"Group not found"})
        }

        return res.status(200).json({"message":"Group fetched successfully", group:group})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.updateGroup = async(req, res)=>{
    try{
        const groupexist = await prisma.group.findUnique({where:{id:req.params.id}})

        if(!groupexist){
            return res.status(400).json({"message":"Group not found"})
        }

        const group = await prisma.group.update({
            where:{id:req.params.id},
            data:{
                name: req.body.name
            }
        })

        return res.status(200).json({"message":"Group updated successfully", group:group})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.deleteGroup = async(req, res)=>{
    try{
        const groupexist = await prisma.group.findUnique({where:{id:req.params.id}})

        if(!groupexist){
            return res.status(400).json({"message":"Group not found"})
        }

        await prisma.group.delete({where:{id:req.params.id}})

        return res.status(200).json({"message":"Group deleted successfully"})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
