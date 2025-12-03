const SearchInput = ({ placeholder }) => {
  return (
    <input
      placeholder={placeholder}
      style={{
        width: "100%",
        height: "35px",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #DDD",
        outline: "none",
        fontSize: "14px",
        background: "#FFFFFF",
      }}
    />
  );
};

export default SearchInput;
