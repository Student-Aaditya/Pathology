// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// export default function Register() {
//   const api = "http://localhost:8060";
//   const initialState = {
//     search: "",
//     name: "",
//     gender: "",
//     age: "",
//     phone: "",
//     email: "",
//     address: "",
//     city: "",
//     state: "",
//     district: "",
//     pincode: "",
//     referal: "",
//   };

//   const locationData = {
//     "Andhra Pradesh": {
//       districts: ["Visakhapatnam", "Vijayawada"],
//       cities: ["Visakhapatnam"],
//     },
//     Assam: { districts: ["Kamrup Metro"], cities: ["Guwahati"] },
//     Bihar: {
//       districts: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
//       cities: ["Patna"],
//     },
//     Chandigarh: { districts: ["Chandigarh"], cities: ["Chandigarh"] },
//     Chhattisgarh: {
//       districts: ["Raipur", "Bilaspur", "Durg"],
//       cities: ["Raipur", "Bilaspur"],
//     },
//     Delhi: {
//       districts: [
//         "Central Delhi",
//         "East Delhi",
//         "New Delhi",
//         "North Delhi",
//         "South Delhi",
//         "West Delhi",
//       ],
//       cities: ["Delhi", "New Delhi"],
//     },
//     Gujarat: {
//       districts: [
//         "Ahmedabad",
//         "Surat",
//         "Vadodara",
//         "Rajkot",
//         "Bhavnagar",
//         "Jamnagar",
//       ],
//       cities: [
//         "Ahmedabad",
//         "Surat",
//         "Vadodara",
//         "Rajkot",
//         "Bhavnagar",
//         "Jamnagar",
//       ],
//     },
//     Haryana: {
//       districts: ["Gurgaon", "Faridabad", "Panipat", "Karnal", "Hisar"],
//       cities: ["Gurgaon", "Faridabad", "Panipat", "Karnal", "Hisar"],
//     },
//     "Himachal Pradesh": { districts: ["Shimla"], cities: ["Shimla"] },
//     "Jammu and Kashmir": { districts: ["Jammu"], cities: ["Jammu"] },
//     Jharkhand: {
//       districts: ["Ranchi", "East Singhbhum", "Dhanbad"],
//       cities: ["Ranchi", "Jamshedpur", "Dhanbad"],
//     },
//     Karnataka: {
//       districts: [
//         "Bangalore Urban",
//         "Mysore",
//         "Dakshina Kannada",
//         "Dharwad",
//         "Belagavi",
//       ],
//       cities: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
//     },
//     Kerala: {
//       districts: ["Thiruvananthapuram", "Ernakulam", "Kozhikode"],
//       cities: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
//     },
//     "Madhya Pradesh": {
//       districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
//       cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
//     },
//     Maharashtra: {
//       districts: [
//         "Mumbai",
//         "Pune",
//         "Nagpur",
//         "Nashik",
//         "Thane",
//         "Aurangabad",
//         "Solapur",
//         "Kolhapur",
//         "Amravati",
//       ],
//       cities: [
//         "Mumbai",
//         "Pune",
//         "Nagpur",
//         "Nashik",
//         "Aurangabad",
//         "Solapur",
//         "Kolhapur",
//       ],
//     },
//     Meghalaya: { districts: ["East Khasi Hills"], cities: ["Shillong"] },
//     Manipur: { districts: ["Imphal West"], cities: ["Imphal"] },
//     Mizoram: { districts: ["Aizawl"], cities: ["Aizawl"] },
//     Nagaland: { districts: ["Kohima"], cities: ["Kohima"] },
//     Punjab: {
//       districts: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
//       cities: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
//     },
//     Rajasthan: {
//       districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
//       cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
//     },
//     "Tamil Nadu": {
//       districts: [
//         "Chennai",
//         "Coimbatore",
//         "Madurai",
//         "Salem",
//         "Tiruchirappalli",
//         "Erode",
//         "Vellore",
//       ],
//       cities: [
//         "Chennai",
//         "Coimbatore",
//         "Madurai",
//         "Salem",
//         "Tiruchirappalli",
//         "Erode",
//         "Vellore",
//       ],
//     },
//     Telangana: {
//       districts: ["Hyderabad", "Warangal"],
//       cities: ["Hyderabad", "Warangal"],
//     },
//     Tripura: { districts: ["West Tripura"], cities: ["Agartala"] },
//     "Uttar Pradesh": {
//       districts: [
//         "Lucknow",
//         "Kanpur Nagar",
//         "Agra",
//         "Varanasi",
//         "Prayagraj",
//         "Ghaziabad",
//         "Meerut",
//         "Bareilly",
//         "Aligarh",
//         "Gautam Buddha Nagar",
//       ],
//       cities: [
//         "Lucknow",
//         "Kanpur",
//         "Agra",
//         "Varanasi",
//         "Prayagraj",
//         "Ghaziabad",
//         "Meerut",
//         "Bareilly",
//         "Aligarh",
//         "Noida",
//       ],
//     },
//     Uttarakhand: {
//       districts: ["Dehradun", "Haridwar"],
//       cities: ["Dehradun", "Haridwar"],
//     },
//     "West Bengal": {
//       districts: ["Kolkata", "Howrah", "Darjeeling", "Paschim Bardhaman"],
//       cities: ["Kolkata", "Asansol", "Siliguri"],
//     },
//   };

