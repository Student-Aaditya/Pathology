import React, { useState, useEffect, useRef } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceTemplate from "../../components/InvoiceTemplate";

const Bill = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [downloadingInvoiceData, setDownloadingInvoiceData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8060/api/finance/bill", {
          params: { startDate, endDate },
        });
        if (res.data.success) {
          setBills(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, [startDate, endDate]);
  // const handleDownloadInvoice = async (patientId) => {
  //   try {
  //     setIsDownloading(true);
  //     const api = "http://localhost:8060";
  //     const response = await axios.get(`${api}/api/bill/invoice/${patientId}`);
  //     if (response.data.success) {
  //       setDownloadingInvoiceData(response.data.data);
  //     } else {
  //       setIsDownloading(false);
  //       alert("Failed to fetch invoice details from server.");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching bill details for PDF:", err);
  //     alert("Network issue occur during download. Tray after some time.");
  //     setIsDownloading(false);
  //   }
  // };
  const handleDownloadInvoice = async (billId) => {
    try {
      setIsDownloading(true);

      const api = "http://localhost:8060";

      const response = await axios.get(`${api}/api/bill/invoice-pdf/${billId}`);

      // if (!response.data.success) {
      //   throw new Error("Failed to fetch invoice data");
      // }
      console.log(billId);
      const billData = response.data.data;
      setDownloadingInvoiceData(billData);

      // setTimeout(async () => {
      //   try {
      //     const element = invoiceRef.current;

      //     if (!element) throw new Error("Invoice element not found");

      //     // ✅ High quality canvas
      //     const canvas = await html2canvas(element, {
      //       scale: 3,
      //       useCORS: true,
      //     });

      //     const imgData = canvas.toDataURL("image/png");

      //     const pdf = new jsPDF({
      //       orientation: "portrait",
      //       unit: "pt",
      //       format: "a4",
      //     });

      //     const pageWidth = pdf.internal.pageSize.getWidth();
      //     const pageHeight = pdf.internal.pageSize.getHeight();

      //     const imgWidth = pageWidth;
      //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

      //     let heightLeft = imgHeight;
      //     let position = 0;

      //     // ✅ First page
      //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      //     heightLeft -= pageHeight;

      //     // ✅ Multi-page support
      //     while (heightLeft > 0) {
      //       position = heightLeft - imgHeight;
      //       pdf.addPage();
      //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      //       heightLeft -= pageHeight;
      //     }

      //     // ✅ Save file
      //     pdf.save(`Invoice_${billId}.pdf`);
      //   } catch (pdfError) {
      //     console.error("PDF generation error:", pdfError);
      //     alert("Error generating PDF");
      //   } finally {
      //     setDownloadingInvoiceData(null);
      //     setIsDownloading(false);
      //   }
      // }, 200); // small delay for rendering
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download invoice");
      setIsDownloading(false);
    }
  };
  // useEffect(() => {
  //   if (downloadingInvoiceData && invoiceRef.current) {
  //     const generatePdf = async () => {
  //       try {
  //         await new Promise((resolve) => setTimeout(resolve, 300));
  //         const element = invoiceRef.current;
  //         const canvas = await html2canvas(element, { scale: 2 });
  //         const imgData = canvas.toDataURL("image/png");
  //         const pdf = new jsPDF({
  //           orientation: "portrait",
  //           unit: "pt",
  //           format: "a4",
  //         });
  //         const pdfWidth = pdf.internal.pageSize.getWidth();
  //         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //         pdf.save(`Invoice_${downloadingInvoiceData.patient.id}.pdf`);
  //       } catch (error) {
  //         console.error("Error generating PDF:", error);
  //         alert("Network issue occur during download. Try after some time.");
  //       } finally {
  //         setDownloadingInvoiceData(null);
  //         setIsDownloading(false);
  //       }
  //     };
  //     generatePdf();
  //   }
  // }, [downloadingInvoiceData]);
  useEffect(() => {
    if (!downloadingInvoiceData) return;

    const generatePdf = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const element = invoiceRef.current;

        if (!element) {
          throw new Error("Invoice element not found");
        }

        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        pdf.save(`Invoice_${downloadingInvoiceData.patient.id}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("PDF generation failed");
      } finally {
        setDownloadingInvoiceData(null);
        setIsDownloading(false);
      }
    };

    generatePdf();
  }, [downloadingInvoiceData]);

  const filteredBills = bills.filter((bill) => {
    const query = searchQuery.toLowerCase();
    return (
      (bill.patientName && bill.patientName.toLowerCase().includes(query)) ||
      (bill.PatientId &&
        String(bill.PatientId).toLowerCase().includes(query)) ||
      (bill.bill_id && String(bill.bill_id).toLowerCase().includes(query))
    );
  });
  const totalAmount = filteredBills.reduce(
    (sum, bill) => sum + bill.payableAmount,
    0,
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-700">
          Billing <span className="text-violet-500">Management</span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-lg font-bold text-slate-900 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-violet-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
              className="px-3 py-2 border border-violet-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full shadow-sm"
            placeholder="Search by name, patient ID, bill ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className=" border-2 border-gray-100 rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-[14px] text-violet-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3 ">Sn.No</th>
              <th className="px-4 py-3 ">Date</th>

              <th className="px-4 py-3 whitespace-nowrap">Bill ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Patient ID</th>

              <th className="px-4 py-3 whitespace-nowrap">Patient Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Tests (ID - Name)</th>
              <th className="px-4 py-3 whitespace-nowrap text-right">Amount</th>
              <th className="px-4 py-3 whitespace-nowrap text-right">
                Discount
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-right font-bold">
                Payable Amount
              </th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Method
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-right font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="px-4 py-10 text-center">
                  Loading billing data from server...
                </td>
              </tr>
            ) : filteredBills.length > 0 ? (
              filteredBills.map((bill, index) => (
                <tr
                  key={bill.bill_id || index}
                  className="bg-white border-b hover:bg-gray-50 align-top"
                >
                  <td className="px-4 py-5  font-sans text-slate-600 text-[14px]">
                    {index + 1}
                  </td>
                  <td className="px-4 py-5  font-sans text-slate-600  text-[14px]">
                    {bill.Date
                      ? new Date(bill.Date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-5  font-sans text-slate-600 text-[14px]">
                    {bill.bill_id}
                  </td>
                  <td className="px-4 py-5  font-sans text-slate-600 text-[14px]">
                    {bill.PatientId || "N/A"}
                  </td>
                  <td className="px-4 py-5 font-bold font-sans text-slate-600 text-[14px]">
                    {bill.patientName || "N/A"}
                  </td>
                  <td className="px-4 py-2 font-bold font-sans text-slate-600 text-[14px] rounded p-2">
                    {bill.Tests || "N/A"}
                  </td>

                  <td className="px-4 py-5 text-right  font-sans text-slate-600 text-[14px]">
                    ₹{bill.total_amount || 0}
                  </td>
                  <td className="px-4 py-5 text-right  font-sans text-slate-600 text-[14px]">
                    ₹{bill.total_concession || 0}
                  </td>
                  <td className="px-4 py-5 text-right  font-sans text-slate-600 text-[14px]">
                    ₹{bill.total_amount - (bill.total_concession || 0)}
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span
                      className={`px-2 py-1 text-[14px] rounded-full font-medium ${
                        bill.method === "Cash"
                          ? "bg-green-100 text-green-700"
                          : bill.method === "Online"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {bill.method || "N/A"}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/home/bill-invoice/${bill.PatientId}`)
                        }
                        className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:scale-105"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(bill.PatientId)}
                        className="p-2.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm group-hover:scale-105"
                        title="Download Invoice"
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-10 text-center">
                  No billing records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDownloading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
            <span className="font-bold text-slate-700">Preparing PDF...</span>
          </div>
        </div>
      )}

      {/* Hidden container for PDF Generation */}
      <div
        style={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          width: "900px",
        }}
      >
        {downloadingInvoiceData && (
          <InvoiceTemplate ref={invoiceRef} bill={downloadingInvoiceData} />
        )}
      </div>
    </div>
  );
};

export default Bill;
