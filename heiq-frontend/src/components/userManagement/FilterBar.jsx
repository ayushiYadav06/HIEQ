import React from "react";
import SearchInput from "../ui/SearchInput";
import DateTabs from "../ui/DateTabs";
import FilterDropdown from "../ui/FilterDropdown";
import StatusFilterDropdown from "../ui/StatusFilterDropdown";
import ExportButton from "../ui/ExportButton";

const FilterBar = ({
  filterBy,
  setFilterBy,
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
  verificationStatus,
  setVerificationStatus,
  accountStatus,
  setAccountStatus,
  onExport
}) => {
  return (
    <div className="d-flex flex-wrap gap-3 mt-4 mb-3 align-items-center">
      <div style={{ width: "180px" }}>
        <ExportButton onClick={onExport} />
      </div>

      {/* Search Input - Show only for Name, Email filters */}
      {filterBy !== "Verification Status" && filterBy !== "Account Status" && (
        <div style={{ flex: 1, minWidth: "260px" }}>
          <SearchInput
            placeholder={`Search by ${filterBy}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Status Dropdown - Show for Verification Status */}
      {filterBy === "Verification Status" && (
        <div style={{ flex: 1, minWidth: "260px" }}>
          <StatusFilterDropdown
            value={verificationStatus}
            setValue={setVerificationStatus}
            statusType="verification"
          />
        </div>
      )}

      {/* Status Dropdown - Show for Account Status */}
      {filterBy === "Account Status" && (
        <div style={{ flex: 1, minWidth: "260px" }}>
          <StatusFilterDropdown
            value={accountStatus}
            setValue={setAccountStatus}
            statusType="account"
          />
        </div>
      )}

      <div style={{ width: "220px", minWidth: "180px" }}>
        <FilterDropdown value={filterBy} setValue={setFilterBy} />
      </div>

      <div style={{ flex: 1, minWidth: "260px" }}>
        <DateTabs selected={selectedDate} onChange={setSelectedDate} />
      </div>
    </div>
  );
};

export default FilterBar;

