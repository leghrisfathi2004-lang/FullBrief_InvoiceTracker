const {resMessage, resData} = require('../middleware/respond.js');
const {paiment, facteur} = require('../database/module.js');

const addPaiment = async (req, res) => {
    try{
        const userId = req.user.id;
        const facteurId = req.params.id;
        const { amount } = req.body;
        const facte = await facteur.findById(facteurId);

        if(!amount || !facteurId || !facte || amount <= 0)
            return resMessage(res, 400, "required fields are missing or false!")

        const status = await checkAmount(facteurId, amount);
        if(!status)
            return resMessage(res, 400, "amout paye higher then the facteur!");
 
        await paiment.create({userId, amount, facteurId});

        await facteur.findByIdAndUpdate(
            facteurId,
            { $set: { status } },
            { new: true }
        );

        resMessage(res, 201, `paiment created, and facteur id: ${facteurId} its ${status}`);
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

const getPaiment = async (req, res) => {
    try{
        const facteurId = req.params.id;
        const pais = await paiment.find({facteurId});
        if(!pais.length)
            return resMessage(res, 404, "no paiments found!");
        resData(res, 200, pais)
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

module.exports = {addPaiment, getPaiment};

//helper functions 
const checkAmount = async (facteurId, amount) => {
    const facte = await facteur.findById(facteurId);
    if (!facte) return false;

    const pais = await paiment.find({ facteurId });
    const total = pais.reduce((sum, p) => sum + p.amount, amount);
    const remaining = facte.amount - total;

    if(remaining < 0 ) return false;
    if(remaining === 0) return "paid";
    if(remaining > 0) return "partially_paid";
};

module.exports = { addPaiment, getPaiment};