const mongoose = require('mongoose');

//for user ----------
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

//for subs ----------
const FournisseurSchema = new mongoose.Schema({
    //id genere auto par mongodb
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

//for transaction -------
const facteurSchema = new mongoose.Schema({
    //auto denrated id by mongo
    amount: { type: Number, required: true},
    dueDate: { type: Date, required: true},
    createdAt: { type: Date, default: Date.now },
    status: {
        type: String, 
        enum: ["paid", "partially_paid", "unpaid"],  
        default: "unpaid"},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fournisseurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fournisseur',
        required: true
    }
});

//for payment -------------
const paimentSchema = new mongoose.Schema({
    //auto generated id
    amount: {type: Number , required: true},
    payDate: {type: Date, default: Date.now},
    facteurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facteur',
        required: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        requied: true
    }
});

const user = mongoose.model('User', userSchema);
const facteur = mongoose.model('Facteur', facteurSchema);
const fournisseur = mongoose.model('Fournisseur', FournisseurSchema);
const paiment = mongoose.model('Paiment', paimentSchema);

module.exports = {user, facteur, fournisseur, paiment};