const {resMessage} = require('./respond.js');
const {fournisseur, facteur, paiment} = require('../database/module.js');

const ownerFourn = async (req, res, next) => {
    try{
        const id = req.params.id;
        const userId = req.user.id;
        const fourn = await fournisseur.findOne({_id: id, userId});
        if(!fourn)
            return resMessage(res, 401, "not your fournisseur!")
        next();
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

const ownerFacte = async (req, res, next) => {
    try{
        const id = req.params.id;
        const userId = req.user.id;
        const facte = await facteur.findOne({_id: id, userId});
        if(!facte)
            return resMessage(res, 401, "not your facteur!")
        next();
    } catch(e) {
        resMessage(res, 500, e.message)
    }
}

module.exports = {ownerFacte, ownerFourn};                                   