const { resMessage, resData } = require('../middleware/respond.js');
const { user, fournisseur, facteur, paiment} = require('../database/module.js')
const mongoose = require("mongoose");


const addFourn = async (req, res) => {
    try{
        const {name} = req.body;
        const id = req.user.id;
        await fournisseur.create({name, userId: id});
        return resMessage(res, 201, "fournisseur created succefuly!");
    } catch(e) {
        return resMessage(res, 500, e.message);
    }
}

const getFourn = async (req, res) => {
    try{
        const id = req.params.id;
        const f = await fournisseur.findById(id);
        if(!f) 
            return resMessage(res, 404, "founisseur id not found!")
        resData(res, 200, f);
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const getAllFourn = async (req, res) => {
    try{
        const resultat = await fournisseur.find({});
        if(!resultat.length)
            return resMessage(res, 200, "fournisseur list are empty!");
        return resData(res, 200, resultat);
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const updatFour = async (req, res) => {
    try{
        const { name } = req.body;
        const id = req.params.id;
        const resaultat = await fournisseur.findByIdAndUpdate(id, 
            { $set: {name} },
            {new: true, runValidators: true}
        );
        if(!resaultat)
            return resMessage(res, 404, "update failed!");
        resData(res, 200, resaultat);
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const deleteFour = async (req, res) => {
    try {
        const id = req.params.id;
        const fourn = await fournisseur.findByIdAndDelete(id);

        if (!fourn)
            return resMessage(res, 404, "Fournisseur not found!");

        // delete their factures and paiements
        const factes = await facteur.find({ fournisseurId: id });

        for (const el of factes) {
            await paiment.deleteMany({ facteurId: el._id });
            await facteur.findByIdAndDelete(el._id);
        }

        resMessage(res, 200, "Fournisseur with their data deleted successfully!", fourn);
    } catch (e) {
        resMessage(res, 500, e.message);
    }
};

const FournisseurDetails = (res, req) => {
    try{
        const  id = req.params.id;
        const fourn = fournisseur.findOne({id});
        if(!fourn)
            return resMessage(res, 404, "not found!")
        const totalFacte = facteur.countDocuments({fournisseurId: id});

        //paid
        const totalPai =  facteur.countDocuments({_id: id, status: "paid"});

        //unpaid
        const totalUnpai = facteur.countDocuments({_id: id, status: "unpaid"});

        //amount total
        const factes = facteur.findById(id);
        let totalAmount = 0;
        for (const el of factes) {
            totalAmount =+ el.amount;
        }

        //amount total paye
        const factesUnpaid = facteur.find({id, status: "paid"});
        let amountpaid = 0;
        for (const el of factes) {
            amountpaid =+ el.amount;
        }

        resData(res, 200, {
            fournisseur: fourn.name,
            totalFactures: totalFacte,
            paid: totalPai,
            unpaid: totalUnpai,
            montantTotal: totalAmount,
            montantPaye: amountpaid
        })
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

module.exports = {addFourn, getFourn, getAllFourn, updatFour, deleteFour};