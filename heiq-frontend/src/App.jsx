import React from "react";
import { Routes, Route } from "react-router-dom";

import StudentApplications from "./pages/AdminDash";
import UserProfile from "./pages/userProfile";
import Accountsetting from "./pages/AccountSetting";
import VerifyDoc from "./pages/VerifyDoc";
import Candidates from "./pages/Candidates";
import ReportedOpportunities from "./pages/ReportedOpportunities";
import CmpyDeactivate from "./pages/CmpyDeactivate";
import CmpyActivate from "./pages/CmpyActivate";
import JobPrepReq from "./pages/JobPrepReq";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<StudentApplications />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/Account-Setting" element={<Accountsetting />} />
        <Route path="/Verify-Documents" element={<VerifyDoc />} />
        <Route path="/admin/candidates" element={<Candidates />} />
        <Route path="/reported-opportunities" element={<ReportedOpportunities />} />
        <Route path="/company-deactivate" element={<CmpyDeactivate />} />
        <Route path="/company/activate" element={<CmpyActivate/>} />
        <Route path="/job-prep-requests" element={<JobPrepReq />} />


      </Routes>
    </>
  );
};

export default App;
