const express = require("express");
const router = express.Router();
const {authMiddleware}=require("../middleware/authMiddleware");
const {
  createPatient,
  getPatients,
  getPatientById,
  countPatients,
  addReferal,
  getReferal
} = require("../controller/patientController");

// Routes
router.get("/",authMiddleware, getPatients); //for all patient data
router.get("/getReferal",authMiddleware, getReferal); //for getting referal'
router.get("/count",authMiddleware, countPatients); //for total patient count

router.get("/:id",authMiddleware, getPatientById); //for single patient data

router.post("/add",authMiddleware, createPatient);  //for adding patient
router.post("/addReferal",authMiddleware, addReferal); //for adding referal
module.exports = router;