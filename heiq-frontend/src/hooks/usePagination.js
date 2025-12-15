import { useState, useEffect, useCallback } from "react";

const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Calculate total pages when total items or page size changes
  useEffect(() => {
    const pages = Math.ceil(totalItems / pageSize) || 1;
    setTotalPages(pages);

    // Reset to page 1 if current page exceeds total pages
    if (currentPage > pages && pages > 0) {
      setCurrentPage(1);
    }
  }, [totalItems, pageSize, currentPage]);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  // Reset pagination (useful when filters change)
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Update total items (usually from API response)
  const updateTotalItems = useCallback((total) => {
    setTotalItems(total);
  }, []);

  // Get pagination params for API calls
  const getPaginationParams = useCallback(() => {
    return {
      page: currentPage,
      limit: pageSize,
    };
  }, [currentPage, pageSize]);

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
    updateTotalItems,
    getPaginationParams,
    setPageSize,
  };
};

export default usePagination;
