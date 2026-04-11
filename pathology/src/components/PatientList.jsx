import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const api = "http://localhost:8060";

  useEffect(() => {
    async function fetchPatients() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${api}/api/patient/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatients(res.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching patients");
      }
    }

    fetchPatients();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Patient List
      </h1>
     <button
    onClick={() => navigate("/home/patientRegister")}
    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:cursor-pointer"
  >
    Registration
  </button>
  </div>
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Referal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.phone}</td>
                <td className="px-4 py-3">{p.city}</td>
                <td className="px-4 py-3">{p.referal}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                    Pending
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      navigate(`/home/billPatient/${p.id}`)
                    }
                    className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Bill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}