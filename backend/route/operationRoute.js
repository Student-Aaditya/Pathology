const express = require("express");
const router = express.Router();
const {
  getOperationData,
  saveOperation,
} = require("../controller/operationController.js");

router.get("/", getOperationData);

router.post("/", saveOperation);

module.exports = router;