import React from "react";
import { Routes, Route } from "react-router-dom";

import StudentApplications from "./pages/AdminDash";
import UserProfile from "./pages/UserProfile";
import Accountsetting from "./pages/AccountSetting";
import VerifyDoc from "./pages/VerifyDoc";
import Candidates from "./pages/Candidates";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<StudentApplications />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/Account-Setting" element={<Accountsetting />} />
        <Route path="/Verify-Documents" element={<VerifyDoc />} />
        <Route path="/admin/candidates" element={<Candidates />} />

      </Routes>
    </>
  );
};

export default App;
