// import React from "react";

// const data = [
//   {
//     id: 1,
//     accession: "AA0500",
//     patient: "Ankit",
//     age: 32,
//     referral: "Dr. Amit Roy",
//     test: "CBC",
//     status: "Sample Not Collected",
//     remark: "Leaved",
//   },
//   {
//     id: 2,
//     accession: "AA0500",
//     patient: "Ankit",
//     age: 32,
//     referral: "Dr. Amit Roy",
//     test: "Glucose",
//     status: "Sample Collected",
//     remark: "N/A",
//   },
// ];

// const getStatusColor = (status) => {
//   switch (status) {
//     case "Sample Not Collected":
//       return "bg-red-100 text-red-600";
//     case "Sample Collected":
//       return "bg-green-100 text-green-600";
//     case "Report Generated":
//       return "bg-blue-100 text-blue-600";
//     case "Report Signed":
//       return "bg-purple-100 text-purple-600";
//     case "Ready to Print":
//       return "bg-yellow-100 text-yellow-600";
//     default:
//       return "bg-gray-100 text-gray-600";
//   }
// };

// const OperationTable = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Operation Table</h1>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">S.No</th>
//               <th className="p-2 border">Accession No</th>
//               <th className="p-2 border">Patient</th>
//               <th className="p-2 border">Age</th>
//               <th className="p-2 border">Referral</th>
//               <th className="p-2 border">Test</th>
//               <th className="p-2 border">Report Status</th>
//               <th className="p-2 border">Remark</th>
//               <th className="p-2 border">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((item, index) => (
//               <tr key={item.id} className="text-center hover:bg-gray-50">
//                 <td className="p-2 border">{index + 1}</td>
//                 <td className="p-2 border">{item.accession}</td>
//                 <td className="p-2 border">{item.patient}</td>
//                 <td className="p-2 border">{item.age}</td>
//                 <td className="p-2 border">{item.referral}</td>
//                 <td className="p-2 border">{item.test}</td>

//                 {/* STATUS */}
//                 <td className="p-2 border">
//                   <span
//                     className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
//                       item.status
//                     )}`}
//                   >
//                     {item.status}
//                   </span>
//                 </td>

//                 <td className="p-2 border">{item.remark}</td>

//                 {/* ACTION */}
//                 <td className="p-2 border">
//                   <select className="border rounded px-2 py-1 text-sm">
//                     <option>Action</option>
//                     <option>Cancel</option>
//                     <option>Repeat Sample</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OperationTable;

import React, { useEffect, useState } from "react";
import axios from "axios";

const statusOptions = [
  "Sample Not Collected",
  "Sample Collected",
  "Report Generated",
  "Report Signed",
  "Ready to Print",
];

const Finance = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:8060/api/operation");
    setData(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };
  const toggleRemarkInput = (index) => {
    const updated = [...data];
    updated[index].showRemarkInput = !updated[index].showRemarkInput;
    setData(updated);
  };
  const handleSave = async (row) => {
    await axios.post("http://localhost:8060/api/operation", {
      patient_id: row.patient_id,
      accession_id: row.accession_id,
      report_status: row.report_status,
      remark: row.remark,
    });

    alert("Saved");
  };
  let count=1;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Operation Table</h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">S.No</th>
            <th className="border p-2">Accession</th>
            <th className="border p-2">Patient</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Referral</th>
            <th className="border p-2">Tests</th>
            <th className="border p-2">Sample</th>
            <th className="border p-2">Report Status</th>
            <th className="border p-2">Remark</th>
          </tr>
        </thead>

        {/* <tbody>
          {data.map((row, index) => (
          
            <tr key={row.accession_id}>
              <td className="border p-2">{index+1}</td>
              <td className="border p-2">{row.accession_number}</td>
              <td className="border p-2">{row.name}</td>
              <td className="border p-2">{row.age}</td>
              <td className="border p-2">{row.referal}</td>

              <td className="border p-2">
                {row.tests.map((test, i) => (
                  <div key={i} className="text-sm">
                    {i+1}. {test}
                  </div>
                ))}
              </td>

              <td className="border p-2 ml-10  justify-center">
                 {row.report_status}
          
              </td>

              <td className="border p-2">
                {!row.showRemarkInput ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">
                      {row.remark || "No remark"}
                    </span>

                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      className="border p-1 text-sm"
                      placeholder="Enter remark"
                      value={row.remark || ""}
                      onChange={(e) =>
                        handleChange(index, "remark", e.target.value)
                      }
                    />

                    <button
                      onClick={() => toggleRemarkInput(index)}
                      className="text-green-600 text-xs"
                    >
                      
                    </button>
                  </div>
                )}
              </td>

              <td className="border p-2">
                <button
                  onClick={() => handleSave(row)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  view
                </button>
              </td>
            </tr>
          ))}
        </tbody> */}
        <tbody>
  {data.map((row, index) =>
    row.tests.map((test, i) => (  
      <tr >
        <td className="border p-2">{count++}</td>
        <td className="border p-2">{row.accession_number}</td>
        <td className="border p-2">{row.name}</td>
        <td className="border p-2">{row.age}</td>
        <td className="border p-2">{row.referal}</td>

        {/* TEST */}
        <td className="border p-2">{test}</td>
        <td className="border p-2">{row.test_sample}</td>
        {/* STATUS */}
        <td className="border p-2">{row.report_status}</td>

        {/* REMARK */}
        <td className="border p-2">
          {row.remark || "No remark"}
        </td>

       

      </tr>
    ))
  )}
</tbody>
      </table>
    </div>
  );
};

export default Finance;
