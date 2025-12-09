const AllJobsButton = ({ value = "All Jobs" }) => {
  return (
    <select className="form-select w-100" style={{ height: "38px" }}>
      <option>{value}</option>
    </select>
  );
};

export default AllJobsButton;
