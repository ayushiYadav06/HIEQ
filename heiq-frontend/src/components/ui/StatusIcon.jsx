import React from "react";
import RightTick from "../../assets/righttick.png";
import Cross from "../../assets/cross.png";

const StatusIcon = ({ status }) => {
  const isActive = status === "Active";

  return (
    <div style={{ textAlign: "center" }}>
      {isActive ? (
        <img 
          src={RightTick} 
          alt="active" 
          width={26} 
          height={26} 
          style={{ objectFit: "contain" }}
        />
      ) : (
        <img 
          src={Cross} 
          alt="inactive" 
          width={26} 
          height={26} 
          style={{ objectFit: "contain" }}
        />
      )}
    </div>
  );
};

export default StatusIcon;
