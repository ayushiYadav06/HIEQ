import React from "react";

const ProfileSection = ({
  email,
  phone,
  joinedDate,
  lastSeen,
  profileImage,
  name,
  onViewProfile,
}) => {
  return (
    <div style={{ width: "100%", textAlign: "center", marginTop: "40px" }}>
      {/* TOP STRIP */}
      <div
        style={{
          width: "1060px",
          height: "94px",
          background: "#EEEEEE",
          borderRadius: "8px",
          border: "1px solid #E6E6E6",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          position: "relative",
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "10px", color: "#444" }}>
            <span>📧</span>
            <span>{email}</span>
          </div>
          <div style={{ display: "flex", gap: "10px", color: "#444" }}>
            <span>📞</span>
            <span>{phone}</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: "#555" }}>Joined on {joinedDate}</p>
          <p style={{ margin: 0, color: "#4CAF50" }}>● {lastSeen}</p>
        </div>

        {/* CENTER PROFILE IMAGE (Moved Down More) */}
        <img
          src={profileImage}
          alt="profile"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "1px solid rgba(221, 221, 221, 0.94)",
            objectFit: "cover",
            background: "#fff",
            position: "absolute",
            left: "50%",
            top: "205px", // ⬅️ moved DOWN more
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* NAME & BUTTON (also moved slightly down) */}
      <div style={{ marginTop: "120px" }}>
        {" "}
        {/** was 110px */}
        <p
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "12px",
          }}
        >
          {name}
        </p>
        <button
          onClick={onViewProfile}
          style={{
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            padding: "10px 22px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          View profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
