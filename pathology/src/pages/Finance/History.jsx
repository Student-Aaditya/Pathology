import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, History as HistoryIcon, Wallet, Loader2, Search, Clock } from "lucide-react";

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8060/api/finance/payments", {
          params: { startDate, endDate }
        });
        if (res.data.success) {
          const data = res.data.data;
          setHistory(data);
          
          const total = data.reduce((sum, p) => sum + (Number(p.paidAmt) || 0), 0);
          setStats({ count: data.length, total });
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-medium">Loading History Logs...</p>
        </div>
      </div>
    );
  }

  const filteredHistory = history.filter((record) => {
    const query = searchQuery.toLowerCase();
    return (
      (record.receivedFrom && record.receivedFrom.toLowerCase().includes(query)) ||
      (record.txn_id && String(record.txn_id).toLowerCase().includes(query))
    );
  });

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Payment <span className="text-violet-500">History</span> 
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100 text-indigo-700">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm whitespace-nowrap">
              {history.length} Logs Available
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
              placeholder="Search txn ID, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Highlighted Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-violet-200 flex items-center justify-between group hover:shadow-xl transition-all">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-violet-50 rounded-2xl group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">Total Transaction</p>
                  <h2 className="text-lg font-bold font-sans text-slate-700">
                  {stats.count}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-violet-200 flex items-center justify-between group hover:shadow-xl transition-all">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-violet-50 rounded-2xl group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 ">Total Amount</p>
                  <h2 className="text-lg font-bold font-sans text-slate-700">
                  ₹{stats.total.toLocaleString()}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* History Stream Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-5 px-6 text-left text-[18xp] font-bold text-violet-500 uppercase tracking-wider">S.No</th>
                  <th className="py-5 px-6 text-left text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Transaction Id</th>
                  <th className="py-5 px-6 text-left text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Received From</th>
                  <th className="py-5 px-6 text-right text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Paid Amount</th>
                  <th className="py-5 px-6 text-center text-[18xp] font-bold text-violet-500 uppercase tracking-wider">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((record, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-5 px-6 whitespace-nowrap">
                        <span className="text-[16px] font-bold text-slate-400">{index + 1}</span>
                      </td>
                      <td className="py-5 px-6 whitespace-nowrap">
                        <div className="inline-flex bg-violet-50 border hover:bg-white hover:text-violet-500 border-violet-100 text-slate-700 px-3 py-1.5 rounded-lg font-sans text-[14px] font-bold w-fit tracking-tighter">
                          <button onClick={()=>navigate("/home/finance/payment")} className="hover:cursor-pointer">
                                              {record.txn_id}

                          </button>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-[14px] font-bold uppercase text-slate-800">{record.receivedFrom}</span>
                      </td>
                      <td className="py-5 px-6 text-right whitespace-nowrap">
                        <span className="text-[16px] font-black text-slate-700 font-sans tracking-tighter">
                          ₹{record.paidAmt.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col items-center">
                          <span className="text-[14px] font-bold text-slate-700">{new Date(record.Date).toLocaleDateString()}</span>
                          <span className="text-[12px] font-bold text-slate-400 uppercase">{new Date(record.Date).toLocaleTimeString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                       <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                          <HistoryIcon className="w-12 h-12" />
                        </div>
                        <p className="text-xl font-bold text-slate-800">No logs discovered</p>
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

export default History;
