import Login from "./pages/Auth/Login";
import Register from "./pages/Patient/PatientRegister";
import Home from "./pages/Home";
import DashBoard from "./components/DashBoard";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import PatientList from "./components/PatientList";
import BillPatient from "./pages/Bill/BillPatient";
import {BrowserRouter} from 'react-router-dom'
import BillReceipt from "./pages/Bill/BillReceipt";
import SampleAccession from "./pages/Operation/SampleAccession";
import OperationSample from "./pages/Operation/OperationTable";
import TestList from "./pages/Test/Test";
import Report from "./pages/Patient/Report";
import Finance from "./pages/Finance/Finance";
import Bill from "./pages/Finance/Bill";
import Payment from "./pages/Finance/Payment";
import History from "./pages/Finance/History";
import BillInvoice from "./pages/Bill/BillInvoice";
import PaymentId from "./pages/Finance/PaymentId";
import Cancel from "./pages/Cancel/Cancel";
export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<DashBoard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="patientRegister" element={<Register />} />
          <Route path="billPatient/:id" element={<BillPatient />} />
          <Route path="patient-list" element={<PatientList />} />
          <Route path="billReceipt/:id" element={<BillReceipt />} />
          <Route path="sample-accession" element={<SampleAccession />} />
          <Route path="operation-sample" element={<OperationSample />} />
          <Route path="test" element={<TestList />} />
          <Route path="bill-invoice/:id" element={<BillInvoice />} />
          <Route path="report" element={<Report />} />
          <Route path="cancel" element={<Cancel />} />
          <Route path="finance">
            <Route index element={<Finance />} />
            <Route path="bill" element={<Bill />} />
            <Route path="payment" element={<Payment />} />
            <Route path="payment/:id" element={<PaymentId/>}/>
            <Route path="history" element={<History />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}