//   const stateList = Object.keys(locationData).sort();

//   const Navigate = useNavigate();
//   const [form, setForm] = useState(initialState);

//   const [referralList, setReferralList] = useState([
//     "Self",
//     "Local Doctor",
//     "External Clinic",
//   ]);
//   const [showAddReferral, setShowAddReferral] = useState(false);
//   const [newReferral, setNewReferral] = useState({
//     name: "",
//     designation: "",
//     city: "",
//   });

//   useEffect(() => {
//     const fetchReferal = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`${api}/api/patient/getReferal`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setReferralList(response.data.data);
//       } catch (error) {
//         console.error(error);
//         alert(error.response?.data?.message || "Error fetching referal");
//       }
//     };
//     fetchReferal();
//   }, []);
//   // const handleAddReferral = () => {
//   //   if (newReferral.trim()) {
//   //     setReferralList([...referralList, newReferral.trim()]);
//   //     setForm({ ...form, referal: newReferral.trim() });
//   //     setNewReferral("");
//   //     setShowAddReferral(false);
//   //   }
//   // };
//   const addReferal = async () => {
//     try {
//       const token = localStorage.getItem("token");
  
//       const response = await axios.post(
//         `${api}/api/patient/addReferal`,
//         {
//           name: newReferral.name,
//           designation: newReferral.designation,
//           city: newReferral.city,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (response.data) {
//         // Refresh the list from backend to get the latest data
//         const refreshResponse = await axios.get(`${api}/api/patient/getReferal`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setReferralList(refreshResponse.data.data);
        
//         // Success notification and UI reset
//         alert("Referral added successfully");
//         setShowAddReferral(false);
//         setNewReferral({ name: "", designation: "", city: "" });
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Error adding referal");
//     }
//   };
//   const handleClear = () => {
//     setForm(initialState);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "state") {
//       setForm({ ...form, state: value, city: "", district: "" });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e, shouldRedirect = false) => {
//     if (e) e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(`${api}/api/patient/add`, form, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const patientId = response.data.patientId;
//       alert(response.data.message);

//       if (shouldRedirect && patientId) {
//         Navigate(`/home/billPatient/${patientId}`);
//       } else {
//         Navigate("/home/patient-list");
//         handleClear();
//       }
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.message || "Error registering patient");
//     }
//   };

//   const inputStyle =
//     "w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition";

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-4xl font-semibold text-blue-500 mb-6 ml-8">
//           {" "}
//           Patient Data
//         </h1>
//         <div className="flex gap-4 mb-6 ml-8">
//           <button
//             onClick={() => Navigate("/home/patientRegister")}
//             className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:cursor-pointer"
//           >
//             Registration
//           </button>

//           <button
//             onClick={() => Navigate("/home/patient-list")}
//             className="px-5 py-2 bg-green-600 text-white rounded-lg hover:cursor-pointer"
//           >
//             Patient List
//           </button>
//         </div>
//       </div>
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8"
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//           Patient Registration
//         </h2>

//         {/* 🧍 Basic Info */}
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold text-gray-600 mb-4 border-b pb-2">
//             Basic Information
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div>
//               <label className="label">Full Name</label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* ... gender ... */}
//             <div>
//               <label className="label">Gender</label>
//               <select
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option>Male</option>
//                 <option>Female</option>
//                 <option>Other</option>
//               </select>
//             </div>

//             <div>
//               <label className="label">Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 value={form.age}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//               />
//             </div>

