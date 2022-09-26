const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  getRegisterForm,
  getLoginForm,
  registerUser,
  loginUser,
  logoutUser
} = require('../controllers/userController');

router.route('/register')
  .get(getRegisterForm)
  .post(registerUser);

router.route('/login')
  .get(getLoginForm)
  .post(passport.authenticate('local', { 
    failureFlash: true, 
    failureRedirect: '/login',
    keepSessionInfo: true
  }), loginUser);

router.get('/logout', logoutUser)

module.exports = router;