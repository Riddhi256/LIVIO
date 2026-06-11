import express from "express";
const router = express.Router();

import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import middleware from "../middleware.js";
import userController from "../controllers/user.js";

// Signup
router
  .route("/signup")
  .get(userController.signUpForm)
  .post(wrapAsync(userController.signUpUser));

// Login
router
  .route("/login")
  .get(userController.loginForm)
  .post(
    middleware.saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.logIn
  );

// Logout
router.get("/logout", userController.logOut);

export default router;