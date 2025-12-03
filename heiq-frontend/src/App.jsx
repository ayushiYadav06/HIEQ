// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import StudentApplications from "./pages/AdminDash";
import UserProfile from "./pages/userProfile";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<StudentApplications />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </>
  );
};

export default App;
