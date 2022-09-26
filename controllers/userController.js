const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user');

const getRegisterForm = (req, res) => {
  res.render('users/register');
}
const getLoginForm = (req, res) => {
  res.render('users/login');
}

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if(err) return next(err);
      req.flash('success', `Welcome ${username}!  You have successfully registered`);
      res.redirect('/campuses');
    })

  } catch (error) {
    req.flash('error', error.message);
    res.redirect('register');
  }
})

const loginUser = (req, res) => {
  req.flash('success', 'Welcome back!');
  // Redirects user back to where they came from
  const redirectUrl = req.session.returnTo || '/campuses';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
}

const logoutUser = (req, res) => {
  req.logout((err) => {
    if(err) return next(err);
    req.flash('success', 'You have been logged out.');
    res.redirect('/campuses');
  });
}

module.exports = {
  getRegisterForm,
  getLoginForm,
  registerUser,
  loginUser,
  logoutUser
}