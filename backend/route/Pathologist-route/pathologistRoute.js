const {patholigistAuthController}=require("../../controller/Pathologist/pathologist-auth.js");
const express=require("express");
const router=express.Router();

router.post("/register",patholigistAuthController.register);
router.post("/login",patholigistAuthController.login);
router.post("/reset",patholigistAuthController.resetPassword);
module.exports=router;