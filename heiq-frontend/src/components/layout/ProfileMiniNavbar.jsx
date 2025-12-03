import React from "react";
import MailIcon from "../../assets/message.png";
import CallIcon from "../../assets/vector 190.png";

const ProfileMiniNavbar = ({ email, phone, joinedDate, lastSeen }) => {
  return (
    <div
      className="
        border 
        rounded 
        px-3 px-md-4 
        py-3 
        mt-3 
        d-flex 
        flex-column flex-md-row 
        align-items-center 
        justify-content-between 
        gap-3
      "
      style={{
        background: "#EEEEEE",   // ⭐ UPDATED BACKGROUND COLOR
      }}
    >
      {/* LEFT SIDE */}
      <div className="d-flex flex-column gap-2 text-center text-md-start">
        <div className="d-flex align-items-center gap-2">
          <img src={MailIcon} width={18} height={18} alt="email" />
          <span>{email}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <img src={CallIcon} width={18} height={18} alt="phone" />
          <span>{phone}</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="text-center text-md-end">
        <p className="mb-1 text-secondary">Joined on {joinedDate}</p>
        <p className="mb-0 fw-semibold" style={{ color: "#4CAF50" }}>
          ● {lastSeen}
        </p>
      </div>
    </div>
  );
};

export default ProfileMiniNavbar;
