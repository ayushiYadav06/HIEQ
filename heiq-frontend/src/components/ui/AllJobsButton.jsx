const AllJobsButton = ({ value = "All Jobs" }) => {
  return (
    <select
      style={{
        width: "100%",
        height: "35px",
        border: "1px solid #DDD",
        borderRadius: "5px",
        padding: "6px 10px",
        fontSize: "14px",
        background: "#FFFFFF",
        outline: "none",
      }}
    >
      <option>{value}</option>
    </select>
  );
};

export default AllJobsButton;
