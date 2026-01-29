import React, { useState, useMemo } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStats } from "./DashboardStats";
import { LogoDisplay } from "./LogoDisplay";
import { SearchBar } from "./SearchBar";
import { FilterIndicator } from "./FilterIndicator";
import { RequestGrid } from "./RequestGrid";
import { RequestPagination } from "./RequestPagination";
import { NoResultsMessage } from "./NoResultsMessage";
import { ViewRequestModal } from "./ViewRequestModal";
import { EmptyState } from "./EmptyState";
import { calculateStats } from "./utils";

export function Dashboard({ requests }) {
    // State management
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showStatistics, setShowStatistics] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Data processing
    const requestsData = requests?.data || requests || [];

    // Calculate statistics
    const stats = useMemo(() => calculateStats(requestsData), [requestsData]);

    // Filter requests based on selected status and search term
    const filteredRequests = useMemo(() => {
        let filtered = requestsData;

        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter((r) => r.status === filterStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (r) =>
                    r.applicant_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    r.project_type
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    r.project_location_city
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    r.id?.toString().includes(searchTerm)
            );
        }

        return filtered;
    }, [requestsData, filterStatus, searchTerm]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

    // Event handlers
    const handleToggleStatistics = () => {
        setShowStatistics(!showStatistics);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleClearFilter = () => {
        setFilterStatus("all");
    };

    const handleRequestClick = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Empty state
    if (requests.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-6 overflow-x-hidden">
            {/* Header Section */}
            <DashboardHeader
                showStatistics={showStatistics}
                onToggleStatistics={handleToggleStatistics}
            />

            {/* Statistics Cards or CDRRMO Logo */}
            {showStatistics ? (
                <DashboardStats stats={stats} onFilterChange={handleFilterChange} />
            ) : (
                <LogoDisplay />
            )}

            {/* Search Bar */}
            {showStatistics && (
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onClearSearch={handleClearSearch}
                />
            )}

            {/* Only show content when statistics are visible */}
            {showStatistics && (
                <>
                    {/* Filter Indicator */}
                    <FilterIndicator
                        filterStatus={filterStatus}
                        onClearFilter={handleClearFilter}
                    />

                    {/* Requests Grid */}
                    {paginatedRequests.length > 0 ? (
                        <RequestGrid
                            requests={paginatedRequests}
                            onRequestClick={handleRequestClick}
                        />
                    ) : (
                        <NoResultsMessage
                            searchTerm={searchTerm}
                            filterStatus={filterStatus}
                            onClearSearch={handleClearSearch}
                            onClearFilter={handleClearFilter}
                        />
                    )}

                    {/* Pagination */}
                    {filteredRequests.length > itemsPerPage && (
                        <RequestPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            totalItems={filteredRequests.length}
                        />
                    )}
                </>
            )}

            {/* Request Details Modal */}
            <ViewRequestModal
                request={selectedRequest}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
}
