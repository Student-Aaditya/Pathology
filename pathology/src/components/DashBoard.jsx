import { Users, FileText, Activity, TestTube, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Dashboard() {
  const [patient, setPatient] = useState([]);
  const [count, setCount] = useState([]);
  const [pending, setPending] = useState([]);
  const [testConducted,setTestConducted] = useState([]);
  const api = "http://localhost:8060";
  // 🔹 Dummy Data (max 10)
  const patients = [
    { id: 1, name: "Aaditya Kumar", status: "Active", date: "2026-03-25" },
    { id: 2, name: "Rohit Sharma", status: "Inactive", date: "2026-03-24" },
    { id: 3, name: "Neha Singh", status: "Active", date: "2026-03-23" },
    { id: 4, name: "Aman Verma", status: "Active", date: "2026-03-22" },
    { id: 5, name: "Priya Patel", status: "Inactive", date: "2026-03-21" },
  ];

  const tests = [
    { id: 1, test: "Blood Test", patient: "Aaditya", date: "2026-03-25" },
    { id: 2, test: "X-Ray", patient: "Rohit", date: "2026-03-24" },
    { id: 3, test: "MRI", patient: "Neha", date: "2026-03-23" },
  ];

  const reports = [
    { id: 1, patient: "Aaditya", status: "Pending" },
    { id: 2, patient: "Rohit", status: "Pending" },
    { id: 3, patient: "Neha", status: "Pending" },
  ];

  const billing = [
    { id: 1, patient: "Aaditya", amount: "₹1200", status: "Paid" },
    { id: 2, patient: "Rohit", amount: "₹800", status: "Pending" },
    { id: 3, patient: "Neha", amount: "₹1500", status: "Paid" },
  ];
  useEffect(() => {
    async function PatientData() {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/api/patient/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatient(response.data);
    }
    PatientData();
  }, []);
  useEffect(() => {
    async function count_PendingBill() {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/api/bill/count-pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPending(response.data.data);
    }
    count_PendingBill();
  }, []);

  useEffect(() => {
    async function CountData() {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/api/patient/count`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setCount(response.data.data.total_patient);
    }
    CountData();
  }, []);
  useEffect(()=>{
    async function count_TestConducted() {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${api}/api/bill/count-test-conducted`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setTestConducted(response.data.data);
    }
    count_TestConducted();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-12 py-6 shadow-lg rounded-xl m-4 ml-7 border-b border-violet-500">
        <h1 className="text-3xl font-bold text-gray-800">
          Pathology <span className="text-violet-500">Dashboard</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back to Trego Lab Management
        </p>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/*Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 hover:cursor-pointer ">
          <Card
            icon={<Users size={24} />}
            title="Total Patients"
            date={new Date().toISOString().split("T")[0]}
            value={count}
            color="blue"
          />
          <Card
            icon={<TestTube size={24} />}
            title="Tests Conducted"
            date={new Date().toISOString().split("T")[0]}
            value={testConducted}
            color="purple"
          />
          <Card
            icon={<FileText size={24} />}
            title="Today Pending"
            date={new Date().toISOString().split("T")[0]}
            value="45"
            color="orange"
          />
          <Card
            icon={<Activity size={24} />}
            title="Total Pending"
            date={new Date().toISOString().split("T")[0]}
            value={pending}
            color="green"
          />
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patients Table */}
          {/* <TableCard title="Recent Patients">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Gender</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patient.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-sm font-medium text-gray-700">{p.name}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.gender === "Male"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.gender}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{new Date(p.created_at).toISOString().split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard> */}

          {/* Tests Table */}
          <TableCard title="Recent Tests">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Test</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tests.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                      {t.test}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {t.patient}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {t.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          {/* Reports Table */}
          <TableCard title="Today Pending">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                      {r.patient}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          {/* Billing Table */}
          <TableCard title="Billing Summary">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {billing.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                      {b.patient}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">
                      {b.amount}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          b.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Reusable Card */
function Card({ icon, title, value, color, date }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5 hover:shadow-md transition hover:border-violet-400">
      <div className={`p-4 rounded-xl ${colors[color] || colors.blue}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-900 text-lg  font-bold">{title}</p>
        <p className="text-gray-500 text-sm  font-medium">{date}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}

/* 🔹 Table Wrapper */
function TableCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
