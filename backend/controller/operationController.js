const db = require("../config/db");

// ✅ FETCH DATA (WITH MULTIPLE TESTS AND DAYS FILTER)
exports.getOperationData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = `
      SELECT 
        p.id AS patient_id,
        p.name,
        p.age,
        p.referal,
        a.accession_id,
        a.accession_number,
        a.report_status,
        bt.test_name,
        bt.test_sample,
        o.remark
      FROM patients p
      JOIN accession a ON p.id = a.patient_id
      LEFT JOIN bill_tests bt ON bt.accession_number = a.accession_number
      LEFT JOIN operation o ON o.accession_id = a.accession_id 
      WHERE a.report_status = "Sample Dispatched"
    `;
    const params = [];

    if (startDate && endDate) {
      query += " AND DATE(a.createdAt) >= ? AND DATE(a.createdAt) <= ? ";
      params.push(startDate, endDate);
    } else if (startDate) {
      query += " AND DATE(a.createdAt) >= ? ";
      params.push(startDate);
    } else if (endDate) {
      query += " AND DATE(a.createdAt) <= ? ";
      params.push(endDate);
    }

    query += " ORDER BY p.id DESC";

    const [rows] = await db.query(query, params);

    // ✅ GROUP TESTS BY ACCESSION
    const grouped = {};

    rows.forEach((row) => {
      if (!grouped[row.accession_id]) {
        grouped[row.accession_id] = {
          patient_id: row.patient_id,
          name: row.name,
          age: row.age,
          referal: row.referal,
          accession_id: row.accession_id,
          accession_number: row.accession_number,
          report_status: row.report_status,
          test_sample: row.test_sample,
          tests: [],
          remark: row.remark || "",
        };
      }

      if (row.test_name) {
        grouped[row.accession_id].tests.push(row.test_name);
      }
    });

    res.json({
      success: true,
      data: Object.values(grouped),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.saveOperation = async (req, res) => {
  try {
    const { patient_id, accession_id, report_status, remark } = req.body;

    // insert into operation
   await db.query(
  `INSERT INTO operation (patient_id, accession_id, report_status, remark)
   VALUES (?, ?, ?, ?)`,
  [patient_id, accession_id, report_status, remark]
);

    // update accession table
    await db.query(
      `UPDATE accession SET report_status=? WHERE accession_id=?`,
      [report_status, accession_id]
    );

    res.json({ success: true, message: "Saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
};