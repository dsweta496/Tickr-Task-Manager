const express = require("express");
const {handleSigninUserController, handleSignupUserController}= require("../controller/user.controller");

const router = express.Router();

router.post("/create", handleSignupUserController);

router.post("/login", handleSigninUserController);

module.exports= router;