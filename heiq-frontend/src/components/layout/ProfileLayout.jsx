import React from "react";
import ProfileMiniNavbar from "./ProfileMiniNavbar";
import ProfileCenterBox from "./ProfileCenterBox";

const ProfileLayout = ({
  email,
  phone,
  joinedDate,
  lastSeen,
  profileImage,
  name,
  onViewProfile,
}) => {
  return (
    <div
      className="container-fluid px-3 px-md-4 mt-3"
      style={{
        marginLeft: "300px", // ⭐ Sidebar(280px) + padding(20px)
      }}
    >
      <div className="position-relative pb-5">
        {/* TOP MINI NAVBAR */}
        <ProfileMiniNavbar
          email={email}
          phone={phone}
          joinedDate={joinedDate}
          lastSeen={lastSeen}
        />

        {/* OVERLAPPING PROFILE BOX */}
        <div
          className="position-absolute start-50 translate-middle-x"
          style={{
            top: "60px",
            zIndex: 10,
            width: "100%",
            maxWidth: "350px",
          }}
        >
          <ProfileCenterBox
            profileImage={profileImage}
            name={name}
            onViewProfile={onViewProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
