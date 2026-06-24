const prisma = require("../db/postgress")

exports.createCompany = async(req, res)=>{
    try{
        const companyCount = await prisma.company.count({where:{userId:req.user.id}})

        if(companyCount >= 5){
            return res.status(400).json({"message":"A user can manage a maximum of 5 companies"})
        }

        const company = await prisma.company.create({
            data:{
                name: req.body.name,
                address: req.body.address,
                gstNumber: req.body.gstNumber,
                financialYear: req.body.financialYear,
                state: req.body.state,
                contactInfo: req.body.contactInfo,
                userId: req.user.id
            }
        })

        return res.status(200).json({"message":"Company created successfully", company:company})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getCompanies = async(req, res)=>{
    try{
        const companies = await prisma.company.findMany({where:{userId:req.user.id}})
        return res.status(200).json({"message":"Companies fetched successfully", companies:companies})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getCompanyById = async(req, res)=>{
    try{
        const company = await prisma.company.findFirst({where:{id:req.params.id, userId:req.user.id}})

        if(!company){
            return res.status(400).json({"message":"Company not found"})
        }

        return res.status(200).json({"message":"Company fetched successfully", company:company})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.updateCompany = async(req, res)=>{
    try{
        const companyexist = await prisma.company.findFirst({where:{id:req.params.id, userId:req.user.id}})

        if(!companyexist){
            return res.status(400).json({"message":"Company not found"})
        }

        const company = await prisma.company.update({
            where:{id:req.params.id},
            data:{
                name: req.body.name,
                address: req.body.address,
                gstNumber: req.body.gstNumber,
                financialYear: req.body.financialYear,
                state: req.body.state,
                contactInfo: req.body.contactInfo
            }
        })

        return res.status(200).json({"message":"Company updated successfully", company:company})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.deleteCompany = async(req, res)=>{
    try{
        const companyexist = await prisma.company.findFirst({where:{id:req.params.id, userId:req.user.id}})

        if(!companyexist){
            return res.status(400).json({"message":"Company not found"})
        }

        await prisma.company.delete({where:{id:req.params.id}})

        return res.status(200).json({"message":"Company deleted successfully"})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