//             <div>
//               <label className="label">Phone</label>
//               <input
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 required
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="label">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className={inputStyle}
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="label">Referral</label>
//               {!showAddReferral ? (
//                 <div className="flex gap-4">
//                   <select
//                     name="referal"
//                     value={form.referal}
//                     onChange={handleChange}
//                     className={inputStyle}
//                   >
//                     <option value="">Select Referral</option>
//                     {referralList.map((ref, index) => (
//                       <option key={index} value={ref.name}>
//                         {ref.name}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     type="button"
//                     onClick={() => setShowAddReferral(true)}
//                     className="px-4 py-2 bg-red-400 text-white font-medium rounded-lg hover:bg-red-500 transition shrink-0"
//                   >
//                     Add
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex gap-4">
//                   <input
//                     value={newReferral.name}
//                     onChange={(e) =>
//                       setNewReferral({ ...newReferral, name: e.target.value })
//                     }
//                     placeholder="Enter new referral name"
//                     className={inputStyle}
//                   />
//                   <input
//                     value={newReferral.designation}
//                     onChange={(e) =>
//                       setNewReferral({
//                         ...newReferral,
//                         designation: e.target.value,
//                       })
//                     }
//                     placeholder="Enter new referral designation"
//                     className={inputStyle}
//                   />
//                   <input
//                     value={newReferral.city}
//                     onChange={(e) =>
//                       setNewReferral({ ...newReferral, city: e.target.value })
//                     }
//                     placeholder="Enter new referral city"
//                     className={inputStyle}
//                   />
//                   <button
//                     type="button"
//                     onClick={addReferal}
//                     className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shrink-0"
//                   >
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowAddReferral(false);
//                       setNewReferral({ name: "", designation: "", city: "" });
//                     }}
//                     className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition shrink-0"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* 🏠 Address */}
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold text-gray-600 mb-4 border-b pb-2">
//             Address Details
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="md:col-span-2">
//               <label className="label">Full Address</label>
//               <textarea
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 className={inputStyle}
//               />
//             </div>

//             <div>
//               <label className="label">State</label>
//               <select
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//                 className={inputStyle}
//               >
//                 <option value="">Select State</option>
//                 {stateList.map((state, index) => (
//                   <option key={index} value={state}>
//                     {state}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="label">District</label>
//               <select
//                 name="district"
//                 value={form.district}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 disabled={!form.state}
//               >
//                 <option value="">Select District</option>
//                 {(form.state && locationData[form.state]?.districts
//                   ? locationData[form.state].districts
//                   : []
//                 ).map((district, index) => (
//                   <option key={index} value={district}>
//                     {district}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="label">City</label>
//               <select
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//                 className={inputStyle}
//                 disabled={!form.state}
//               >
//                 <option value="">Select City</option>
//                 {(form.state && locationData[form.state]?.cities
//                   ? locationData[form.state].cities
//                   : []
//                 ).map((city, index) => (
//                   <option key={index} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="label">Pincode</label>
//               <input
//                 name="pincode"
//                 value={form.pincode}
//                 onChange={handleChange}
//                 className={inputStyle}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-between items-center">
//           <button
//             type="button"
//             onClick={handleClear}
//             className="px-5 py-2.5 border rounded-lg hover:bg-gray-100 transition"
//           >
//             Clear
//           </button>

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//             >
//               Register
//             </button>

//             <button
//               type="button"
//               onClick={() => handleSubmit(null, true)}
//               className="px-6 py-2.5 bg-green-600 text-white rounded-lg shadow hover:cursor-pointer hover:bg-green-700 transition"
//             >
//               Register & Bill
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Tailwind reusable label */}
//       <style>
//         {`
//           .label {
//             display: block;
//             font-size: 14px;
//             font-weight: 500;
//             margin-bottom: 6px;
//             color: #374151;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

