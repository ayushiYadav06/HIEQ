import React from "react";

const ProfileCenterBox = ({
  profileImage,
  name,
  hideButton = false,
  title,
  children,
  onViewProfile,
}) => {
  return (
    <div className="w-100 d-flex justify-content-center">
      <div
        className="text-center"
        style={{ maxWidth: "1260px", position: "relative" }}
      >
        {/* ⭐ IMAGE - DO NOT CHANGE THIS */}
        {profileImage && (
          <img
            src={profileImage}
            alt="profile"
            className="rounded-circle border shadow"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
              background: "#fff",
              position: "absolute",
              top: "70px",
              left: "50%", // ⭐ This is YOUR custom position
              transform: "translateX(15%)",
              zIndex: 20,
            }}
          />
        )}

        {/* ⭐ NAME + BUTTON CENTERED EXACTLY UNDER THE IMAGE */}
        <div
          style={{
            marginTop: "240px",
            position: "absolute",
            left: "80%", // ⭐ SAME CENTER AS IMAGE
            transform: "translateX(-18%)",
            textAlign: "center",
            width: "300px",
          }}
        >
          <h5 className="fw-semibold text-dark mb-2">{name}</h5>

          {!hideButton && (
            <button
              className="btn btn-success px-4 py-2"
              style={{ fontSize: "0.9rem" }}
              onClick={onViewProfile}
            >
              View Profile
            </button>
          )}
        </div>

        {/* Space filler so content doesn't overlap */}
        <div style={{ height: "340px" }}></div>

        {/* ⭐ OPTIONAL CONTENT BOX */}
        {title && children && (
          <div className="bg-white rounded border p-3 p-md-4 mt-4 shadow-sm">
            <h5 className="mb-3">{title}</h5>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCenterBox;
