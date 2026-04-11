import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Loader2, Save, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { TiTick } from "react-icons/ti";

import axios from "axios";

export default function SampleAccession() {
  const navigate = useNavigate();
  const api = "http://localhost:8060";

  const [accessions, setAccessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAccessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${api}/api/bill/get-accession`, {
        params: { startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAccessions(res.data.data);
      } else {
        setError("Failed to fetch accessions");
      }
    } catch (err) {
      console.error("Error fetching accessions:", err);
      setError(err.response?.data?.message || "An error occurred fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessions();
  }, [startDate, endDate]);

  const handleUpdate = async (id, status, remark) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${api}/api/bill/update-accession/${id}`, 
        { report_status: status, remark: remark },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optional: show a success toast
      fetchAccessions();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update accession");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel/delete this accession?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${api}/api/bill/delete-accession/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccessions();
    } catch (err) {
      console.error("Deletion failed:", err);
      alert("Failed to delete accession");
    }
  };

  const handleInputChange = (id, field, value) => {
    setAccessions(accessions.map(acc => 
      acc.accession_id === id ? { ...acc, [field]: value } : acc
    ));
  };

  const filteredAccessions = accessions.filter((acc) => {
    const query = searchQuery.toLowerCase();
    return (
      (acc.name && acc.name.toLowerCase().includes(query)) ||
      (acc.accession_number && acc.accession_number.toLowerCase().includes(query)) ||
      (acc.patient_id && String(acc.patient_id).toLowerCase().includes(query))
    );
  });

  let index = 1;
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-medium">Loading Accessions...</p>
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
                Sample Accession <span className="text-violet-500">Management</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100 text-indigo-700">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm whitespace-nowrap">
              {filteredAccessions.length} Records Found
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full transition-all"
              placeholder="Search patient, accession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">S.No</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Accession Number</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Details</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks</th>
                  <th className="py-5 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccessions.length > 0 ? (
                  filteredAccessions.map((acc) => (
                    <tr key={acc.accession_id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-5 px-6">
                        <span className="text-sm font-bold text-slate-900">{index++}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="inline-flex items-center gap-2 text-violet-500 px-3 py-1.5 rounded-lg font-sans text-sm font-bold">
                          {acc.accession_number}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-base uppercase font-bold text-slate-900">{acc.name}</span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">ID: {acc.patient_id}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <select
                          value={acc.report_status}
                          onChange={(e) => handleInputChange(acc.accession_id, 'report_status', e.target.value)}
                          className={`text-sm font-bold py-2 px-3 rounded-xl border appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                            acc.report_status === 'Pending' 
                            ? 'bg-amber-50 border-amber-200 text-amber-700' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Sample Dispatched">Sample Dispatched</option>
                        </select>
                      </td>
                      <td className="py-5 px-6">
                        <input
                          type="text"
                          value={acc.remark || ""}
                          onChange={(e) => handleInputChange(acc.accession_id, 'remark', e.target.value)}
                          placeholder="Add remark..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                        />
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdate(acc.accession_id, acc.report_status, acc.remark)}
                            disabled={updatingId === acc.accession_id}
                            className={`p-2.5 rounded-xl transition-all border ${
                              updatingId === acc.accession_id 
                              ? 'bg-slate-50 border-slate-200 text-slate-400' 
                              : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                            }`}
                            title="Update Record"
                          >
                            {updatingId === acc.accession_id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <TiTick className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(acc.accession_id)}
                            className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                            title="Cancel Accession"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-full">
                          <Search className="w-12 h-12 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-slate-800">No records found</p>
                          <p className="text-slate-500 font-medium">Try adjusting your filters or complete a registration</p>
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
}
