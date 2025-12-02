import React from "react";

const ApplicationTabs = ({ active, setActive }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid #ddd",
        marginTop: "10px",
      }}
    >
      {/* JOBS TAB */}
      <div
        onClick={() => setActive("Jobs")}
        style={{
          width: "50%",
          height: "44px",
          background: active === "Jobs" ? "#5AC18E" : "#F2F2F2",
          color: active === "Jobs" ? "#fff" : "#777",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 600,
          cursor: "pointer",
          borderTopLeftRadius: "4px",
        }}
      >
        Jobs
      </div>

      {/* INTERNSHIPS TAB */}
      <div
        onClick={() => setActive("Internships")}
        style={{
          width: "80%",
          height: "44px",
          background: active === "Internships" ? "#5AC18E" : "#F2F2F2",
          color: active === "Internships" ? "#fff" : "#777",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Internships
      </div>
    </div>
  );
};

export default ApplicationTabs;
