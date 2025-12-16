import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert } from "react-bootstrap";
import { candidateAPI, employerAPI, userAPI } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import { colors } from "../theme/colors";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");

      if (!token || !userId) {
        setStatus("error");
        setError("Invalid verification link. Token and User ID are required.");
        return;
      }

      try {
        // Try to verify with each API (candidate, employer, user)
        // The correct one will succeed, others will fail
        let verified = false;
        let response = null;

        // Try candidate API first
        try {
          response = await candidateAPI.verifyEmail(userId, token);
          verified = true;
        } catch (err) {
          // Try employer API
          try {
            response = await employerAPI.verifyEmail(userId, token);
            verified = true;
          } catch (err2) {
            // Try user API (for admins)
            try {
              response = await userAPI.verifyEmail(userId, token);
              verified = true;
            } catch (err3) {
              // All APIs failed
              const errorMessage =
                err3.response?.data?.message ||
                err2.response?.data?.message ||
                err.response?.data?.message ||
                "Failed to verify email. Please check your verification link.";
              setStatus("error");
              setError(errorMessage);
              return;
            }
          }
        }

        if (verified && response) {
          setStatus("success");
          setMessage(
            response.message || "Your email has been verified successfully!"
          );
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setError(
          err.response?.data?.message ||
            "An error occurred while verifying your email. Please try again."
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeColors.background,
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        }}
      >
        <Card.Body style={{ padding: "40px", textAlign: "center" }}>
          {status === "verifying" && (
            <>
              <Spinner animation="border" variant="primary" />
              <h4
                style={{
                  marginTop: "20px",
                  color: themeColors.text,
                }}
              >
                Verifying your email...
              </h4>
              <p style={{ color: themeColors.textSecondary, marginTop: "10px" }}>
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "20px",
                }}
              >
                ✅
              </div>
              <h4
                style={{
                  color: colors.primaryGreen,
                  marginBottom: "15px",
                }}
              >
                Email Verified Successfully!
              </h4>
              <p style={{ color: themeColors.text, marginBottom: "20px" }}>
                {message}
              </p>
              <p style={{ color: themeColors.textSecondary, fontSize: "14px" }}>
                Redirecting to login page...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "20px",
                }}
              >
                ❌
              </div>
              <h4
                style={{
                  color: "#dc3545",
                  marginBottom: "15px",
                }}
              >
                Verification Failed
              </h4>
              <Alert variant="danger" style={{ marginTop: "20px" }}>
                {error}
              </Alert>
              <button
                onClick={() => navigate("/login")}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: colors.primaryGreen,
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Go to Login
              </button>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default VerifyEmail;

