import React, { forwardRef } from "react";
import { CheckCircle } from "lucide-react";

const InvoiceTemplate = forwardRef(({ bill }, ref) => {
  if (!bill) return null;

  const totalAmount = bill.tests.reduce((sum, t) => sum + Number(t.price), 0);
  const totalDiscount = bill.tests.reduce((sum, t) => sum + Number(t.concession), 0);
  const payable = totalAmount - totalDiscount;

  return (
    <div ref={ref} className="max-w-4xl mx-auto p-10 bg-white shadow-lg rounded-3xl border border-violet-100">
      
      {/* Success Badge */}
      <div className="flex justify-center mb-8">
        <div className="bg-emerald-50 text-violet-600 px-6 py-2 rounded-full flex items-center gap-2 border border-violet-100 ">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-widest">Payment Confirmed</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start border-b border-violet-100 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 italic">TREGO<span className="text-violet-600">LABS</span></h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Premium Diagnostic Center</p>
        </div>
        <div className="text-right">
          <div className="bg-violet-600 text-white px-6 py-1 rounded-lg text-sm font-bold">TAX INVOICE</div>
          <p className="text-lg font-bold text-slate-700">Invoice: <span className="text-violet-600 font-sans">{bill.tests[0].billId}</span></p>
          <p className="text-[12px] font-bold text-slate-400 mt-1">{new Date(bill.patient.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2  mb-10">
        <div>
          <h2 className="text-[14px] font-black text-black uppercase mb-3 border-b pb-1">Patient Details</h2>
          <div className="space-y-1 grid grid-cols-1 ">
             <p className="text-lg font-black text-slate-800 uppercase">{bill.patient.name}</p>
             <p className="text-sm font-bold text-slate-500">Patient ID: <span >{bill.patient.id}</span> • Age: {bill.patient.age} • Gender: {bill.patient.gender}</p>
             <p className="text-sm font-bold text-slate-500 ">Phone Number: {bill.patient.phone}</p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-[14px] font-black text-black uppercase tracking-widest mb-3 border-b pb-1 text-right">Payment Info</h2>
          <div className="space-y-1">
             <p className="text-sm font-bold text-slate-700 uppercase">Method: <span className="text-indigo-600 italic font-black">{bill.tests[0].payment_type}</span></p>
             <p className="text-sm font-bold text-slate-700 uppercase">Received From: <span className="text-slate-800">{bill.received_payment_from || "Self"}</span></p>
             <p className="text-[10px] font-bold text-slate-400">STATUS: <span className="text-emerald-500 font-black tracking-widest uppercase">SUCCESSFUL</span></p>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 mb-10 shadow-sm border-b-0">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-violet-100">
            <tr>
              <th className="p-4 text-[16px] font-black text-violet-600 font-sans uppercase tracking-widest">S.No</th>
              <th className="p-4 text-[16px] font-black text-violet-600 font-sans uppercase tracking-widest">Investigation (Test Name)</th>
              <th className="p-4 text-right text-[16px] font-black text-violet-600 font-sans uppercase tracking-widest">Unit Price</th>
              <th className="p-4 text-right text-[16px] font-black text-violet-600 font-sans uppercase tracking-widest">Discount</th>
              <th className="p-4 text-right text-[16px] font-black text-violet-600 font-sans uppercase tracking-widest">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {bill.tests.map((t, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-600">{i + 1}</td>
                <td className="p-4">
                   <p className="font-bold text-[14px] text-slate-600 font-sans">{t.test_name}</p>
                   <p className="text-[14px] font-bold text-slate-600  ">Sample: {t.test_sample || "Blood"}</p>
                </td>
                <td className="p-4 text-[14px] text-right font-bold text-slate-600 font-sans ">₹{t.price.toLocaleString()}</td>
                <td className="p-4 text-[14px] text-right font-bold text-slate-600 font-sans ">-₹{t.concession.toLocaleString()}</td>
                <td className="p-4 text-[14px] text-right font-black text-slate-600 font-sans">₹{(t.price - t.concession).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculations */}
      <div className="flex justify-end mb-12">
        <div className="w-72 bg-slate-50 p-6 rounded-3xl space-y-3 border border-violet-200">
          <div className="flex justify-between text-sm font-bold text-slate-500 uppercase">
            <span>Subtotal</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-red-600 uppercase">
            <span>Total Discount</span>
            <span>-₹{totalDiscount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-500 uppercase">
            <span>Advance Paid</span>
            <span>₹{bill.tests[0].advance_paid}</span>
          </div>
          <div className="flex justify-between border-t border-violet-200 pt-3 text-lg font-black text-gray-800">
            <span>TOTAL PAID</span>
            <span className="text-violet-600">₹{payable}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center border-t border-slate-100 pt-10">
        <div className="text-center">
           <div className="h-12 w-48 mb-2 flex items-end justify-center">
              <span className="text-lg font-script italic text-slate-400">Signature</span>
           </div>
           <p className="text-[10px] font-black text-slate-500 uppercase border-t pt-2 border-slate-200">Authorized</p>
        </div>
      </div>

    </div>
  );
});

export default InvoiceTemplate;
