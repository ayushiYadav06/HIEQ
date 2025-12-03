import React from "react";
import { colors } from "../theme/colors";
import UserImg from "../assets/user.jpg"; // ✅ your real image

const UserProfileHeader = ({
  name = "NIVED P K",
  email = "nivedp@gmail.com",
  phone = "1234567890",
  joinedDate = "20th May 2023",
  lastSeen = "25 mins ago",
  profileImage = UserImg,
  onViewProfile,
}) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "22px",
        borderRadius: "12px",
        border: "1px solid #eee",
      }}
      className="shadow-sm"
    >
      <div
        className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4"
      >
        {/* LEFT */}
        <div className="text-center text-md-start">
          <p className="mb-1">📧 {email}</p>
          <p className="mb-0">📞 {phone}</p>
        </div>

        {/* CENTER — IMAGE + NAME */}
        <div className="text-center">
          <img
            src={profileImage}
            alt="profile"
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #e6e6e6",
            }}
          />

          <h4 className="mt-2 fw-semibold">{name}</h4>

          <button
            onClick={onViewProfile}
            style={{
              background: colors.primaryGreen,
              padding: "6px 14px",
              border: "none",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            View Profile
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-center text-md-end">
          <p className="mb-1">Joined on {joinedDate}</p>

          <p
            className="mb-0 fw-semibold"
            style={{ color: colors.primaryGreen }}
          >
            ● {lastSeen}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
