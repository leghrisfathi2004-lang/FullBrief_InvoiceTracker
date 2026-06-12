const crypt = require("bcrypt");
const token = require('jsonwebtoken');
const {resMessage, resData} = require('../middleware/respond.js');
const mongoose = require("mongoose");
const {user, fournisseur, facteur, paiment} =  require('../database/module.js');


const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const exist = await user.findOne({ email });
        if (exist)
            return resMessage(res, 409, "email exist!");
        const hashPass = await crypt.hash(password, 10);
        if(req.body.role && req.body.role === "admin"){
            await user.create({name, email, password: hashPass, role: req.body.role})
            return resData(res, 201, {name, email, type: "admin"});
        }
        await user.create({name, email, password: hashPass});
        return resData(res, 201, { name, email, type: "user"});
    } catch(e) {
        return resMessage(res, 500, e.message);
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const emCheck = await user.findOne({ email });
        if (!emCheck)
            return resMessage(res, 422, "user dosnt exist!");
        const passCheck = await crypt.compare(password, emCheck.password);
        if (!passCheck)
            return resMessage(res, 422, "wrong password!");
        const jwt = token.sign(
            {id:emCheck._id, email: emCheck.email, role:emCheck.role },
            process.env.jwt_code,
            { expiresIn: process.env.jwt_expire }
        );
        return res.status(200).json({
            message: "Log In successfuly!",
            token: jwt,
            user: { name: emCheck.name, email: emCheck.email }
        });
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const profile = async (req, res) => {
    try {
        const { email } = req.user;
        const USER = await user.findOne({ email }).select("_id").lean();
        //wkha ra mimknch ms en case
        if (!USER)
            return resMessage(res, 404, "email not exist");

        const resultat = await fournisseur.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(USER._id) } },
            { $lookup: {
                from: "facteurs",
                localField: "_id",               //_id in fournisseur
                foreignField: "fournisseurId",
                as: "facteurs",
                pipeline: [
                    {
                        $lookup: {
                            from: "paiments",
                            localField: "_id",          //_id in facteur
                            foreignField: "facteurId",
                            as: "paiments"

                            }
                        }
                    ]
                }
            }
        ]);

        return resData(res, 200, resultat);
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

//check this one for admin routes
const deleteUser = async (req, res) => {
    try {
        const { id } = req.user;
        const User = await user.findByIdAndDelete(id);
        if (!User)
            return resMessage(res, 404, "user not found");
        const fourns = await fournisseur.find({userId: id});
        const deleted = await fournisseur.deleteMany({userId: id});
        if(!deleted.deletedCount)
            return resMessage(res, 200, "user deleted, but theres no other data!")

        //delets fact and paiments
        for (const el of fourns) {
            let factes = await facteur.find({userId: id, fournisseurId: el._id,});
            for (const fct of factes) 
                await paiment.deleteMany({userId: id, facteurId: fct._id});
            await facteur.deleteMany({userId: id, fournisseurId: el._id});
        }
        resMessage(res, 202, "user and their data deleted successfuly!");
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const USERS = await user.find({}).select("-password").lean();
        if (!USERS || USERS.length === 0)
            return resMessage(res, 404);
        resData(res, 200, USERS);
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

const dashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalInvoices = await facteur.countDocuments({ userId });
        const unpaidInvoices = await facteur.countDocuments({ userId, status: "unpaid" });
        const paidInvoices = await facteur.countDocuments({ userId, status: "paid" });
        const partialInvoices = await facteur.countDocuments({ userId, status: "partially_paid" });

        const pais = await paiment.find({ userId });
        const totalSpent = pais.reduce((t, p) => t + p.amount, 0);

        const overdueInvoices = await facteur.countDocuments({
            userId,
            status: { $ne: "paid" },
            dueDate: { $lt: new Date() }
        });

        const recentPayments = await paiment
            .find({ userId })
            .sort({ payDate: -1 })
            .limit(5)
            .populate("facteurId", "amount dueDate status");

        const supplierCount = await fournisseur.countDocuments({ userId });

        resData(res, 200, {
            totalInvoices,
            paidInvoices,
            unpaidInvoices,
            partialInvoices,
            overdueInvoices,
            totalSpent,
            supplierCount,
            recentPayments,
        });
    } catch(e) {
        resMessage(res, 500, e.message);
    }
}

module.exports = {register, login, profile, deleteUser, getAllUsers, dashboard}

// |--> Helper functions