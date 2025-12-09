import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Temporary user database (you will replace with backend later)
const USERS = [
  { email: "user1@gmail.com", password: "123456", role: "candidate" },
  { email: "employee1@gmail.com", password: "123456", role: "employee" },
];

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // ADMIN LOGIN (fixed credentials)
    if (email === "Admin12@gmail.com" && password === "Admin@12345") {
      navigate("/admin/dashboard");
      return;
    }

    // CHECK NORMAL USERS (Employee / Candidate)
    const foundUser = USERS.find((u) => u.email === email);

    if (!foundUser) {
      alert("Account not found. Please Signup first.");
      return;
    }

    if (foundUser.password !== password) {
      alert("Incorrect Password");
      return;
    }

    // ROLE-BASED LOGIN REDIRECT
    if (foundUser.role === "employee") {
      navigate("/employee/dashboard");
    } else if (foundUser.role === "candidate") {
      navigate("/candidate/dashboard");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          width: "360px",
          padding: "30px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={handleLogin}>
          {/* EMAIL INPUT */}
          <div className="mb-3">
            <label>Email Address</label>
            <input
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* LOGIN BUTTON */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          {/* SIGNUP LINK */}
          <p
            className="text-center mt-3"
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/signup")}
          >
            Don’t have an account? Signup
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
