const express = require("express");
const router = express.Router();
const { getBill, getPayments, getBillById, getPaymentsById } = require("../controller/financeController");

router.get("/bill", getBill);
router.get("/bill/:id", getBillById);
router.get("/payments", getPayments);
router.get("/payments/:id", getPaymentsById);

module.exports = router;