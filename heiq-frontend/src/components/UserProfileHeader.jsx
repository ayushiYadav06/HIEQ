import React from "react";
import { colors } from "../theme/colors";

const UserProfileHeader = () => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #eee",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p>📧 nivedp@gmail.com</p>
          <p>📞 1234567890</p>
        </div>

        <div style={{ textAlign: "center" }}>
          <img
            src="https://i.pravatar.cc/120"
            alt="profile"
            style={{ width: "90px", height: "90px", borderRadius: "50%" }}
          />
          <h3 style={{ marginTop: "5px" }}>NIVED P K</h3>

          <button
            style={{
              background: colors.primaryGreen,
              marginTop: "1px",
              padding: "5px 1px",
              border: "none",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            View Profile
          </button>
        </div>

        <div style={{ textAlign: "right" }}>
          <p>Joined on 20th May 2023</p>
          <p style={{ color: colors.selected }}>● 25 mins ago</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
