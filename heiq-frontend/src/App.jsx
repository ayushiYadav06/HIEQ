import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Admin/Dashboard.jsx";
import StudentApplications from "./pages/Admin/AdminDash.jsx";
import UserProfile from "./pages/Admin/UserProfile.jsx";
import Accountsetting from "./pages/Admin/AccountSetting.jsx";
import VerifyDoc from "./pages/Admin/VerifyDoc.jsx";
import Candidates from "./pages/Admin/Candidates.jsx";
import ReportedOpportunities from "./pages/Admin/ReportedOpportunities.jsx";
import CmpyDeactivate from "./pages/Admin/CmpyDeactivate.jsx";
import CmpyActivate from "./pages/Admin/CmpyActivate.jsx";
import JobPrepReq from "./pages/Admin/JobPrepReq.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<StudentApplications />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/Account-Setting" element={<Accountsetting />} />
        <Route path="/Verify-Documents" element={<VerifyDoc />} />
        <Route path="/admin/candidates" element={<Candidates />} />
        <Route
          path="/reported-opportunities"
          element={<ReportedOpportunities />}
        />
        <Route path="/company-deactivate" element={<CmpyDeactivate />} />
        <Route path="/company/activate" element={<CmpyActivate />} />
        <Route path="/job-prep-requests" element={<JobPrepReq />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
