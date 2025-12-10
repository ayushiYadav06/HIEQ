import React from "react";
import MailIcon from "../../assets/Message.png";
import CallIcon from "../../assets/Vector 190.png";

const ProfileMiniNavbar = ({ email, phone, joinedDate, lastSeen }) => {
  return (
    <div
      className="w-100"
      style={{
        //  paddingLeft: "210px",
        // ⭐ On Mobile, remove left spacing
        // This uses a CSS trick — overridden via media query below
      }}
    >
      <style>
        {`
          @media (max-width: 767px) {
            .profile-navbar-offset {
              padding-left: 0 !important;
            }
          }
        `}
      </style>

      <div className="profile-navbar-offset d-flex justify-content-center w-100">
        <div
          className="
            border rounded 
            px-3 px-md-4 py-3 mt-4
            d-flex flex-column flex-md-row 
            justify-content-between 
            align-items-start align-items-md-center 
            gap-3
            w-100
          "
          style={{
            background: "#EEEEEE",
            maxWidth: "1300px", // ⭐ NAVBAR WIDTH CONTROL
            margin: "0 auto",
          }}
        >
          {/* Left Info */}
          <div className="d-flex flex-column gap-2 flex-grow-1">
            <div className="d-flex align-items-center gap-2">
              <img src={MailIcon} width={18} alt="email" />
              <span className="text-break">{email}</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <img src={CallIcon} width={18} alt="phone" />
              <span className="text-break">{phone}</span>
            </div>
          </div>

          {/* Right Info */}
          <div className="text-start text-md-end flex-grow-1">
            <p className="mb-1 text-secondary small">Joined on {joinedDate}</p>
            <p className="mb-0 fw-semibold" style={{ color: "#4CAF50" }}>
              ● {lastSeen}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMiniNavbar;
