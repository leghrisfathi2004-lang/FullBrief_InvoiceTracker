import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/layout/PrivateRoute";
import Layout from "../components/layout/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Suppliers from "../pages/Suppliers";
import SupplierDetail from "../pages/SupplierDetail";
import Invoices from "../pages/Invoices";
import InvoiceDetail from "../pages/InvoiceDetail";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/suppliers" element={<Layout><Suppliers /></Layout>} />
        <Route path="/suppliers/:id" element={<Layout><SupplierDetail /></Layout>} />
        <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
        <Route path="/invoices/:id" element={<Layout><InvoiceDetail /></Layout>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
