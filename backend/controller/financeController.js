const db = require("../config/db");

exports.getBill = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = "";
    const params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE DATE(b.created_at) >= ? AND DATE(b.created_at) <= ?";
      params.push(startDate, endDate);
    } else if (startDate) {
      dateFilter = "WHERE DATE(b.created_at) >= ?";
      params.push(startDate);
    } else if (endDate) {
      dateFilter = "WHERE DATE(b.created_at) <= ?";
      params.push(endDate);
    }

    const query = `
      SELECT 
        b.id as bill_id, 
        b.total_amount, 
        b.payment_type as method, 
        b.advance_paid, 
        b.paid_amount, 
        b.created_at as Date, 
        p.name as patientName, 
        p.id as PatientId, 
        GROUP_CONCAT(CONCAT(bt.id, ' - ', bt.test_name) SEPARATOR '\\n') as Tests,
        SUM(bt.concession) as total_concession 
      FROM bills as b 
      LEFT JOIN patients as p ON p.id = b.patient_id  
      LEFT JOIN bill_tests as bt ON b.id = bt.bill_id
      ${dateFilter}
      GROUP BY b.id
      ORDER BY b.id DESC`;

    const [rows] = await db.query(query, params);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bills" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = "";
    const params = [];

    if (startDate && endDate) {
      dateFilter = "WHERE DATE(b.created_at) >= ? AND DATE(b.created_at) <= ?";
      params.push(startDate, endDate);
    } else if (startDate) {
      dateFilter = "WHERE DATE(b.created_at) >= ?";
      params.push(startDate);
    } else if (endDate) {
      dateFilter = "WHERE DATE(b.created_at) <= ?";
      params.push(endDate);
    }

    const query = `
      SELECT 
        b.id as bill_id, 
        b.id as txn_id, 
        b.id as order_id, 
        b.created_at as Date, 
        p.name as receivedFrom, 
        'Pathology Lab' as paidTo, 
        b.total_amount as payableAmt, 
        b.advance_paid, 
        b.paid_amount as paidAmt,
        b.pending_amount as pendingAmt, 
        b.payment_type as method, 
        b.patient_id as PatientId,
        CASE 
          WHEN b.pending_amount <= 0 THEN 'Paid' 
          ELSE 'Pending' 
        END as status 
      FROM bills as b 
      LEFT JOIN patients as p ON p.id = b.patient_id 
      ${dateFilter}
      ORDER BY b.id DESC`;

    const [rows] = await db.query(query, params);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

exports.getBillById = async (req, res) => {
  try {
    const {id} = req.params;
    const query = `
      SELECT 
        b.id as bill_id, 
        b.total_amount, 
        b.payment_type as method, 
        b.advance_paid, 
        b.paid_amount, 
        b.pending_amount,
        b.created_at as Date, 
        p.name as patientName, 
        p.id as PatientId, 
        GROUP_CONCAT(CONCAT(bt.id, ' - ', bt.test_name) SEPARATOR '\\n') as Tests,
        SUM(bt.concession) as total_concession 
      FROM bills as b 
      LEFT JOIN patients as p ON p.id = b.patient_id  
      LEFT JOIN bill_tests as bt ON b.id = bt.bill_id
      WHERE b.id = ?
      GROUP BY b.id`;

    const [rows] = await db.query(query, [id]);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bill details" });
  }
};

exports.getPaymentsById = async (req, res) => {
  try {
    const {id}=req.params;
    const query = `
      SELECT 
        b.id as bill_id, 
        b.id as txn_id, 
        b.id as order_id, 
        b.created_at as Date, 
        p.name as receivedFrom, 
        'Pathology Lab' as paidTo, 
        b.total_amount as payableAmt, 
        b.advance_paid, 
        b.paid_amount as paidAmt, 
        b.pending_amount as pendingAmt, 
        b.payment_type as method, 
        b.patient_id as PatientId,
        CASE 
          WHEN b.pending_amount <= 0 THEN 'Paid' 
          ELSE 'Pending' 
        END as status 
      FROM bills as b 
      LEFT JOIN patients as p ON p.id = b.patient_id 
      WHERE b.id = ?`;

    const [rows] = await db.query(query, [id]);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching payment details" });
  }
};