import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks/redux";

import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AdminDash from "./pages/Admin/AdminDash.jsx";
import AccountSetting from "./pages/Admin/AccountSetting.jsx";
import VerifyDoc from "./pages/Admin/VerifyDoc.jsx";
import Candidates from "./pages/Admin/Candidates.jsx";
import ReportedOpportunities from "./pages/Admin/ReportedOpportunities.jsx";
import CmpyDeactivate from "./pages/Admin/CmpyDeactivate.jsx";
import CmpyActivate from "./pages/Admin/CmpyActivate.jsx";
import JobPrepReq from "./pages/Admin/JobPrepReq.jsx";
import UserForm from "./pages/Admin/UserForm";
import Settings from "./pages/Admin/Settings";

import ListManagement from "./pages/Admin/ListManagement_module/ListManagement.jsx";
import UserProfile from "./pages/Admin/userProfile.jsx";

// Public route wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <>
      <Routes>

  {/* Public Routes */}
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDash/>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
       
        <Route
          path="/Account-Setting/:userId"
          element={
            <ProtectedRoute>
              <AccountSetting />
            </ProtectedRoute>
          }
        />
      
        <Route
          path="/Verify-Documents/:userId"
          element={
            <ProtectedRoute>
              <VerifyDoc />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/candidates"
          element={
            <ProtectedRoute>
              <Candidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reported-opportunities"
          element={
            <ProtectedRoute>
              <ReportedOpportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-deactivate"
          element={
            <ProtectedRoute>
              <CmpyDeactivate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/activate"
          element={
            <ProtectedRoute>
              <CmpyActivate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-prep-requests"
          element={
            <ProtectedRoute>
              <JobPrepReq />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assessment"
          element={
            <ProtectedRoute>
              <ListManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Account-Seing"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />

  {/* Catch-all */}
  <Route path="*" element={<Navigate to="/login" replace />} />

</Routes>

    </>
  );
};

export default App;
