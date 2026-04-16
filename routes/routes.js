
const express = require('express');
const router = express.Router();


const {auth, authAdmine} = require('../middleware/auth.js');

//USER-------------------------------
const {register, login, profile, deleteUser, getAllUsers} = require('../controllers/users.controller.js');
//FOURNISSEUR-----------------------
const {addFourn, getFourn, getAllFourn, updatFour, deleteFour} = require('../controllers/fournisseur.controller.js');
//FACTEUR---------------------------
const {addFacteur, getFacte, getAllFactes, updateFacte, deleteFacte} = require('../controllers/facteurs.controller.js');
//PAIMENT---------------------------
const { addPaiment, getPaiment} = require('../controllers/paiments.controller.js');
//VALIDATIONS------------------------
const {validUser, validFourni, validFacteur, validPay } = require("../middleware/validate.js");
//OWNERSHIP------------------------------
const {ownerFacte, ownerFourn} = require('../middleware/owner.js');

//crud users
router.post("/api/auth/register", validUser, register);
router.post("/api/auth/login", validUser, login);
router.get("/api/auth/me", auth, profile);//check later

//crud fournisseurs
router.post('/api/suppliers', auth, validFourni, addFourn);
router.get('/api/suppliers', auth, getAllFourn);
router.get('/api/suppliers/:id', auth, ownerFourn, getFourn);
router.put('/api/suppliers/:id', auth, ownerFourn, updatFour);
router.delete('/api/suppliers/:id', auth, ownerFourn, deleteFour);

//crud facteurs
router.post('/api/invoices', auth, validFacteur, addFacteur);
router.get('/api/invoices', auth, getAllFactes);
router.get('/api/invoices/:id', auth, ownerFacte, getFacte);
router.put('/api/invoices/:id', auth, ownerFacte, updateFacte);
router.delete('/api/invoices/:id', auth, ownerFacte, deleteFacte);

//crud paiments
router.post('/api/invoices/:id/payments', auth, validPay, addPaiment);
router.get('/api/invoices/:id/payments', auth, getPaiment);

//only admin
router.get("/api/admin/users", authAdmine, getAllUsers);
router.delete("/api/admin/users", authAdmine, deleteUser); //user id in body

module.exports = router;