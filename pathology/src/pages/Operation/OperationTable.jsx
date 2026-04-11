import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Search, Loader2, Save, Trash2, CheckCircle, AlertCircle } from "lucide-react";

const statusOptions = [
  "Sample Not Collected",
  "Sample Collected",
  "Report Generated",
  "Report Signed",
  "Ready to Print",
];

const OperationTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8060/api/operation", {
        params: { startDate, endDate }
      });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching operation data:", error);
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
  const toggleRemarkInput = (index) => {
    const updated = [...data];
    updated[index].showRemarkInput = !updated[index].showRemarkInput;
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
      alert("Saved");
    } catch (error) {
      console.error("Error saving operation data:", error);
      alert("Failed to save");
    }
  };

  const filteredData = data.filter((row) => {
    const query = searchQuery.toLowerCase();
    const matchesTests = row.tests.some(test => test.toLowerCase().includes(query));
    return (
      (row.name && row.name.toLowerCase().includes(query)) ||
      (row.accession_number && row.accession_number.toLowerCase().includes(query)) ||
      (row.patient_id && String(row.patient_id).toLowerCase().includes(query)) ||
      matchesTests
    );
  });

  let count = 1;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
          <p className="text-slate-500 font-medium">Loading Operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Operation <span className="text-violet-500">Management</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-violet-50 px-4 py-2 rounded-xl border border-violet-100 text-violet-700">
            <div className="p-1 bg-violet-100 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm whitespace-nowrap">
              {filteredData.length} Records Found
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
              placeholder="Search patient, accession, test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">S.No</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Accession</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Patient</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Age</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Referral</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Tests</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Sample</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Status</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Remark</th>
                  <th className="py-5 px-3 text-center text-[16px] font-bold text-violet-500 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((row, idx) =>
                    row.tests.map((test, i) => (  
                      <tr key={`${row.accession_id}-${i}`} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-5 px-6 text-[14px] font-bold text-slate-900">{count++}</td>
                        <td className="py-5 px-6">
                           <div className=" items-center gap-2 text-violet-500 rounded-lg font-sans text-[14px] font-bold">
                            {row.accession_number}
                          </div>
                        </td>
                        <td className="py-5 px-6">
                           <span className="text-[14px] uppercase font-bold text-slate-900">{row.name}</span>
                        </td>
                        <td className="py-5 px-6 text-[14px] text-slate-700">{row.age}</td>
                        <td className="py-5 px-6 text-[14px] text-slate-700">{row.referal}</td>

                        <td className="py-5 px-6 text-center text-[14px] font-bold text-slate-700">{test}</td>
                        <td className="py-5 px-6 text-center text-[14px] text-slate-700">{row.test_sample}</td>
                        <td className="py-5 px-5 text-red-500 font-bold text-[14px]">
                           {/* <select
                            value={row.report_status}
                            onChange={(e) => handleChange(filteredData.indexOf(row), 'report_status', e.target.value)}
                            className={`text-[12px] font-bold py-1.5 px-3 rounded-xl border appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none transition-all ${
                              row.report_status === 'Sample Dispatched' 
                              ? 'bg-amber-50 border-amber-200 text-amber-700' 
                              : row.report_status === 'Report Generated'
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            }`}
                          >
                            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select> */}
                          Not Collected
                        </td>

                        <td className="py-5 px-6">
                          {/* <input
                            type="text"
                            value={row.remark || ""}
                            onChange={(e) => handleChange(filteredData.indexOf(row), 'remark', e.target.value)}
                            placeholder="Add remark..."
                            className="w-full bg-violet-50 border border-violet-200 rounded-xl px-4 py-1.5 text-[14px] text-slate-700 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-slate-300 font-bold"
                          /> */}
                          Remark
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleSave(row)}
                              className="p-2 bg-violet-50 border border-violet-100 text-slate-700 rounded-xl hover:bg-violet-500 hover:text-white transition-all shadow-sm"
                              title="Update Record"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan="10" className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-full">
                          <Search className="w-12 h-12 text-slate-300" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-800">No records found</p>
                          <p className="text-[14px] text-slate-800 font-bold">Try adjusting your filters</p>
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

export default OperationTable;
