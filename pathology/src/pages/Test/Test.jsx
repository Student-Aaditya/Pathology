import { useState, useEffect } from "react";
import axios from "axios";
import { Search, TestTube } from "lucide-react";

export default function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const api = "http://localhost:8060";

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${api}/api/bill/patient-test-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(response.data.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const filteredTests = tests.filter((test) =>
    test.investigation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laboratory Tests</h1>
              <p className="text-gray-500 font-medium">Manage and view all available tests</p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tests by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Test Catalog...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-6 px-10 text-xs font-black text-gray-400 uppercase tracking-widest">#</th>
                  <th className="py-6 px-10 text-xs font-black text-gray-400 uppercase tracking-widest">Investigation Name</th>
                  <th className="py-6 px-10 text-xs font-black text-gray-400 uppercase tracking-widest">Sample Required</th>
                  <th className="py-6 px-10 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Price (MCC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTests.length > 0 ? (
                  filteredTests.map((test, index) => (
                    <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-6 px-10">
                        <span className="text-sm font-bold text-gray-400">{(index + 1).toString().padStart(2, '0')}</span>
                      </td>
                      <td className="py-6 px-10">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {test.investigation}
                          </span>
                          {test.code && (
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-tighter">
                              Code: {test.code}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-6 px-10">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
                          {test.sample || "Default Sample"}
                        </span>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <span className="text-lg font-black text-blue-600">
                          ₹{test.mcc || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-400 font-bold italic">
                      No tests found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {!loading && (
        <div className="max-w-7xl mx-auto mt-6 flex justify-between items-center text-sm font-bold text-gray-400">
          <p>Showing {filteredTests.length} of {tests.length} tests</p>
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span>Test Data Updated</span>
          </div>
        </div>
      )}
    </div>
  );
}
