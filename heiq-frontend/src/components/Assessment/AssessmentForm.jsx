import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";

const AssessmentForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [formData, setFormData] = useState({
    name: "",
    status: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        status: initialData.status !== undefined ? initialData.status : true,
      });
    } else {
      setFormData({
        name: "",
        status: true,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", status: true });
  };

  const handleClose = () => {
    setFormData({ name: "", status: true });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: themeColors.surface,
          color: themeColors.text,
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "20px",
            color: themeColors.text,
          }}
        >
          {initialData ? "Edit" : "Add New"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "8px",
                color: themeColors.text,
              }}
            >
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="form-control"
              style={{
                backgroundColor: themeColors.background,
                color: themeColors.text,
                borderColor: themeColors.border,
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked })
                }
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span style={{ fontSize: "14px", color: themeColors.text }}>
                Active Status
              </span>
            </label>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="btn"
              style={{
                padding: "8px 16px",
                border: `1px solid ${themeColors.border}`,
                borderRadius: "4px",
                backgroundColor: "transparent",
                color: themeColors.text,
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = themeColors.border;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: colors.primaryGreen,
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 500,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
              }}
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;
