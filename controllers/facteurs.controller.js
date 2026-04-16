const { resMessage, resData} = require('../middleware/respond.js');
const { facteur, fournisseur, paiment } = require('../database/module.js');

const addFacteur = async (req, res) => {
    try{
        const id = req.user.id;
        const { fournisseurId, amount, dueDate} = req.body;

        if(!id || !fournisseurId || !amount || !dueDate)
            return resMessage(res, 400, "requerd fields are missing to add facteur!");
        const trueId = await fournisseur.findOne({ _id: fournisseurId, userId: id });
        if(!trueId)
            return resMessage(res, 400, 'incorrect fournisseur id!');

        await facteur.create({amount , dueDate , userId: id, fournisseurId});
        resMessage(res, 201, "facteur created succeffully!");
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

const getAllFactes = async (req, res) => {
    try{
        //filterage in 
        let filter = {};
        const { fournisseurId, amount, dueDate, status} = req.query;
        //this if for admin, will be no user id
        if(req.user.id)
            filter.userId = req.user.id;
        if(fournisseurId)
            filter.fournisseurId = fournisseurId;
        if(amount)
            filter.amount = amount;
        if(dueDate)
            filter.dueDate = dueDate;
        if(status)
            filter.status = status;

        const resultat = await facteur.find(filter);
        if(!resultat)
            return resMessage(res, 204, "theres no facteur match ur filter!");
        return resData(res, 200, resultat);
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

const getFacte = async (req, res) => {
    try{
        const id = req.params.id;
        const resultat = await facteur.findOne({_id: id});
        if(!resultat)
            return resMessage(res, 404, "theres no facteur with that id!");
        resData(res, 200, resultat);
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

const updateFacte = async (req, res) => {
    try{
        const id = req.params.id;
        const {amount, dueDate} = req.body;
        const facte = await facteur.findOne({_id: id});
        if(!facte || facte.status === "paid")
            return resMessage(res, 404, "the id incorrect or the facteur are paid!")
        if(!amount || !dueDate )
            return resMessage(res, 400, "requerd fields are missing to update facteur!");
        let status = facte.status;
        if( amount < facte.amount)
            status = await checkAmount(id, amount);
        if(status === "unpaid")
            return resMessage(res, 400, "the new amount are less then the paye!")

        const newFacte = await facteur.findByIdAndUpdate(
            id,
            { $set: { amount, dueDate, status} },
            { returnDocument: 'after' }
        );
        resData(res, 201, newFacte)
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

const deleteFacte = async (req, res) => {
    try{
        const id = req.params.id;
        const facte = await facteur.findOne({_id: id});
        //no paiment assoccie = status is unpaid
        if(!facte || facte.status !== "unpaid")
            return resMessage(res, 400, "facteur id not correct or theres paiments assoccie!");
        await facteur.findByIdAndDelete(id);
        resMessage(res, 200, " facteur delete succefully!")
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

const checkAmount = async (facteurId, newAmount) => {
    try{
        const facte = await facteur.findById(facteurId);
        if (!facte) return false;

        const pais = await paiment.find({ facteurId });
        const total = pais.reduce((sum, p) => sum + p.amount,0);
        const remaining = newAmount - total;

        if(remaining < 0 ) return "unpaid";
        if(remaining === 0) return "paid";
        if(remaining > 0) return "partially_paid";

    } catch(e) {
        resMessage(res, 500, e.message)
    }
};

module.exports = {addFacteur, getFacte, getAllFactes, updateFacte, deleteFacte};