import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50, 100],
  maxVisiblePages = 5,
}) => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;

  if (totalPages <= 1 && !showPageSizeSelector) {
    return null;
  }

  // Calculate visible page range
  const getVisiblePages = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
      {/* Page Size Selector & Info */}
      {showPageSizeSelector && (
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <label style={{ color: themeColors.text, margin: 0, fontSize: "14px" }}>
            Show:
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: `1px solid ${themeColors.border}`,
              backgroundColor: themeColors.inputBackground,
              color: themeColors.text,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span style={{ color: themeColors.textSecondary, fontSize: "14px" }}>
            entries
          </span>
          {totalItems > 0 && (
            <span style={{ color: themeColors.textSecondary, fontSize: "14px" }}>
              (Showing {startItem} to {endItem} of {totalItems})
            </span>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <BootstrapPagination className="mb-0">
          {/* First & Previous */}
          {currentPage > 1 && (
            <>
              <BootstrapPagination.First
                onClick={() => onPageChange(1)}
                style={{ cursor: "pointer" }}
              />
              <BootstrapPagination.Prev
                onClick={() => onPageChange(currentPage - 1)}
                style={{ cursor: "pointer" }}
              />
            </>
          )}

          {/* Show first page if not in visible range */}
          {visiblePages[0] > 1 && (
            <>
              <BootstrapPagination.Item onClick={() => onPageChange(1)}>
                1
              </BootstrapPagination.Item>
              {visiblePages[0] > 2 && (
                <BootstrapPagination.Ellipsis disabled />
              )}
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((page) => (
            <BootstrapPagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  page === currentPage ? colors.primaryGreen : "transparent",
                borderColor:
                  page === currentPage ? colors.primaryGreen : themeColors.border,
                color:
                  page === currentPage
                    ? "#fff"
                    : themeColors.text,
              }}
            >
              {page}
            </BootstrapPagination.Item>
          ))}

          {/* Show last page if not in visible range */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <BootstrapPagination.Ellipsis disabled />
              )}
              <BootstrapPagination.Item
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </BootstrapPagination.Item>
            </>
          )}

          {/* Next & Last */}
          {currentPage < totalPages && (
            <>
              <BootstrapPagination.Next
                onClick={() => onPageChange(currentPage + 1)}
                style={{ cursor: "pointer" }}
              />
              <BootstrapPagination.Last
                onClick={() => onPageChange(totalPages)}
                style={{ cursor: "pointer" }}
              />
            </>
          )}
        </BootstrapPagination>
      )}
    </div>
  );
};

export default Pagination;
