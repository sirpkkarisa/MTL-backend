const express = require('express');

const router = express.Router();
const usersCtrl = require('../controllers/users');
const admin = require('../middlewares/admin').admin;

router.post('/create-user/',admin, usersCtrl.createUserCtrl);
router.post('/signin/', usersCtrl.loginCtrl);
router.patch('/change-password/', usersCtrl.changePassword);
router.patch('/forgot-password/', usersCtrl.forgotPassword);
router.patch('/reset-password/', usersCtrl.resetPassword);
router.delete('/remove-user/:userId', usersCtrl.removeUser);
router.get('/users', usersCtrl.getUsers);
module.exports = router;
