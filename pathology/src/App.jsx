import Login from "./pages/Auth/Login";
import Register from "./pages/Patient/PatientRegister";
import Home from "./pages/Home/Home";
import DoctorHome from "./pages/Home/DoctorHome";

import DashBoard from "./components/DashBoard";
import SignUp from "./pages/Auth/SignUp";
import PatientList from "./components/PatientList";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BillPatient from "./pages/Bill/BillPatient";
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

import PerformanceDashboard from "./pages/Dashboard/PerformanceDashboard";
import SampleManagement from "./pages/Dashboard/SampleManagement";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<PathologyHome />}>
          <Route index element={<DashBoard />} />
          <Route
            path="perferanceDashboard"
            element={<Navigate to="/home/finance/PerformanceDashboard" replace />}
          />
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
          <Route path="finance" element={<Finance />} />
          <Route path="finance/bill" element={<Bill />} />
          <Route path="finance/payment" element={<Payment />} />
          <Route path="finance/payment/:id" element={<PaymentId />} />
          <Route path="finance/history" element={<History />} />
          <Route
            path="finance/PerformanceDashboard"
            element={<PerformanceDashboard />}
          />
          <Route
            path="finance/sample-management"
            element={<SampleManagement />}
          />
        </Route>
        <Route path="/doctor/home" element={<DoctorHome/>}>
          <Route index element={<PerformanceDashboard/>}/>
          <Route path="sample" element={<SampleManagement/>}/>
        </Route>
        </Routes>
    </BrowserRouter>
  );
}
