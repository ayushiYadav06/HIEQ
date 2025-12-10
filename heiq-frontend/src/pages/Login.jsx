import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginUser, clearError } from "../store/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Get super admin credentials from env (for quick fill)
  const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL || "";
  const superAdminPassword = import.meta.env.VITE_SUPER_ADMIN_PASSWORD || "";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Role-based redirect
      if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error when component mounts or when typing
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      setLocalError(err || "Login failed. Please check your credentials.");
    }
  };

  const fillSuperAdmin = () => {
    if (superAdminEmail && superAdminPassword) {
      setEmail(superAdminEmail);
      setPassword(superAdminPassword);
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
        <h3 className="text-center mb-4">HIEQ Admin Login</h3>

        {localError && (
          <div className="alert alert-danger" role="alert">
            {localError}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* EMAIL INPUT */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLocalError("");
              }}
              disabled={isLoading}
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLocalError("");
              }}
              disabled={isLoading}
              required
            />
          </div>

          {/* SUPER ADMIN QUICK FILL (Development only) */}
          {superAdminEmail && (
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={fillSuperAdmin}
                disabled={isLoading}
              >
                Fill Super Admin Credentials
              </button>
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
