import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { colors } from "../../../theme/colors";
import "./LogoutModal.css";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div
        className="logout-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="logout-modal-content"
          style={{
            backgroundColor: themeColors.surface,
            color: themeColors.text,
          }}
        >
          <h5
            className="logout-modal-title"
            style={{ color: themeColors.text }}
          >
            Are you sure you want to logout?
          </h5>
          <div className="logout-modal-buttons">
            <button
              className="logout-modal-btn logout-modal-btn-cancel"
              onClick={onClose}
              style={{
                backgroundColor: themeColors.border,
                color: themeColors.text,
              }}
            >
              No
            </button>
            <button
              className="logout-modal-btn logout-modal-btn-confirm"
              onClick={onConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

