const prisma = require("../db/postgress")

exports.createCustomer = async(req, res)=>{
    try{
        const customer = await prisma.customer.create({
            data:{
                name: req.body.name,
                mobileNumber: req.body.mobileNumber,
                address: req.body.address,
                companyId: req.body.companyId
            }
        })

        return res.status(200).json({"message":"Customer created successfully", customer:customer})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getCustomers = async(req, res)=>{
    try{
        const where = { companyId: req.query.companyId }

        if(req.query.search){
            where.name = { contains: req.query.search, mode: "insensitive" }
        }

        const customers = await prisma.customer.findMany({where})
        return res.status(200).json({"message":"Customers fetched successfully", customers:customers})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getCustomerById = async(req, res)=>{
    try{
        const customer = await prisma.customer.findUnique({where:{id:req.params.id}})

        if(!customer){
            return res.status(400).json({"message":"Customer not found"})
        }

        return res.status(200).json({"message":"Customer fetched successfully", customer:customer})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.updateCustomer = async(req, res)=>{
    try{
        const exist = await prisma.customer.findUnique({where:{id:req.params.id}})

        if(!exist){
            return res.status(400).json({"message":"Customer not found"})
        }

        const customer = await prisma.customer.update({
            where:{id:req.params.id},
            data:{
                name: req.body.name,
                mobileNumber: req.body.mobileNumber,
                address: req.body.address
            }
        })

        return res.status(200).json({"message":"Customer updated successfully", customer:customer})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.deleteCustomer = async(req, res)=>{
    try{
        const exist = await prisma.customer.findUnique({where:{id:req.params.id}})

        if(!exist){
            return res.status(400).json({"message":"Customer not found"})
        }

        await prisma.customer.delete({where:{id:req.params.id}})

        return res.status(200).json({"message":"Customer deleted successfully"})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
