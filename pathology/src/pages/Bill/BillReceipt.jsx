import {
  ArrowLeft,
  Barcode,
  CalendarDays,
  Check,
  ChevronDown,
  Pencil,
  X,
  Download,
  Printer,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import JsBarcode from "jsbarcode";
import { useRef } from "react";

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5 p-4 bg-white/50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
        {label}
      </span>
      <span className="text-base font-bold text-slate-700 leading-tight">
        {value || "—"}
      </span>
    </div>
  );
}

export default function BillReceipt() {
  const { id: billId } = useParams();
  const [accessionValues, setAccessionValues] = useState({});
  const [validAccession, setValidAccession] = useState({});
  const barcodeRefs = useRef({});
  const navigate = useNavigate();
  const api = "http://localhost:8060";

  const [patientDetails, setPatientDetails] = useState(null);
  const [billDetails, setBillDetails] = useState(null);

  const groupedTests = useMemo(() => {
    if (!billDetails?.tests) return [];
    const groups = {};
    billDetails.tests.forEach((test) => {
      const sampleKey = test.sample || "Not Specified";
      if (!groups[sampleKey]) {
        groups[sampleKey] = {
          sample: sampleKey,
          testNames: [],
          totalPrice: 0,
          totalConcession: 0,
        };
      }
      groups[sampleKey].testNames.push(test.name);
      groups[sampleKey].totalPrice += Number(test.price);
      groups[sampleKey].totalConcession += Number(test.concession);
    });
    return Object.values(groups);
  }, [billDetails?.tests]);

  const handleAccessionChange = (sampleKey, value) => {
    // if(value===value.toLowerCase()){
    //   alert("Accession should be in uppercase letters");
    //   return;
    // }
    setAccessionValues((prev) => ({
      ...prev,
      [sampleKey]: value.toUpperCase()  ,
    }));

    if (value.length >= 5) {
      setValidAccession((prev) => ({ ...prev, [sampleKey]: true }));
    } else {
      setValidAccession((prev) => ({ ...prev, [sampleKey]: false }));
    }
  };

  const generateBarcode = (sampleKey) => {
    const value = accessionValues[sampleKey];
    if (!value) return;

    JsBarcode(barcodeRefs.current[sampleKey], value, {
      format: "CODE128",
      displayValue: true,
      width: 1.5,
      height: 35,
      fontSize: 10,
    });
  };

  useEffect(() => {
    const fetchBillAndPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const billRes = await axios.get(`${api}/api/bill/${billId}`, {
          headers,
        });
        const bData = billRes.data.data;
        setBillDetails(bData);

        if (bData && bData.patientId) {
          const pRes = await axios.get(
            `${api}/api/patient/${bData.patientId}`,
            { headers },
          );
          setPatientDetails(pRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBillAndPatientData();
  }, [billId]);

  const downloadPDF = () => {
    window.open(`${api}/api/bill/${billId}/pdf`, "_blank");
  };

  const handleConfirm = async () => {
    try {
      const accessions = Object.entries(accessionValues)
        .filter(([sample, val]) => val && val.length > 0)
        .map(([sample, val]) => ({
          accession_number: val,
          patient_id: patientDetails.id,
          bill_id: billId,
          sample: sample,
        }));

      if (accessions.length === 0) {
        alert("Please enter at least one accession number before confirming.");
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post(
        `${api}/api/bill/store-accession`,
        { accessions },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      navigate("/home/sample-accession", {
        state: { patientDetails, billDetails, accessionValues },
      });
    } catch (error) {
      console.error("Error storing accessions:", error);
      alert("Failed to store accessions.");
    }
  };

  if (!billDetails || !patientDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4 text-indigo-600">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="font-bold text-slate-500">
            Loading Order Data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700">
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-5">
            <div className="flex flex-row items-center justify-between w-full gap-3">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
               # Bill <span className="text-violet-500 font-medium">Receipt</span>
                <span className="text-violet-500 font-medium ">
                  {billDetails.id}
                </span>
              </h1>
              <div className="h-8 w-190 gap-25 hidden md:block"></div>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Date(billDetails.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          {/* <div className="flex items-center gap-3">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-sm transition-all"
            >
              <Printer className="h-5 w-5 text-indigo-500" />
              Print Receipt
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </button>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: Patient Info */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
              <div className="relative flex flex-col justify-between ">
                <h2 className="text-xl font-black text-violet-500 mb-1 uppercase ml-19 ">
                  {patientDetails.name}
                </h2>
                <p className="text-lg font-bold text-slate-900 mb-6 uppercase ml-14 ">
                  {patientDetails.gender} • {patientDetails.age} Yrs
                </p>

                <div className="space-y-3 space-x-3">
                  <DetailItem
                    label="Contact Number"
                    value={patientDetails.phone}  
                  />
                  <DetailItem
                    label="Referral By"
                    value={patientDetails.referal}
                  />
                  <DetailItem label="Organization" value="Trigo" />
                  <DetailItem label="Address" value={patientDetails.address} />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content: Bill Details */}
          <section className="lg:col-span-9 space-y-6">
            {/* Header Card */}
            <div className="bg-white md:p-4 rounded-xl border border-violet-500 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex">
                  <label className="text-lg font-bold text-slate-900  ">
                    Tracking No. : 
                  </label>
                  <p className="text-lg font-black text-violet-500">
                    {billDetails.id}
                  </p>
                </div>
              </div>

              <div className="h-8  bg-slate-100 hidden md:block"></div>

              <div className="flex  items-center gap-4">
                <div className="flex gap-3">
                  <label className="text-lg font-bold text-slate-900  ">
                    Collection Date : 
                  </label>
                  <p className="text-lg font-black text-violet-500">
                    {new Date(billDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Test Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div >
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-5 text-[18px] font-bold text-violet-500">
                        Test Information
                      </th>
                      <th className="py-5 px-5 text-[18px] font-bold  text-center text-violet-500">
                        Price Details (MRP / Concession)
                      </th>
                      <th className="py-5 px-20 text-[18px] font-bold text-violet-500">
                        Assigned Accession
                      </th>
                    </tr>
                  </thead>
                  <tbody >
                    {groupedTests.map((group, groupIdx) => (
                      <tr key={groupIdx} >
                        <td className=" px-4">
                          <div className="flex flex-col gap-3">
                            <span className="text-lg text-slate-900 transition-colors">
                              {group.testNames.join(", ")}
                            </span>
                            <span className="text-lg text-slate-900">
                              Sample:{" "}
                              <span className="text-violet-500 underline">
                                {group.sample}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-lg text-slate-900">
                              ₹{group.totalPrice}
                            </span>
                            {group.totalConcession > 0 && (
                              <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-rose-100 italic">
                                - ₹{group.totalConcession}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-2 max-w-[300px]">
                            <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 rounded-2xl px-4 py-3 transition-all transition-duration-300">
                              <input
                                type="text"
                                value={accessionValues[group.sample] || ""}
                                onChange={(e) =>{
                                  handleAccessionChange(
                                    group.sample,
                                    e.target.value
                                  )
                                }
                                }
                                
                                placeholder="Enter Accession..."
                                className="w-full bg-transparent border-none text-base font-bold text-slate-700 outline-none placeholder:text-slate-300"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              {validAccession[group.sample] ? (
                                <button
                                  onClick={() => generateBarcode(group.sample)}
                                  className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                >
                                  <Check className="h-5 w-5" />
                                </button>
                              ) : (
                                <div className="p-2.5 bg-slate-50 text-slate-300 rounded-xl border border-slate-100 cursor-not-allowed">
                                  <Barcode className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex justify-center">
                            <svg
                              ref={(el) =>
                                (barcodeRefs.current[group.sample] = el)
                              }
                              className="bg-white rounded-lg"
                            ></svg>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary & Confirm */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-50/50 rounded-full translate-x-1/3 translate-y-1/3 "></div>
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <span className="w-8 h-8 bg-violet-100 text-violet-500 rounded-lg flex items-center justify-center">
                      ₹
                    </span>
                    Payment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-violet-500 font-bold">
                      <span>Paid Amount</span>
                      <span className="text-slate-900">₹{billDetails.totalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-violet-500 font-bold">
                      <span>Advance Paid</span>
                      <span className="px-3 py-1  text-slate-900">
                        ₹{billDetails.advancePaid}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-lg font-black text-violet-500 font-sans font-bold ">
                        Balance Due
                      </span>
                      <span className=" font-bold font-sans text-slate-900">
                        ₹{billDetails.pendingAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-5">
                  <p className="text-lg font-bold text-slate-900 text-center">
                    By confirming, you verify that sample accessions are
                    correctly assigned for tracking.
                  </p>
                  <button
                    onClick={handleConfirm}
                    className="w-full flex items-center justify-center  py-4 bg-gradient-to-r from-violet-300 to-violet-500 hover:from-violet-700 hover:to-violet-900 text-white text-lg font-black rounded-2xl shadow-2xl shadow-violet-200 hover:shadow-violet-300 transition-all transform hover:cursor-pointer hover:-translate-y-1 active:translate-y-0"
                  >
                    Confirm & Process
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
