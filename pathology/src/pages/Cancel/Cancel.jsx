import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  XCircle, 
  Search, 
  Calendar, 
  Loader2, 
  AlertCircle,
  FileText,
  Trash2
} from "lucide-react";

const Cancel = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8060/api/finance/bill", {
        params: { startDate, endDate }
      });
      if (res.data.success) {
        setBills(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching bills for cancellation:", err);
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [startDate, endDate]);

  const handleCancelBill = async (billId) => {
    if (!window.confirm(`Are you sure you want to CANCEL Bill #${billId}? This action might be irreversible.`)) return;
    
    try {
      
      await axios.delete(`http://localhost:8060/api/bill/delete-bill/${billId}`); 
      alert("Bill Cancelled Successfully");
      fetchBills();
    } catch (err) {
      console.error("Cancellation failed:", err);
      alert("Failed to cancel bill. Please try again.");
    }
  };

  const filteredBills = bills.filter((b) => {
    const query = searchQuery.toLowerCase();
    return (
      (b.patientName && b.patientName.toLowerCase().includes(query)) ||
      (b.bill_id && String(b.bill_id).toLowerCase().includes(query)) ||
      (b.Tests && b.Tests.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-rose-600" />
          <p className="text-slate-500 font-medium">Loading Records...</p>
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
                Cancellation <span className="text-rose-500">Management</span>
              </h1>
              {/* <p className="text-slate-500 mt-1 font-medium">Revoke and manage cancelled billing records</p> */}
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-100 text-rose-700">
            <span className="font-bold text-sm whitespace-nowrap uppercase tracking-tighter">
              {filteredBills.length} Active Records
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
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 w-full"
              placeholder="Search patient, bill ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500  font-bold uppercase tracking-wider">
                  <th className="py-5 px-6 text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Bill ID</th>
                  <th className="py-5 px-6 text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Patient</th>
                  <th className="py-5 px-6 text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Tests</th>
                  <th className="py-5 px-6 text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Total Amount</th>
                  <th className="py-5 px-6 text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Date</th>
                  <th className="py-5 px-6 text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <tr key={bill.bill_id} className="hover:bg-rose-50/20 transition-all group">
                      <td className="py-5 px-6">
                        <span className=" text-[14px]  text-slate-900">{bill.bill_id}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-[16px] font-bold text-slate-900 group-hover:text-rose-600 transition-colors ">
                          {bill.patientName}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="max-w-sm text-center overflow-hidden text-sans text-[14px] text-slate-900 " title={bill.Tests}>
                          {bill.Tests}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right font-sans text-slate-900">
                        ₹{bill.total_amount}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex flex-col">
                          <span className="text-[14px]  text-slate-900">{new Date(bill.Date).toLocaleDateString()}</span>
                          <span className="text-[14px] text-slate-900 ">{new Date(bill.Date).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleCancelBill(bill.bill_id)}
                            className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            title="Cancel Bill"
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
                          <XCircle className="w-12 h-12 text-slate-200" />
                        </div>
                        <p className="text-xl font-bold text-slate-800">No records found for cancellation</p>
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

export default Cancel;
