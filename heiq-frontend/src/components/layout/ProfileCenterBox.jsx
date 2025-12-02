import React from "react";

const ProfileCenterBox = ({ profileImage, name, onViewProfile }) => {
  return (
    <div className="text-center mt-5">
      
      {/* PROFILE IMAGE */}
      <img
        src={profileImage}
        alt="profile"
        className="rounded-circle border"
        style={{
          width: "150px",
          height: "150px",
          objectFit: "cover",
          background: "#fff",
        }}
      />

      {/* NAME */}
      <h5 className="mt-3 fw-semibold text-dark">{name}</h5>

      {/* BUTTON */}
      <button className="btn btn-success px-4 mt-1" onClick={onViewProfile}>
        View Profile
      </button>
    </div>
  );
};

export default ProfileCenterBox;
