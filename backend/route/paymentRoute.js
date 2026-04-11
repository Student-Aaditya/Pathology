const express=require("express");
const { createDonation, getDonations } =require("../Controllers/donationController.js");

const router = express.Router();

router.post("/create", createDonation);
router.get("/all", getDonations);

module.exports=router;