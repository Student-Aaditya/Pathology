const db = require("../config/db");

// ✅ Create Patient
exports.createPatient = async (req, res) => {
  const {
    name,
    gender,
    age,
    phone,
    email,
    address,
    city,
    state,
    district,
    pincode,
    referal,
  } = req.body;

  try {

    if(phone.length<10 || phone.length>10 || !Number.isInteger(Number(phone))){
      return res.status(400).json({message:`${phone} Enter correct phone number`});
    }
    if(age.length<1 || age.length>3 || !Number.isInteger(Number(age))){
      return res.status(400).json({message:`${age} Enter correct age`});
    }
    if(pincode.length<6 || pincode.length>6 || !Number.isInteger(Number(pincode))){
      return res.status(400).json({message:`${pincode} Enter correct pincode`});
    }
    if(!email.includes("@gmail.com")){
      return res.status(400).json({message:`${email} Enter correct email`});
    }
    if(!name || !gender || !age || !phone || !email || !address || !city || !state || !district || !pincode || !referal){
      return res.status(400).json({message:`${name} ${gender} ${age} ${phone} ${email} ${address} ${city} ${state} ${district} ${pincode} ${referal} All fields are required`});
    }

    const[[data]]=await db.query("SELECT * FROM patients WHERE phone = ?",[phone]);
    if(data){
      return res.status(400).json({message:`${phone} Phone number already exists`});
    }

    const[[data1]]=await db.query("SELECT * FROM patients WHERE email = ?",[email]);
    if(data1){
      return res.status(400).json({message:`${email} Email already exists`});
    }
    const sql = `
      INSERT INTO patients 
      (name, gender, age, phone, email, address, city, state, district, pincode, referal) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name,
      gender,
      age,
      phone,
      email,
      address,
      city,
      state,
      district,
      pincode,
      referal,
    ]);

    res.status(201).json({
      message: "Patient added successfully",
      patientId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating patient" });
  }
};

// ✅ Get All Patients
exports.getPatients = async (req, res) => {
  try {
    const sql = "SELECT  * FROM patients ORDER BY id DESC LIMIT 5";
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching patients" });
  }
};

// ✅ Get Patient By ID
exports.getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "SELECT * FROM patients WHERE id = ? ";
    const [result] = await db.query(sql, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching patient" });
  }
};

exports.countPatients = async (req, res) => {
  try {
    const sql = "SELECT COUNT(*) as total_patient FROM patients";
    const [[result]] = await db.query(sql);
    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error counting patients" });
  }
};

exports.addReferal=async(req,res)=>{
  const {name,designation,city}=req.body;
  try{
    if(!name || !designation || !city){
      return res.status(400).json({message:`${name} ${designation} ${city} All fields are required`});
    }
    if(name.length<2){
      return res.status(400).json({message:`${name} Enter correct name`});
    }
    if(designation.length<2){
      return res.status(400).json({message:`${designation} Enter correct designation`});
    }
    if(city.length<2){
      return res.status(400).json({message:`${city} Enter correct city`});
    }

    const [[existingReferalData]] = await db.query("SELECT * FROM referal WHERE name = ? AND designation = ? AND city = ?", [name, designation, city]);
    if(existingReferalData){
      return res.status(400).json({message:`${name} ${designation} ${city} Referal already exists`});
    }
    const sql=`INSERT INTO referal (name,designation,city) VALUES (?,?,?)`;
    const [result]=await db.query(sql,[name,designation,city]);
    res.status(201).json({message:"Referal added successfully",referalId:result.insertId,data:result});
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Error adding referal" });
  }
}

exports.getReferal=async(req,res)=>{
  try{
    const sql=`SELECT * FROM referal`;
    const [result]=await db.query(sql);
    res.status(200).json({message:"Referal fetched successfully",data:result});
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Error fetching referal" });
  }
}
