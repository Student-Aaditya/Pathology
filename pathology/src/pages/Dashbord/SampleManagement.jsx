import { useMemo, useState } from "react";

const sampleRows = [
  {
    id: 1,
    accession: "AA7001",
    patient: "Ankit Rawat",
    age: "30y",
    referred: "Dr. Roy",
    tests: "CBC, LFT",
    sampleType: "Serum",
    status: "Collected",
    remark: "--",
  },
  {
    id: 2,
    accession: "BB001",
    patient: "Ankit Rawat",
    age: "18y",
    referred: "Dr. R",
    tests: "CBC",
    sampleType: "EDTA",
    status: "Collected",
    remark: "Labelled",
  },
  {
    id: 3,
    accession: "CC000",
    patient: "Rohit",
    age: "40y",
    referred: "Dr. A",
    tests: "LFT",
    sampleType: "Serum",
    status: "Not Collected",
    remark: "Pending",
  },
];

export default function SampleManagement() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    if (!query) return sampleRows;

    const normalizedQuery = query.toLowerCase();
    return sampleRows.filter(
      (row) =>
        String(row.accession).toLowerCase().includes(normalizedQuery) ||
        String(row.patient).toLowerCase().includes(normalizedQuery) ||
        String(row.tests).toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  return (
    <section className="bg-white shadow-sm rounded-md p-4">
     

      <div className="overflow-x-auto">
      <div className="bg-white px-12 py-6 shadow-lg rounded-xl m-4 ml-7 border-b border-violet-500">
        <h1 className="text-3xl font-bold text-gray-800">
         Doctor  <span className="text-violet-500"> Sample Management</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back to Trego Doctor  Sample Management
        </p>
      </div> 

      <div className="ml-7 mr-4">
        <table className="min-w-full text-sm ">
          <thead>
            <tr className="text-left text-[18px] text-violet-500 border-b">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Accession</th>
              <th className="py-2 px-3">Patient Name</th>
              <th className="py-2 px-3">Age</th>
              <th className="py-2 px-3">Referred By</th>
              <th className="py-2 px-3">Tests</th>
              <th className="py-2 px-3">Sample Type</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Remark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="odd:bg-gray-50 hover:bg-gray-100">
                <td className="py-2 px-3">{index + 1}</td>
                <td className="py-2 px-3 font-medium">{row.accession}</td>
                <td className="py-2 px-3">{row.patient}</td>
                <td className="py-2 px-3">{row.age}</td>
                <td className="py-2 px-3">{row.referred}</td>
                <td className="py-2 px-3">{row.tests}</td>
                <td className="py-2 px-3">{row.sampleType}</td>
                <td className="py-2 px-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      row.status === "Collected"
                        ? "bg-green-100 text-green-800"
                        : row.status === "Not Collected"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-2 px-3">{row.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
