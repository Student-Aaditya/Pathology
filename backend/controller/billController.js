const db = require("../config/db");
const PDFDocument = require("pdfkit");
const Razorpay = require("razorpay");

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const billController = {
  // ✅ 1. GET ALL TESTS
  patientTestList: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM patient_lab_tests");
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // ✅ 2. CREATE RAZORPAY ORDER
  createOrder: async (req, res) => {
    try {
      const { amount } = req.body;
      const options = {
        amount: Math.round(amount * 100), // paise
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      };
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error("Order Error:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  },

  // ✅ 3. CREATE BILL + TRANSACTION
  createBill: async (req, res) => {
    try {
      const {
        patientId,
        tests,
        paymentType,
        advancePaid = 0,
        receivedFrom,
        transactionData,
      } = req.body;

      if (!patientId || !tests || tests.length === 0) {
        return res.status(400).json({ message: "Missing required data" });
      }
      const total_test_amount = tests.reduce(
        (sum, t) => sum + Number(t.price),
        0,
      );
      const totalAmount = tests.reduce(
        (sum, t) => sum + (Number(t.price) - Number(t.concession || 0)),
        0,
      );
      const paid_amount = totalAmount - advancePaid;

      let paymentStatus = "Pending";
      if (paid_amount <= 0) paymentStatus = "Paid";
      else if (advancePaid > 0) paymentStatus = "Partial";

      let transactionId = null;
      if (paymentType === "UPI" || advancePaid > 0) {
        const [txResult] = await db.query(
          "INSERT INTO transaction (transaction_paid_by, transaction_paid_to) VALUES (?, ?)",
          [receivedFrom || "Patient", "Pathology Lab"],
        );
        transactionId = txResult.insertId;
      }

      // ✅ Insert bill logic using user's provided schema
      const billSql = `
        INSERT INTO bills 
        (patient_id, total_amount, payment_type, advance_paid, paid_amount, received_payment_from, transaction_id, paid_to, payment_status, pending_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Paid", 0)
      `;

      const [billResult] = await db.query(billSql, [
        patientId,
        total_test_amount,
        paymentType,
        advancePaid,
        paid_amount,
        receivedFrom || "Patient",
        transactionId || 0,
        "Pathology Lab",
        paymentStatus,
      ]);

      const billId = billResult.insertId;

      // ✅ Insert tests
      const testValues = tests.map((t) => [
        patientId,
        billId,
        t.name,
        t.sample || "Not Specified",
        t.price,
        t.concession || 0,
      ]);

      await db.query(
        "INSERT INTO bill_tests (patient_id, bill_id, test_name, test_sample, price, concession) VALUES ?",
        [testValues],
      );

      res
        .status(201)
        .json({
          success: true,
          message: "Bill created successfully ✅",
          billId,
        });
    } catch (error) {
      console.error("Create Bill Error:", error);
      res.status(500).json({ message: "Error creating bill" });
    }
  },

  // ✅ 4. GET BILL FOR RECEIPT
  getBillById: async (req, res) => {
    try {
      const billId = req.params.id;
      const [rows] = await db.query(
        `SELECT b.*, t.test_name, t.price, t.concession, t.test_sample
         FROM bills b
         JOIN bill_tests t ON b.id = t.bill_id
         WHERE b.id = ?`,
        [billId],
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Bill not found" });
      }

      const bill = {
        id: rows[0].id,
        patientId: rows[0].patient_id,
        totalAmount: rows[0].total_amount,
        paymentType: rows[0].payment_type,
        advancePaid: rows[0].advance_paid,
        remainingAmount: rows[0].remaining_amount,
        paymentStatus: rows[0].payment_status,
        createdAt: rows[0].created_at,
        pendingAmount: rows[0].pending_amount,
        tests: rows.map((r) => ({
          name: r.test_name,
          price: r.price,
          concession: r.concession,
          sample: r.test_sample,
        })),
      };
      res.status(200).json({ success: true, data: bill });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching bill" });
    }
  },

  // ✅ 5. GENERATE PDF
  generatePDF: async (req, res) => {
    console.time('generatePDF');
    try {
      const billId = req.params.id;
      console.time('dbQuery');
      const [rows] = await db.query(
        `SELECT b.*, t.test_name, t.price, t.concession, p.name as p_name, p.phone as p_phone
         FROM bills b
         JOIN bill_tests t ON b.id = t.bill_id
         LEFT JOIN patients p ON b.patient_id = p.id
         WHERE b.id = ?`,
        [billId],
      );
      console.timeEnd('dbQuery');
      console.log(`Fetched ${rows.length} rows for bill ${billId}`);

      if (rows.length === 0)
        return res.status(404).json({ message: "Bill not found" });

      const doc = new PDFDocument({ margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Receipt_${billId}.pdf`,
      );
      doc.pipe(res);

      doc.fontSize(20).text("BILL RECEIPT", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Bill No: ${billId}`);
      doc.text(`Patient: ${rows[0].p_name || "N/A"}`);
      doc.text(`Date: ${new Date(rows[0].created_at).toLocaleString()}`);
      doc.moveDown();

      rows.forEach((r) => {
        doc.text(`${r.test_name} - ₹${r.price} (Disc: ₹${r.concession})`);
      });

      doc.moveDown();
      doc.text(`Total Payable: ₹${rows[0].total_amount}`);
      doc.text(`Advance Paid: ₹${rows[0].advance_paid}`);
      doc.text(`Remaining: ₹${rows[0].remaining_amount}`);
      doc.text(`Status: ${rows[0].payment_status}`);
      doc.end();
      console.timeEnd('generatePDF');
    } catch (error) {
      console.timeEnd('generatePDF');
      console.error(error);
      res.status(500).json({ message: "Error generating PDF" });
    }
  },

  // ✅ 6. ACCESSION CONTROLS
  storeAccession: async (req, res) => {
    try {
      const { accessions } = req.body;
      if (!accessions || accessions.length === 0)
        return res.status(400).json({ message: "No accessions provided" });

      for (const acc of accessions) {
        await db.query(
          "INSERT INTO accession (accession_number, report_status, patient_id) VALUES (?, ?, ?)",
          [acc.accession_number, "Pending", acc.patient_id],
        );
        await db.query(
          "UPDATE bill_tests SET accession_number = ? WHERE bill_id = ? AND test_sample = ?",
          [acc.accession_number, acc.bill_id, acc.sample],
        );
      }
      res
        .status(201)
        .json({ success: true, message: "Accessions stored successfully" });
    } catch (error) {
      console.error("Error storing accessions:", error);
      res.status(500).json({ message: "Error storing accessions" });
    }
  },

  getAccession: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let sql =
        "SELECT a.*, p.name FROM accession a LEFT JOIN patients p ON a.patient_id = p.id ";
      const params = [];

      if (startDate && endDate) {
        sql += " WHERE DATE(a.createdAt) >= ? AND DATE(a.createdAt) <= ? ";
        params.push(startDate, endDate);
      } else if (startDate) {
        sql += " WHERE DATE(a.createdAt) >= ? ";
        params.push(startDate);
      } else if (endDate) {
        sql += " WHERE DATE(a.createdAt) <= ? ";
        params.push(endDate);
      }

      sql += " ORDER BY a.createdAt DESC";
      const [rows] = await db.query(sql, params);
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching accessions" });
    }
  },

  updateAccession: async (req, res) => {
    try {
      const { id } = req.params;
      const { report_status, remark } = req.body;
      await db.query(
        "UPDATE accession SET report_status = ?, remark = ? WHERE accession_id = ?",
        [report_status, remark || "", id],
      );
      res
        .status(200)
        .json({ success: true, message: "Accession updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating accession" });
    }
  },

  deleteAccession: async (req, res) => {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM accession WHERE accession_id = ?", [id]);
      res
        .status(200)
        .json({ success: true, message: "Accession deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting accession" });
    }
  },

  deleteBill: async (req, res) => {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM bill_tests WHERE bill_id = ?", [id]);
      await db.query("DELETE FROM bills WHERE id = ?", [id]);
      res
        .status(200)
        .json({ success: true, message: "Bill deleted successfully" });
    } catch (error) {
      console.error("Error deleting bill:", error);
      res.status(500).json({ message: "Error deleting bill" });
    }
  },

  getBillInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const sql = `
        SELECT b.*, t.test_name, t.price, t.concession, t.test_sample, p.name as p_name, p.age as p_age, p.gender as p_gender, p.phone as p_phone
        FROM bills b
        JOIN bill_tests t ON b.id = t.bill_id
        LEFT JOIN patients p ON b.patient_id = p.id
        WHERE b.id = ?
      `;
      const [rows] = await db.query(sql, [id]);
      if (rows.length === 0)
        return res.status(404).json({ message: "Bill not found" });

      const bill = {
        id: rows[0].id,
        patient_id: rows[0].patient_id,
        total_amount: rows[0].total_amount,
        advance_paid: rows[0].advance_paid,
        remaining_amount: rows[0].remaining_amount,
        payment_type: rows[0].payment_type,
        received_payment_from: rows[0].received_payment_from,
        createdAt: rows[0].created_at,
        p_name: rows[0].p_name,
        p_age: rows[0].p_age,
        p_gender: rows[0].p_gender,
        p_phone: rows[0].p_phone,
        tests: rows.map((r) => ({
          name: r.test_name,
          price: r.price,
          concession: r.concession,
          sample: r.test_sample,
        })),
      };
      res.status(200).json({ success: true, data: bill });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching bill" });
    }
  },

  generateBillInvoice: async (req, res) => {
    try {
      const { id } = req.params;

      // 1. Get patient info
      const [patientRows] = await db.query(
        `SELECT * FROM patients WHERE id = ?`,
        [id],
      );

      if (patientRows.length === 0) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const patient = patientRows[0];

      // 2. Get tests
      const [testRows] = await db.query(
        `SELECT bt.test_name, bt.price,b.id as billId,b.payment_type,bt.concession, b.total_amount,b.advance_paid,bt.test_sample
       FROM bill_tests bt
       LEFT JOIN bills b ON b.id = bt.bill_id
       WHERE bt.patient_id = ?`,
        [id],
      );

      res.status(200).json({
        success: true,
        data: {
          patient,
          tests: testRows,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching bill" });
    }
  },

  generateBillInvoicePDF: async (req, res) => {
    try {
      const { id } = req.params;

      // 1. Get patient info
      // const [patientRows] = await db.query(
      //   `SELECT * FROM patients WHERE id = ?`,
      //   [id],
      // );

      // if (patientRows.length === 0) {
      //   return res.status(404).json({ message: "Patient not found" });
      // }
      console.time('generateBillInvoicePDF');
      // const { id } = req.params;

      // 1. Get patient info
      console.time('queryPatient');
      const [patientRows] = await db.query(
        `SELECT * FROM patients WHERE id = ?`,
        [id],
      );
      console.timeEnd('queryPatient');

      if (patientRows.length === 0) {
        console.timeEnd('generateBillInvoicePDF');
        return res.status(404).json({ message: "Patient not found" });
      }

      const patient = patientRows[0];

      // 2. Get tests
      console.time('queryTests');
      const [testRows] = await db.query(
        `SELECT bt.test_name, bt.price,b.id as billId,b.payment_type,bt.concession, b.total_amount,b.advance_paid,bt.test_sample
         FROM bill_tests bt
         LEFT JOIN bills b ON b.id = bt.bill_id
         WHERE bt.patient_id = ?`,
        [id],
      );
      console.timeEnd('queryTests');

      if (testRows.length === 0) {
        console.timeEnd('generateBillInvoicePDF');
        return res
          .status(404)
          .json({ message: "No tests found for this bill" });
      }

      const doc = new PDFDocument({ margin: 40 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Invoice_${patient.id}.pdf`,
      );

      doc.pipe(res);

      /* ================= HEADER ================= */
      doc
        .roundedRect(200, 20, 180, 25, 15)
        .fill("#dcfce7")
        .fillColor("#16a34a")
        .fontSize(10)
        .text("✔ PAYMENT CONFIRMED", 210, 27);

      doc
        .fillColor("#8b5cf6")
        .fontSize(22)
        .text("TREGO", 40, 60, { continued: true })
        .fillColor("#4f46e5")
        .text("LABS");

      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text("PREMIUM DIAGNOSTIC CENTER", 40, 85);

      doc.fillColor("#8b5cf6").fontSize(10).text("TAX INVOICE", 450, 60);

      doc
        .fillColor("#334155")
        .fontSize(10)
        .text(`Invoice: ${patient.id}`, 450, 75);

      doc
        .fontSize(8)
        .fillColor("#64748b")
        .text(new Date().toLocaleString(), 450, 90);

      /* ================= LINE ================= */
      doc.moveTo(40, 110).lineTo(550, 110).stroke("#e2e8f0");

      /* ================= PATIENT + PAYMENT ================= */
      doc.fontSize(11).fillColor("#000").text("PATIENT DETAILS", 40, 130);
      doc.text("PAYMENT INFO", 400, 130);

      doc
        .fontSize(10)
        .fillColor("#334155")
        .text(patient.name.toUpperCase(), 40, 150);

      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text(
          `Patient ID: ${patient.id} • Age: ${patient.age} • Gender: ${patient.gender}`,
          40,
          165,
        )
        .text(`Phone: ${patient.phone}`, 40, 180);

      // Right side payment info
      const paymentType = testRows[0].payment_type || "Cash";

      doc
        .fontSize(9)
        .fillColor("#334155")
        .text(`METHOD: ${paymentType.toUpperCase()}`, 400, 150)
        .text(`RECEIVED FROM: SELF`, 400, 165)
        .fillColor("#16a34a")
        .text("STATUS: SUCCESSFUL", 400, 180);

      /* ================= TABLE HEADER ================= */
      let tableTop = 220;

      doc
        .fillColor("#8b5cf6")
        .fontSize(9)
        .text("S.NO", 40, tableTop)
        .text("INVESTIGATION", 80, tableTop)
        .text("PRICE", 320, tableTop)
        .text("DISCOUNT", 390, tableTop)
        .text("TOTAL", 480, tableTop);

      /* ================= TABLE ROWS ================= */
      let y = tableTop + 20;
      let totalAmount = 0;
      let totalDiscount = 0;

      testRows.forEach((r, i) => {
        const net = Number(r.price) - Number(r.concession);

        doc
          .fillColor("#334155")
          .fontSize(9)
          .text(i + 1, 40, y)
          .text(r.test_name, 80, y, { width: 220 })
          .text(`₹${r.price}`, 320, y)
          .text(`-₹${r.concession}`, 390, y)
          .text(`₹${net}`, 480, y);

        doc
          .fillColor("#64748b")
          .fontSize(8)
          .text(`Sample: ${r.test_sample || "Blood"}`, 80, y + 12);

        y += 30;

        totalAmount += Number(r.price);
        totalDiscount += Number(r.concession);
      });

      /* ================= TOTAL BOX ================= */
      const totalAdvance = testRows[0].advance_paid || 0;
      const payable = totalAmount - totalDiscount - totalAdvance;

      const boxY = y + 20;

      doc.roundedRect(350, boxY, 200, 100, 10).stroke("#c7d2fe");

      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text(`SUBTOTAL`, 360, boxY + 10)
        .text(`₹${totalAmount}`, 500, boxY + 10, { align: "right" });

      doc
        .fillColor("#ef4444")
        .text(`TOTAL DISCOUNT`, 360, boxY + 30)
        .text(`-₹${totalDiscount}`, 500, boxY + 30, { align: "right" });

      doc
        .fillColor("#64748b")
        .text(`ADVANCE PAID`, 360, boxY + 50)
        .text(`₹${totalAdvance}`, 500, boxY + 50, { align: "right" });

      doc
        .fontSize(12)
        .fillColor("#8b5cf6")
        .text(`TOTAL PAID`, 360, boxY + 70)
        .text(`₹${payable}`, 500, boxY + 70, { align: "right" });

      /* ================= FOOTER ================= */
      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text("Signature", 450, boxY + 130);

      doc
        .moveTo(430, boxY + 150)
        .lineTo(550, boxY + 150)
        .stroke("#cbd5f5");

      doc.fontSize(8).text("AUTHORIZED", 460, boxY + 155);

      /* ================= END ================= */
      doc.end();
      console.timeEnd('generateBillInvoicePDF');
    } catch (error) {
      console.timeEnd('generateBillInvoicePDF');
      console.error(error);
      res.status(500).json({ message: "Error generating PDF" });
    }
  },

  countPending: async (req, res) => {
    try {
      const [[rows]] = await db.query(
        "select count(*) as count from accession where report_status='Pending'",
      );
      res.status(200).json({ success: true, data: rows.count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error counting pending bills" });
    }
  },
  countTestConducted: async (req, res) => {
    try {
      const [[rows]] = await db.query(
        "select count(*) as test_conducted from bill_tests",
      );
      res.status(200).json({ success: true, data: rows.test_conducted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error counting test conducted" });
    }
  },
};

module.exports = billController;
