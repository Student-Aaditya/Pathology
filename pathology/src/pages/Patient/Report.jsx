import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  Printer,
} from "lucide-react";

const statusOptions = [
  "Sample Not Collected",
  "Sample Collected",
  "Report Generated",
  "Report Signed",
  "Ready to Print",
];

const Report = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8060/api/operation`, {
        params: { startDate, endDate },
      });
      if (res.data.success) {
        setData(res.data.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to fetch reports. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleSave = async (row) => {
    try {
      await axios.post("http://localhost:8060/api/operation", {
        patient_id: row.patient_id,
        accession_id: row.accession_id,
        report_status: row.report_status,
        remark: row.remark,
      });
      alert("Changes saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save changes.");
    }
  };

  const handleDownloadInvoice = async (patientId) => {
    try {
      const response = await axios.get(
        `http://localhost:8060/api/bill/invoice-pdf/${patientId}`,
        {
          responseType: "blob", // Important: expecting a binary response
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${patientId}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to download invoice PDF.");
    }
  };

  const filteredData = data.filter((row) => {
    const query = searchQuery.toLowerCase();
    const matchesTests = row.tests.some((test) =>
      test.toLowerCase().includes(query),
    );
    return (
      (row.name && row.name.toLowerCase().includes(query)) ||
      (row.accession_number &&
        row.accession_number.toLowerCase().includes(query)) ||
      (row.patient_id &&
        String(row.patient_id).toLowerCase().includes(query)) ||
      matchesTests
    );
  });

  let count = 1;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-medium">Loading Lab Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Report <span className="text-violet-500">Management</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 text-emerald-700 transition-all">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm whitespace-nowrap uppercase tracking-tighter">
              {filteredData.length} Reports Found
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-100">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-15 text-slate-400" />
              </div>
              <input
                type="text"
                className="pl-14 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full transition-all"
                placeholder="Search patient, accession, test..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
          <div className="flex flex-col ">
            <label className="text-xs font-bold text-slate-900 mb-1 text-center">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-900 mb-1 text-center">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Report Stream Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 ">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-5 px-3 text-left text-[16px] font-bold text-violet-500 uppercase tracking-widest">
                    S.No
                  </th>
                  <th className="py-5 px-3 text-left text-[16px] font-bold text-violet-500 uppercase tracking-widest">
                    Accession
                  </th>
                  <th className="py-5 px-3 text-left text-[16px] font-bold text-violet-500 uppercase tracking-widest">
                    Patient (Detail)
                  </th>
                  <th className="py-5 px-3 text-left text-[16px] font-bold text-violet-500 uppercase tracking-widest">
                    Referral
                  </th>
                  <th className="py-5 px-3 text-left text-[16px] font-bold text-violet-500 uppercase tracking-widest">
                    Tests & Samples
                  </th>
                  <th className="py-5 px-3 text-left text-[16px] font-bold text-violet-500 uppercase tracking-widest">
                    Report Status
                  </th>
                  <th className="py-5 px-3 text-left text-[16px] font-bold text-violet-500 uppercase tracking-widest">
                    Remark
                  </th>
                  <th className="py-5 px-3 text-[16px] font-bold text-violet-500 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((row) =>
                    row.tests.map((test, i) => (
                      <tr
                        key={`${row.accession_id}-${i}`}
                        className="hover:bg-slate-50/30 transition-all group"
                      >
                        <td className="py-5 px-6">
                          <span className="text-lg font-bold text-slate-900">
                            {count++}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="items-center gap-2  text-violet-500 px-3 py-1 rounded-lg font-sans text-[14px] font-bold tracking-tighter">
                            {row.accession_number}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 uppercase">
                              {row.name}
                            </span>
                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">
                              Age: {row.age} / PID: {row.patient_id}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className="text-sm  text-slate-900">
                            {row.referal}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-bold text-slate-700">
                              {test}
                            </span>
                            <span className="text-[14px]     px-2 py-0.5 rounded w-fit ">
                              & {row.test_sample}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <select
                            value={row.report_status}
                            onChange={(e) =>
                              handleChange(
                                data.indexOf(row),
                                "report_status",
                                e.target.value,
                              )
                            }
                            className={`text-[12px] font-black py-1 px-2 rounded-xl border  cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none transition-all uppercase tracking-widest ${
                              row.report_status === "Sample Dispatched"
                                ? "bg-amber-50 border-amber-100 text-amber-600"
                                : "bg-emerald-50 border-emerald-100 text-emerald-600"
                            }`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-5 px-6">
                          <input
                            type="text"
                            value={row.remark || ""}
                            onChange={(e) =>
                              handleChange(
                                data.indexOf(row),
                                "remark",
                                e.target.value,
                              )
                            }
                            placeholder="Remark..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-1 text-[14px] text-slate-700 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-slate-300 font-medium italic"
                          />
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              // onClick={() => navigate(`/home/bill-invoice/${row.patient_id}`)}
                              className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:scale-105"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              // onClick={() => handleDownloadInvoice(row.patient_id)}
                              className="p-2.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm group-hover:scale-105"
                              title="Download Invoice"
                            >
                              <Printer className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )),
                  )
                ) : (
                  <tr>
                    <td colSpan="8" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-full">
                          <Search className="w-12 h-12 text-slate-200" />
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-800 tracking-tight">
                            No reports found
                          </p>
                          <p className="text-slate-400 font-bold text-sm uppercase mt-1">
                            Try adjusting your filters
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
