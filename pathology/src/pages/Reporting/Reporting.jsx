// src/pages/Reporting/Reporting.jsx
import React, { useState } from "react";
import { 
  Search, 
  User, 
  ClipboardList, 
  Calendar, 
  ChevronRight, 
  CheckCircle,
  AlertCircle,
  Activity,
  Filter,
  FileText
} from "lucide-react";

const dummyPatients = [
  { id: 1, name: "Aditya", gender: "M", age: 22, clientId: "BRO710001", referredBy: "RK Mishra" },
  { id: 2, name: "Akash", gender: "M", age: 24, clientId: "BRO710005", referredBy: "SN Ghot" },
  { id: 3, name: "Sunita", gender: "F", age: 56, clientId: "URO7002", referredBy: "SN Mishra" },
];

export default function ReportingDashBoard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = dummyPatients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.clientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-violet-100 rounded-2xl text-violet-600">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Patient Reporting <span className="text-violet-500">Dashboard</span>
              </h1>
              <p className="text-slate-500 font-medium">Manage and review patient laboratory reports</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100 text-indigo-700">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm whitespace-nowrap">
              {filteredPatients.length} Active Records
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Urgent Reports", count: "10", color: "red", icon: AlertCircle },
            { label: "Today Pending", count: "100", color: "amber", icon: Calendar },
            { label: "Previous Pending", count: "50", color: "slate", icon: ClipboardList }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-violet-200 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-2xl font-black text-slate-800">{item.count}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold">
              <Filter className="w-4 h-4" />
              Quick Filters
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full transition-all"
              placeholder="Search patient name, ID or client ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">S.No</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Details</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Client Info</th>
                  <th className="py-5 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Referred By</th>
                  <th className="py-5 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-5 px-6">
                      <span className="text-sm font-bold text-slate-900">{idx + 1}</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-900 uppercase">{p.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">ID: {p.id}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">{p.gender} / {p.age}Y</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="inline-flex items-center gap-2 text-violet-600 px-3 py-1.5 bg-violet-50 rounded-lg text-sm font-bold">
                        {p.clientId}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-slate-600 font-medium">
                      {p.referredBy}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors flex items-center gap-2 font-bold text-sm">
                          <FileText className="w-4 h-4" />
                          Open Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Investigations & Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Investigations List */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Investigation / Test</h3>
            </div>
            <div className="space-y-2">
              {["CBC", "LFT", "KFT", "Thyroid Profile", "B12"].map((test) => (
                <div key={test} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
                  <span className="text-sm font-bold text-slate-700">{test}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results Table */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Clinical Biochemistry Results</h3>
            </div>
            
            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    {["Test Description", "Result", "Unit", "Reference Range"].map((header) => (
                      <th key={header} className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-8 px-4 text-center text-slate-400 font-medium italic" colSpan="4">
                      Select a test from the left to view results
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}