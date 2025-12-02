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
    <div className="container-fluid px-2 px-md-4 mt-4">
      <div className="position-relative">

        {/* TOP STRIP */}
        <ProfileMiniNavbar
          email={email}
          phone={phone}
          joinedDate={joinedDate}
          lastSeen={lastSeen}
        />

        {/* FLOATING PROFILE CARD */}
        <div
          className="
            position-absolute 
            start-50 
            translate-middle-x 
            d-none d-md-block
          "
          style={{ top: "90px" }}
        >
          <ProfileCenterBox
            profileImage={profileImage}
            name={name}
            onViewProfile={onViewProfile}
          />
        </div>

        {/* MOBILE VERSION (No overlap) */}
        <div className="d-md-none mt-4">
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
