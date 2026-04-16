 const joi = require('joi');
 const {resMessage, resData} = require('./respond.js')

const validUser = (req, res, next) => {
    const userShema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });
     const { error } = userShema.validate(req.body);
    if (error)
        return resMessage(res, 400, error.details[0].message);
    next();
}

const validFourni = (req, res, next) => {
    const tranShema = joi.object({
        name: joi.string().required(),
        //userId in req.user
    });
    const { er } = tranShema.validate(req.body);
    if (er) 
        return resMessage(res, 400, er.details[0].message);
    next();
}

const validFacteur = (req, res, next) => {
    const facteShema = joi.object({
        amount: joi.number().positive().required(),
        dueDate: joi.date().required(), //ex: 2024-03-15
        fournisseurId: joi.string().required(),
        status: joi.string().valid("paid, partially_paid", "unpaid")
        //userId in req.user
    });
    const { er } = facteShema.validate(req.body);
    if (er) 
        return resMessage(res, 400, er.details[0].message);
    next();
}

const validPay = (req, res, next) => {
    const payShema = joi.object({
        amount: joi.number().positive().required(),
        factuerId: joi.string().required()
        //userId in req.user
    });
    const { er } = payShema.validate(req.body);
    if (er) 
        return resMessage(res, 400, er.details[0].message);
    next();
}

module.exports = {validUser, validFourni, validFacteur, validPay };