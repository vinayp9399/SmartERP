const prisma = require("../db/postgress")

exports.createSupplier = async(req, res)=>{
    try{
        const supplier = await prisma.supplier.create({
            data:{
                name: req.body.name,
                companyId: req.body.companyId
            }
        })

        return res.status(200).json({"message":"Supplier created successfully", supplier:supplier})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getSuppliers = async(req, res)=>{
    try{
        const where = { companyId: req.query.companyId }

        if(req.query.search){
            where.name = { contains: req.query.search, mode: "insensitive" }
        }

        const suppliers = await prisma.supplier.findMany({where})
        return res.status(200).json({"message":"Suppliers fetched successfully", suppliers:suppliers})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getSupplierById = async(req, res)=>{
    try{
        const supplier = await prisma.supplier.findUnique({where:{id:req.params.id}})

        if(!supplier){
            return res.status(400).json({"message":"Supplier not found"})
        }

        return res.status(200).json({"message":"Supplier fetched successfully", supplier:supplier})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.updateSupplier = async(req, res)=>{
    try{
        const exist = await prisma.supplier.findUnique({where:{id:req.params.id}})

        if(!exist){
            return res.status(400).json({"message":"Supplier not found"})
        }

        const supplier = await prisma.supplier.update({
            where:{id:req.params.id},
            data:{name: req.body.name}
        })

        return res.status(200).json({"message":"Supplier updated successfully", supplier:supplier})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.deleteSupplier = async(req, res)=>{
    try{
        const exist = await prisma.supplier.findUnique({where:{id:req.params.id}})

        if(!exist){
            return res.status(400).json({"message":"Supplier not found"})
        }

        await prisma.supplier.delete({where:{id:req.params.id}})

        return res.status(200).json({"message":"Supplier deleted successfully"})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
