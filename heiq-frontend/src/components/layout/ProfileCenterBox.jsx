import React from "react";
import UserImage from "../../assets/user.jpg";

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
        {/* ⭐ IMAGE - CENTERED */}
        {profileImage && (
          <img
            key={profileImage} // Force re-render when image URL changes
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
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
            }}
            onError={(e) => {
              // Use local placeholder image instead of external URL
              if (e.target.src !== UserImage) {
                e.target.src = UserImage;
              }
            }}
          />
        )}

        {/* ⭐ NAME + BUTTON CENTERED EXACTLY UNDER THE IMAGE */}
        <div
          style={{
            marginTop: "240px",
            position: "absolute",
            right: "2rem",
            transform: "translateX(-50%)",
            textAlign: "center",
            width: "100%",
            maxWidth: "300px",
          }}
        >
          <h5 className="fw-semibold mb-2" style={{ color: "inherit" }}>{name}</h5>

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
