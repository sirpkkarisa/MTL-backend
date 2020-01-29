const express = require('express');

const router = express.Router();
const usersCtrl = require('../controllers/users');

router.post('/create-user/', usersCtrl.createUserCtrl);
router.post('/signin/', usersCtrl.loginCtrl);
router.patch('/change-password/', usersCtrl.changePassword);
router.patch('/forgot-password/', usersCtrl.forgotPassword);
router.patch('/reset-password/', usersCtrl.resetPassword);
router.delete('/remove-user/:userId', usersCtrl.removeUser);

module.exports = router;
