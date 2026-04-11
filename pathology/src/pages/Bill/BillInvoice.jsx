import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import InvoiceTemplate from "../../components/InvoiceTemplate";

const BillInvoice = () => {
  const { id: billId } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = "http://localhost:8060";

  useEffect(() => {
    if (billId) {
      const fetchBill = async () => {
        try {
          const response = await axios.get(`${api}/api/bill/invoice/${billId}`);
          if (response.data.success) {
            setBill(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching bill invoice:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBill();
    }
  }, [billId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!bill) {
    return <div className="text-center mt-20 text-gray-500 font-bold underline">Bill Not Found</div>;
  }

  return (
    <div className="mt-10 mb-10">
      <InvoiceTemplate bill={bill} />
    </div>
  );
};

export default BillInvoice;