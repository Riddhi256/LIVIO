import User from "../models/user.js";

const signUpForm = (req, res) => {
  res.render("users/signUp");
};

const loginForm = (req, res) => {
  res.render("users/login");
};

const signUpUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;

    const user = new User({
      username,
      email,
    });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash(
        "success",
        "User Registered Successfully!! Welcome to Livio!"
      );

      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

const logIn = (req, res) => {
  req.flash("success", "Welcome back!");

  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};

export default {
  signUpForm,
  loginForm,
  signUpUser,
  logIn,
  logOut,
};