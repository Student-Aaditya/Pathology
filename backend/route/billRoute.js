const express = require("express");
const router = express.Router();
const billController = require("../controller/billController");

// ✅ Get all tests
router.get("/patient-test-list", billController.patientTestList);

// ✅ Create Razorpay Order (NEW)
router.post("/payment/order", billController.createOrder);

// ✅ Create Bill (Cash + UPI handled)
router.post("/create", billController.createBill);
// ✅ Get accession (with filter)

router.get("/get-accession", billController.getAccession);
// coutn test conducted
router.get("/count-test-conducted",billController.countTestConducted);
//count pending status
router.get("/count-pending",billController.countPending);
// ✅ Get Bill by ID
router.get("/:id", billController.getBillById);

// ✅ Generate PDF
router.get("/:id/pdf", billController.generatePDF);

router.get("/invoice/:id",billController.generateBillInvoice);
router.get("/invoice-pdf/:id", billController.generateBillInvoicePDF);

// ✅ Store accession
router.post("/store-accession", billController.storeAccession);

// ✅ Update accession
router.put("/update-accession/:id", billController.updateAccession);

// ✅ Delete accession
router.delete("/delete-accession/:id", billController.deleteAccession);

// ✅ Delete bill (Cancel)
router.delete("/delete-bill/:id", billController.deleteBill);

module.exports = router;