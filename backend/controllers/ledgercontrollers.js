const prisma = require("../db/postgress")

exports.createLedger = async(req, res)=>{
    try{
        const ledger = await prisma.ledger.create({
            data:{
                name: req.body.name,
                type: req.body.type,
                companyId: req.body.companyId
            }
        })

        return res.status(200).json({"message":"Ledger created successfully", ledger:ledger})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getLedgers = async(req, res)=>{
    try{
        const where = { companyId: req.query.companyId }

        if(req.query.search){
            where.name = { contains: req.query.search, mode: "insensitive" }
        }

        if(req.query.type){
            where.type = req.query.type
        }

        const ledgers = await prisma.ledger.findMany({where})
        return res.status(200).json({"message":"Ledgers fetched successfully", ledgers:ledgers})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.getLedgerById = async(req, res)=>{
    try{
        const ledger = await prisma.ledger.findUnique({where:{id:req.params.id}})

        if(!ledger){
            return res.status(400).json({"message":"Ledger not found"})
        }

        return res.status(200).json({"message":"Ledger fetched successfully", ledger:ledger})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.updateLedger = async(req, res)=>{
    try{
        const ledgerexist = await prisma.ledger.findUnique({where:{id:req.params.id}})

        if(!ledgerexist){
            return res.status(400).json({"message":"Ledger not found"})
        }

        const ledger = await prisma.ledger.update({
            where:{id:req.params.id},
            data:{
                name: req.body.name,
                type: req.body.type
            }
        })

        return res.status(200).json({"message":"Ledger updated successfully", ledger:ledger})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}

exports.deleteLedger = async(req, res)=>{
    try{
        const ledgerexist = await prisma.ledger.findUnique({where:{id:req.params.id}})

        if(!ledgerexist){
            return res.status(400).json({"message":"Ledger not found"})
        }

        await prisma.ledger.delete({where:{id:req.params.id}})

        return res.status(200).json({"message":"Ledger deleted successfully"})
    }
    catch(err){
        return res.status(500).json({"message":err.message})
    }
}
