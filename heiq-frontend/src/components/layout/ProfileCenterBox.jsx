import React from "react";

const ProfileCenterBox = ({
  profileImage,
  name,
  hideButton = false,
  title,
  children,
  onViewProfile
}) => {
  return (
    <div>
      {profileImage && name && (
        <div
          className="text-center"
          style={{
            marginBottom: "30px",
            marginTop: "60px", // IMAGE MOVED DOWN
          }}
        >
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
              marginBottom: "15px",
            }}
          />

          {/* NAME */}
          <h5 className="fw-semibold text-dark" style={{ marginTop: "15px" }}>
            {name}
          </h5>

          {/* VIEW PROFILE BUTTON */}
          {!hideButton && (
            <button
              className="btn btn-success px-4"
              style={{ marginTop: "10px" }}
              onClick={onViewProfile}  // ⭐ BUTTON WORKS NOW
            >
              View Profile
            </button>
          )}
        </div>
      )}

      {/* FORM BOX */}
      {title && children && (
        <div className="bg-white rounded border p-4" style={{ marginTop: "30px" }}>
          <h5 className="mb-4">{title}</h5>
          {children}
        </div>
      )}
    </div>
  );
};

export default ProfileCenterBox;
