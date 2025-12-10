import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginUser, clearError } from "../store/slices/authSlice";

import TopNavbar from "../components/layout/TopNavbar"; 
import SideIMG from "../assets/hieqsideimg.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL || "";
  const superAdminPassword = import.meta.env.VITE_SUPER_ADMIN_PASSWORD || "";

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) dispatch(clearError());
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
      setLocalError(err || "Login failed.");
    }
  };

  return (
    <>
      {/* ⭐ MINIMAL NAVBAR */}
      <TopNavbar minimal={true} />

      <div
        style={{
          height: "calc(100vh - 70px)",
          width: "100%",
          display: "flex",
          background: "#fdfaf7",
        }}
      >
        {/* LEFT IMAGE */}
        <div
          style={{
            width: "32%",
            backgroundImage: `url(${SideIMG})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center left",
          }}
        ></div>

        {/* RIGHT LOGIN SECTION */}
        <div
          style={{
            width: "68%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "380px",
              padding: "30px",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <h3 className="text-center mb-4">HIEQ Admin</h3>

            {localError && <div className="alert alert-danger">{localError}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* ⭐ ONLY BUTTON COLOR CHANGED */}
              <button
                type="submit"
                className="btn w-100"
                disabled={isLoading}
                style={{
                  backgroundColor: "#75BEBF",
                  borderColor: "#75BEBF",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