import { useState ,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const locationData = {
  "Andhra Pradesh": { districts: ["Visakhapatnam", "Vijayawada"], cities: ["Visakhapatnam"] },
  Assam: { districts: ["Kamrup Metro"], cities: ["Guwahati"] },
  Bihar: { districts: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"], cities: ["Patna"] },
  Chandigarh: { districts: ["Chandigarh"], cities: ["Chandigarh"] },
  Chhattisgarh: { districts: ["Raipur", "Bilaspur", "Durg"], cities: ["Raipur", "Bilaspur"] },
  Delhi: {
    districts: [
      "Central Delhi",
      "East Delhi",
      "New Delhi",
      "North Delhi",
      "South Delhi",
      "West Delhi",
    ],
    cities: ["Delhi", "New Delhi"],
  },
  Gujarat: {
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  },
  Haryana: {
    districts: ["Gurgaon", "Faridabad", "Panipat", "Karnal", "Hisar"],
    cities: ["Gurgaon", "Faridabad", "Panipat", "Karnal", "Hisar"],
  },
  "Himachal Pradesh": { districts: ["Shimla"], cities: ["Shimla"] },
  "Jammu and Kashmir": { districts: ["Jammu"], cities: ["Jammu"] },
  Jharkhand: {
    districts: ["Ranchi", "East Singhbhum", "Dhanbad"],
    cities: ["Ranchi", "Jamshedpur", "Dhanbad"],
  },
  Karnataka: {
    districts: ["Bangalore Urban", "Mysore", "Dakshina Kannada", "Dharwad", "Belagavi"],
    cities: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  },
  Kerala: {
    districts: ["Thiruvananthapuram", "Ernakulam", "Kozhikode"],
    cities: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  },
  "Madhya Pradesh": {
    districts: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  },
  Maharashtra: {
    districts: [
      "Mumbai",
      "Pune",
      "Nagpur",
      "Nashik",
      "Thane",
      "Aurangabad",
      "Solapur",
      "Kolhapur",
      "Amravati",
    ],
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur"],
  },
  Meghalaya: { districts: ["East Khasi Hills"], cities: ["Shillong"] },
  Manipur: { districts: ["Imphal West"], cities: ["Imphal"] },
  Mizoram: { districts: ["Aizawl"], cities: ["Aizawl"] },
  Nagaland: { districts: ["Kohima"], cities: ["Kohima"] },
  Punjab: {
    districts: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
    cities: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  },
  Rajasthan: {
    districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
    cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  },
  "Tamil Nadu": {
    districts: [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Salem",
      "Tiruchirappalli",
      "Erode",
      "Vellore",
    ],
    cities: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Erode", "Vellore"],
  },
  Telangana: { districts: ["Hyderabad", "Warangal"], cities: ["Hyderabad", "Warangal"] },
  Tripura: { districts: ["West Tripura"], cities: ["Agartala"] },
  "Uttar Pradesh": {
    districts: [
      "Lucknow",
      "Kanpur Nagar",
      "Agra",
      "Varanasi",
      "Prayagraj",
      "Ghaziabad",
      "Meerut",
      "Bareilly",
      "Aligarh",
      "Gautam Buddha Nagar",
    ],
    cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Ghaziabad", "Meerut", "Bareilly", "Aligarh", "Noida"],
  },
  Uttarakhand: { districts: ["Dehradun", "Haridwar"], cities: ["Dehradun", "Haridwar"] },
  "West Bengal": {
    districts: ["Kolkata", "Howrah", "Darjeeling", "Paschim Bardhaman"],
    cities: ["Kolkata", "Asansol", "Siliguri"],
  },
};

const stateList = Object.keys(locationData).sort();

const inputStyle =
  "w-full rounded-2xl border border-[#E9D5FF] bg-[#FCFBFF] px-4 py-3 text-sm text-[#1E1B4B] outline-none transition placeholder:text-[#1E1B4B]/35 focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#8B5CF6]/10 disabled:cursor-not-allowed disabled:opacity-70";

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#1E1B4B]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Register() {
  const api = "http://localhost:8060";
  const initialState = {
    search: "",
    name: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    district: "",
    pincode: "",
    referal: "",
  };

  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [referralList, setReferralList] = useState([
    "Self",
    "Local Doctor",
    "External Clinic",
  ]);
  const [showAddReferral, setShowAddReferral] = useState(false);
  const [newReferral, setNewReferral] = useState("");

  const handleAddReferral = () => {
    if (newReferral.trim()) {
      setReferralList([...referralList, newReferral.trim()]);
      setForm({ ...form, referal: newReferral.trim() });
      setNewReferral("");
      setShowAddReferral(false);
    }
  };

  const handleClear = () => {
    setForm(initialState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setForm({ ...form, state: value, city: "", district: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e, shouldRedirect = false) => {
    if (e) e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${api}/api/patient/add`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const patientId = response.data.patientId;
      alert(response.data.message);

      if (shouldRedirect && patientId) {
        navigate(`/home/billPatient/${patientId}`);
      } else {
        navigate("/home/patient-list");
        handleClear();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error registering patient");
    }
  };
   const addReferal = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        `${api}/api/patient/addReferal`,
        {
          name: newReferral.name,
          designation: newReferral.designation,
          city: newReferral.city,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data) {
        // Refresh the list from backend to get the latest data
        const refreshResponse = await axios.get(`${api}/api/patient/getReferal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReferralList(refreshResponse.data.data);
        
        // Success notification and UI reset
        alert("Referral added successfully");
        setShowAddReferral(false);
        setNewReferral({ name: "", designation: "", city: "" });
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error adding referal");
    }
  };
   useEffect(() => {
    const fetchReferal = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${api}/api/patient/getReferal`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReferralList(response.data.data);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Error fetching referal");
      }
    };
    fetchReferal();
  }, []);

  return (
    <div className="min-h-full rounded-[28px] bg-[linear-gradient(180deg,_rgba(245,243,255,0.92)_0%,_#ffffff_100%)] p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          {/* <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8B5CF6]">
            Patient Desk
          </p> */}
          <h1 className="mt-2 text-3xl font-semibold text-[#1E1B4B]">
            Patient Registration
          </h1>
         
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/home/patientRegister")}
            className="rounded-2xl bg-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(139,92,246,0.22)] transition hover:bg-[#7C3AED]"
          >
            Registration
          </button>
          <button
            type="button"
            onClick={() => navigate("/home/patient-list")}
            className="rounded-2xl border border-[#E9D5FF] bg-white px-5 py-3 text-sm font-semibold text-[#1E1B4B] transition hover:bg-[#F5F3FF]"
          >
            Patient List
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-[#E9D5FF] bg-white p-6 shadow-[0_24px_60px_rgba(139,92,246,0.08)] md:p-8 grid grid-cols-1"
      >
        <div className="grid grid-cols-1 gap-6 ">
          <section className="rounded-[28px] border border-[#E9D5FF] bg-[#FCFBFF] p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#1E1B4B]">
                Basic Information
              </h2>
              <p className="mt-2 text-sm text-[#1E1B4B]/65">
                Add patient identity and contact details for registration.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField label="Full Name">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </FormField>

              <FormField label="Gender">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </FormField>

              <FormField label="Age">
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </FormField>

              <FormField label="Phone">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Email">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </FormField>
              </div>

             <div className="md:col-span-2">
             <label className="label">Referral</label>
              {!showAddReferral ? (
                <div className="flex gap-4">
                  <select
                    name="referal"
                    value={form.referal}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">Select Referral</option>
                    {referralList.map((ref, index) => (
                      <option key={index} value={ref.name}>
                        {ref.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddReferral(true)}
                    className="px-4 py-2 bg-red-400 text-white font-medium rounded-lg hover:bg-red-500 transition shrink-0"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <input
                    value={newReferral.name}
                    onChange={(e) =>
                      setNewReferral({ ...newReferral, name: e.target.value })
                    }
                    placeholder="Enter new referral name"
                    className={inputStyle}
                  />
                  <input
                    value={newReferral.designation}
                    onChange={(e) =>
                      setNewReferral({
                        ...newReferral,
                        designation: e.target.value,
                      })
                    }
                    placeholder="Enter new referral designation"
                    className={inputStyle}
                  />
                  <input
                    value={newReferral.city}
                    onChange={(e) =>
                      setNewReferral({ ...newReferral, city: e.target.value })
                    }
                    placeholder="Enter new referral city"
                    className={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={addReferal}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shrink-0"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddReferral(false);
                      setNewReferral({ name: "", designation: "", city: "" });
                    }}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#E9D5FF] bg-white p-6 shadow-[0_16px_35px_rgba(139,92,246,0.08)]">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#1E1B4B]">
                Address Details
              </h2>
              <p className="mt-2 text-sm text-[#1E1B4B]/65">
                Location details help with reporting, patient lookup, and
                operational coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField label="Full Address">
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className={`${inputStyle} min-h-28 resize-none`}
                  />
                </FormField>
              </div>

              <FormField label="State">
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select State</option>
                  {stateList.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="District">
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className={inputStyle}
                  disabled={!form.state}
                >
                  <option value="">Select District</option>
                  {(form.state && locationData[form.state]?.districts
                    ? locationData[form.state].districts
                    : []
                  ).map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="City">
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={inputStyle}
                  disabled={!form.state}
                >
                  <option value="">Select City</option>
                  {(form.state && locationData[form.state]?.cities
                    ? locationData[form.state].cities
                    : []
                  ).map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Pincode">
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </FormField>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#F5F3FF] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-2xl border border-[#E9D5FF] bg-white px-5 py-3 text-sm font-semibold text-[#1E1B4B] transition hover:bg-[#F5F3FF]"
          >
            Clear
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-2xl border border-[#E9D5FF] bg-[#F5F3FF] px-6 py-3 text-sm font-semibold text-[#8B5CF6] transition hover:bg-[#EDE9FE]"
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(null, true)}
              className="rounded-2xl bg-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(139,92,246,0.22)] transition hover:bg-[#7C3AED]"
            >
              Register & Bill
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}