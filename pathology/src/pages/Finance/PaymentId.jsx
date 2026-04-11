import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate ,useParams} from "react-router-dom";

import {
  Eye,
  ArrowLeft,
  CheckCircle,
  Wallet,
  Calendar,
  Loader2,
  Search,
} from "lucide-react";

const Payment = () => {
    const {id:bill_id}=useParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8060/api/finance/payments/${bill_id}`,
        );
        if (res.data.success) {
          const data = res.data.data;
          setPayments(data);

          // Calculate stats
          const total = data.reduce(
            (sum, p) => sum + (Number(p.payableAmt) || 0),
            0,
          );
          const todayStr = new Date().toLocaleDateString();
          const today = data
            .filter((p) => new Date(p.Date).toLocaleDateString() === todayStr)
            .reduce((sum, p) => sum + (Number(p.payableAmt) || 0), 0);

          setStats({ today, total });
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-medium">Loading Payments...</p>
        </div>
      </div>
    );
  }

  const filteredPayments = payments.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      (p.receivedFrom && p.receivedFrom.toLowerCase().includes(query)) ||
      (p.txn_id && String(p.txn_id).toLowerCase().includes(query)) ||
      (p.bill_id && String(p.bill_id).toLowerCase().includes(query)) ||
      (p.order_id && String(p.order_id).toLowerCase().includes(query))
    );
  });

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-600 tracking-tight">
                Payment <span className="text-violet-500">Management</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100 text-indigo-700">
              <div className="p-1.5 bg-indigo-100 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm whitespace-nowrap">
                {payments.length} Payments Tracked
              </span>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-lg font-bold text-slate-900 mb-1">
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
              <label className="text-lg font-bold text-slate-900 mb-1">
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
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full transition-all"
              placeholder="Search txn, bill, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>  
        
                {/* Summary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-lg  flex items-center justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="p-2 bg-amber-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6 text-slate-900" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-900 mb-1">
                          Today's Payment
                        </p>
                        <div className="flex items-baseline gap-2">
                          <h2 className="text-lg font-bold font-sans text-slate-700">
                            ₹{stats.today.toLocaleString()}
                          </h2>
                          <span className="text-[14px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
        
                  <div className="bg-white p-6 rounded-2xl shadow-lg  flex items-center justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="p-2 bg-violet-50 rounded-2xl group-hover:scale-110 transition-transform">
                        <Wallet className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-slate-700 mb-1">
                          Total Collection
                        </p>
                        <h2 className="text-lg font-bold font-sans text-slate-900">
                          ₹{stats.total.toLocaleString()}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
      

        

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-xs font-semibold uppercase">
                    S.No
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase">
                    Time
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase">
                    Txn ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase">
                    Bill ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase">
                    Received From
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase">
                    Paid To
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-right">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-center">
                    Transaction Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-center">
                    Method
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((p, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>

                      {/* Date */}
                      <td className="px-4 py-3 text-sm">
                        {new Date(p.Date).toLocaleDateString()}
                      </td>

                      {/* Time */}
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {new Date(p.Date).toLocaleTimeString()}
                      </td>

                      {/* Txn ID */}
                      <td className="px-4 py-3 font-mono text-sm">
                        <button
                          // onClick={() => navigate(`/home/bill-invoice/${p.PatientId}`)}
                          className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:cursor-pointer transition-all shadow-sm group-hover:scale-105"
                          title="View Details"
                        >
                          {" "}
                          {p.txn_id}
                        </button>
                      </td>

                      {/* Bill ID */}
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() =>
                            navigate(`/home/bill-invoice/${p.PatientId}`)
                          }
                          className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:cursor-pointer transition-all shadow-sm group-hover:scale-105"
                          title="View Details"
                        >
                          {" "}
                          {p.bill_id}
                        </button>
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() =>
                            navigate(`/home/bill-invoice/${p.PatientId}`)
                          }
                          className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:cursor-pointer transition-all shadow-sm group-hover:scale-105"
                          title="View Details"
                        >
                          {" "}
                          {p.order_id}
                        </button>
                      </td>

                      {/* Received From */}
                      <td className="px-4 py-3 text-sm font-medium">
                        {p.receivedFrom}
                      </td>

                      {/* Paid To */}
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {p.paidTo}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 text-right font-semibold text-violet-600">
                        ₹{p.payableAmt}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            p.status === "Paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3 text-center text-sm">
                        {p.method}
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/home/bill-invoice/${p.PatientId}`)
                            }
                            className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:scale-105"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                          <Search className="w-12 h-12" />
                        </div>
                        <p className="text-xl font-bold text-slate-800">
                          No transactions found
                        </p>
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

export default Payment;
