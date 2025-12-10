import React from "react";

const CreateButton = ({ label = "Create User", onClick }) => {
  return (
    <button className="create-btn" onClick={onClick}>
      <span className="plus">+</span> {label}
    </button>
  );
};

export default CreateButton;
