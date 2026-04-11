const Donation = require("../Model/donation.models.js");
const Alumni = require("../Model/alumniData.js");

// Create donation
const createDonation = async (req, res) => {
  try {
    const { alumniId, amount, date, transactionIdHash } = req.body;

    const alumni = await Alumni.findById(alumniId);
    if (!alumni)
      return res
        .status(404)
        .json({ success: false, message: "Alumni not found" });

    const donation = new Donation({
      alumni: alumniId,
      amount,
      date,
      transactionIdHash,
    });

    await donation.save();
    res.status(201).json({ success: true, data: donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all donations
const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate(
      "alumni",
      "name userId email branch graduationYear",
    );

    res.json({ success: true, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createDonation, getDonations };
