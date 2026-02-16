import React, { useState, useEffect } from "react";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";
import {
    FaExclamationTriangle,
    FaEye,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaDownload,
    FaPrint,
    FaFilter,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaCreditCard,
    FaUserTie,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaShieldAlt,
    FaBan,
    FaCalendarAlt,
    FaSync
} from "react-icons/fa";

const StolenCardRequests = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const [stolenCardData, setStolenCardData] = useState([]);
    const [cardDetails, setCardDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [paginationData, setPaginationData] = useState(null);
    const { showSnackbar } = useSnackbar();
    const itemsPerPage = 5;

    // Function to fetch stolen card requests from API
    const fetchStolenCardRequests = async (page = 0) => {
        setIsLoading(true);
        try {
            const payload = {
                "status": statusFilter === "all" ? "" : statusFilter,
                "page": page,
                "size": itemsPerPage
            };
            const response = await API.post("lostCard/adminLastCardList", payload);

            if (response?.data?.data) {
                setStolenCardData(response.data.data.content || []);
                setPaginationData({
                    pageNumber: response.data.data.pageNumber,
                    pageSize: response.data.data.pageSize,
                    totalElements: response.data.data.totalElements,
                    totalPages: response.data.data.totalPages,
                    last: response.data.data.last
                });
            } else {
                setStolenCardData([]);
                setPaginationData(null);
            }

        } catch (error) {
            console.error('Error fetching stolen card requests:', error);
            showSnackbar("error", "Failed to load stolen card requests. Please try again.");
            setStolenCardData([]);
            setPaginationData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount and when filters/page changes
    useEffect(() => {
        fetchStolenCardRequests(currentPage - 1); // Convert to 0-based indexing
    }, [currentPage, statusFilter]); // Refetch when page or status filter changes
    // Handle search functionality (client-side filtering by cardholder name only)
    const filteredData = stolenCardData?.filter(item => {
        const matchesSearch = item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.cardHolder?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Handle refresh
    const handleRefresh = () => {
        setCurrentPage(1);
        fetchStolenCardRequests(0);
    };

    // Handle status filter change
    const handleStatusFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setCurrentPage(1); // Reset to first page when filter changes
        // Data will be fetched by useEffect due to statusFilter change
    };

    // Pagination
    // const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            Active: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Active" },
            Approved: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Approved" },
            Reject: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaBan, text: "Rejected" },
            Rejected: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaBan, text: "Rejected" },
            Pending: { color: "#F97316", bg: "rgba(249, 115, 22, 0.1)", icon: FaClock, text: "Pending" },
            pending: { color: "#F97316", bg: "rgba(249, 115, 22, 0.1)", icon: FaClock, text: "Pending" },
            // Fallback for other statuses
            processing: { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", icon: FaClock, text: "Processing" },
            urgent: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaExclamationTriangle, text: "Urgent" },
            resolved: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Resolved" },
            blocked: { color: "#6B7280", bg: "rgba(107, 114, 128, 0.1)", icon: FaBan, text: "Blocked" }
        };

        const config = statusConfig[status] || statusConfig.processing;
        const Icon = config.icon;

        return (
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                background: config.bg,
                color: config.color,
                borderRadius: "30px",
                fontSize: "12px",
                fontWeight: "600"
            }}>
                <Icon size={12} />
                {config.text}
            </div>
        );
    };

    // Priority badge
    const PriorityBadge = ({ priority }) => {
        const priorityConfig = {
            critical: { color: "#DC2626", bg: "rgba(220, 38, 38, 0.1)", text: "Critical" },
            high: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", text: "High" },
            medium: { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", text: "Medium" },
            low: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", text: "Low" }
        };

        const config = priorityConfig[priority] || priorityConfig.medium;

        return (
            <span style={{
                padding: "4px 10px",
                background: config.bg,
                color: config.color,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600"
            }}>
                {config.text}
            </span>
        );
    };

    // API function to fetch card details
    const fetchCardDetails = async (id) => {
        try {
            const res = await API.get(`/lostCard/lostCardBy/${id}`);
            // Store the detailed data in state based on backend response structure
            if (res.data && res.data.status && res.data.data) {
                setCardDetails(res.data.data);
                return res.data.data;
            }
            return null;
        } catch (error) {
            console.log("Error fetching card details:", error);
            setCardDetails(null);
            return null;
        }
    };

    const lostCardUpdateAdminApi = async (id, action, remarks) => {
        try {
            const payload = {
                action: action,
                remarks: remarks,
                approvedById: +localStorage.getItem("userId")
            }
            const res = await API.post(`/lostCard/lostCardUpdateAdmin/${id}`, payload);
            console.log("Card update response:", res.data);

            // Handle different response structures
            if (res.data) {
                // If response has status and data structure
                if (res.data.status && res.data.data) {
                    setCardDetails(res.data.data);
                    return res.data.data;
                }
                // If response is just a success object
                if (res.data.status === true || res.data.success === true) {
                    return res.data;
                }
                // Return the response data directly
                return res.data;
            }
            return null;
        } catch (error) {
            console.log("Error updating card details:", error);
            setCardDetails(null);
            return null;
        }
    };

    // Handle view overview - separate from API
    const handleViewOverview = async (item) => {
        setSelectedRequest(item);
        setShowOverview(true);

        // Fetch detailed data and store in state
        await fetchCardDetails(item.lostCardId);
    };

    // Handle approve request
    const handleApproveRequest = async () => {
        try {
            const cardId = cardDetails?.lostCardId || selectedRequest?.lostCardId;
            if (!cardId) {
                showSnackbar("error", "Card ID not found");
                return;
            }

            const result = await lostCardUpdateAdminApi(
                cardId,
                "APPROVE",
                ""
            );
            console.log("API Result:", result);
            if (result) {
                showSnackbar("success", "Request approved successfully");
                closeOverview();
                // Refresh the data
                fetchStolenCardRequests();
            } else {
                console.log("No result returned from API");
                showSnackbar("error", "No response from server");
            }
        } catch (error) {
            console.log("Error approving request:", error);
            showSnackbar("error", "Failed to approve request");
        }
    };

    // Handle reject request
    const handleRejectRequest = () => {
        setShowRejectReason(true);
    };

    // Handle submit rejection
    const handleSubmitRejection = async () => {
        if (!rejectReason.trim()) {
            showSnackbar("error", "Please provide a reason for rejection");
            return;
        }

        try {
            const cardId = cardDetails?.lostCardId || selectedRequest?.lostCardId;
            if (!cardId) {
                showSnackbar("error", "Card ID not found");
                return;
            }

            const result = await lostCardUpdateAdminApi(
                cardId,
                "REJECT",
                rejectReason
            );
            console.log("Reject API Result:", result);
            if (result) {
                showSnackbar("success", "Request rejected successfully");
                setShowRejectReason(false);
                setRejectReason("");
                closeOverview();
                // Refresh the data
                fetchStolenCardRequests();
            } else {
                console.log("No result returned from reject API");
                showSnackbar("error", "No response from server");
            }
        } catch (error) {
            console.log("Error rejecting request:", error);
            showSnackbar("error", "Failed to reject request");
        }
    };

    // Handle cancel rejection
    const handleCancelRejection = () => {
        setShowRejectReason(false);
        setRejectReason("");
    };

    // Close overview modal
    const closeOverview = () => {
        setShowOverview(false);
        setSelectedRequest(null);
        setCardDetails(null);
        setShowRejectReason(false);
        setRejectReason("");
    };

    // Separate Modal Component
    const StolenCardModal = ({ request, onClose }) => {
        if (!request) return null;

        // Use detailed data from API if available, otherwise use basic request data
        const displayData = cardDetails || request;

        return (
            <div style={styles.modalOverlay} onClick={onClose}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.modalHeader}>
                        <div style={styles.modalTitleGroup}>
                            <div style={styles.modalIcon}>
                                <FaExclamationTriangle size={20} color="#FFD700" />
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>Stolen Card Report</h3>
                                <p style={styles.modalSubtitle}>Request ID: {displayData.lostCardId || request.id}</p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    <div style={styles.modalBody}>
                        {/* Status Bar */}
                        <div style={styles.statusBar}>
                            <StatusBadge status={displayData.status} />
                            <PriorityBadge priority={request.priority} />
                            {request.policeComplaint === "Yes" && (
                                <span style={{
                                    padding: "4px 12px",
                                    background: "rgba(139, 92, 246, 0.1)",
                                    color: "#8B5CF6",
                                    borderRadius: "30px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}>
                                    <FaShieldAlt size={12} />
                                    FIR Filed
                                </span>
                            )}
                        </div>

                        {/* Cardholder Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaUserTie style={styles.sectionIcon} />
                                Cardholder Information
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Cardholder Name</span>
                                    <span style={styles.infoValue}>{displayData.fullName || request.cardHolder || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Card Number</span>
                                    <span style={styles.infoValue}>{displayData.lostCardNumber || request.cardNumber || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Account Number</span>
                                    <span style={styles.infoValue}>{displayData.accountNumber || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Contact Number</span>
                                    <span style={styles.infoValue}>{displayData.mobileNumber || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Email Address</span>
                                    <span style={styles.infoValue}>{displayData.email || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Location</span>
                                    <span style={styles.infoValue}>{displayData.city || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Incident Details */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaExclamationTriangle style={styles.sectionIcon} />
                                Incident Details
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Lost Card ID</span>
                                    <span style={styles.infoValue}>{displayData.lostCardId || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Created Date</span>
                                    <span style={styles.infoValue}>{displayData.createdDate || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Stolen Date</span>
                                    <span style={styles.infoValue}>{displayData.lostCardStolenDate || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Status</span>
                                    <span style={styles.infoValue}>{displayData.status || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Remarks</span>
                                    <span style={styles.infoValue}>{displayData.remarks || "N/A"}</span>
                                </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Updated Date</span>
                                        <span style={styles.infoValue}>{displayData.approvedDate || "N/A"}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Updated By</span>
                                        <span style={styles.infoValue}>{displayData.approvedByName || "N/A"}</span>
                                    </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={styles.modalActions}>
                            <button style={styles.blockBtn} onClick={handleRejectRequest}>
                                <FaBan size={14} />
                                Reject Request
                            </button>
                            <button style={styles.approveBtn} onClick={handleApproveRequest}>
                                <FaCheckCircle size={14} />
                                Approve request
                            </button>
                            {/* <button style={styles.printBtn}>
                                <FaPrint size={14} />
                                Print Report
                            </button>
                            <button style={styles.downloadBtn}>
                                <FaDownload size={14} />
                                Download
                            </button> */}
                        </div>

                        {/* Rejection Reason Modal */}
                        {showRejectReason && (
                            <div style={styles.rejectModalOverlay}>
                                <div style={styles.rejectModalContent}>
                                    <div style={styles.rejectModalHeader}>
                                        <h3 style={styles.rejectModalTitle}>
                                            <FaBan size={16} style={{ marginRight: "8px", color: "#DC2626" }} />
                                            Reject Request
                                        </h3>
                                        <button style={styles.rejectCloseBtn} onClick={handleCancelRejection}>
                                            ×
                                        </button>
                                    </div>

                                    <div style={styles.rejectModalBody}>
                                        <div style={styles.rejectFieldGroup}>
                                            <label style={styles.rejectLabel}>Rejection Reason *</label>
                                            <input
                                                key="reject-input"
                                                type="text"
                                                style={styles.rejectInput}
                                                placeholder="Please provide a detailed reason for rejecting this request..."
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                autoFocus={showRejectReason}
                                            />
                                            <div style={styles.rejectCharCount}>
                                                {rejectReason.length}/500
                                            </div>
                                        </div>

                                        <div style={styles.rejectModalActions}>
                                            <button
                                                style={styles.rejectCancelBtn}
                                                onClick={handleCancelRejection}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                style={styles.rejectSubmitBtn}
                                                onClick={handleSubmitRejection}
                                                disabled={!rejectReason.trim()}
                                            >
                                                <FaBan size={14} />
                                                Submit Rejection
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>
                        <FaExclamationTriangle size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Stolen Card Reports</h1>
                        <p style={styles.subtitle}>Manage and process stolen/lost card incidents</p>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <div style={styles.statsContainer}>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>6</span>
                            <span style={styles.statLabel}>Total</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>2</span>
                            <span style={styles.statLabel}>Approved</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>2</span>
                            <span style={styles.statLabel}>Rejected</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>2</span>
                            <span style={styles.statLabel}>Pending</span>
                        </div>
                    </div>
                    <button
                        style={styles.refreshBtn}
                        onClick={handleRefresh}
                        disabled={isLoading}
                    >
                        <FaSync
                            size={16}
                            style={{
                                ...styles.refreshIcon,
                                ...(isLoading ? styles.refreshIconSpinning : {})
                            }}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by cardholder name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <div style={styles.filterGroup}>
                    <FaFilter style={styles.filterIcon} />
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="">All status</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHead}>
                        <tr>
                            <th style={styles.tableHeader}>S.No</th>
                            <th style={styles.tableHeader}>Cardholder</th>
                            <th style={styles.tableHeader}>Card Number</th>
                            <th style={styles.tableHeader}>Reported Date</th>
                            <th style={styles.tableHeader}>Updated By</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeader}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="9" style={styles.loadingCell}>
                                    <div style={styles.loadingContainer}>
                                        <div style={styles.loader}></div>
                                        <span style={styles.loadingText}>Loading stolen card requests...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={item.id} style={styles.tableRow}>
                                    <td style={styles.tableCell}>
                                        <span style={styles.requestId}>{index + 1}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.accountHolder}>{item.fullName || "Unknown Name"}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.accountNumber}>{item.lostCardNumber}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.dateCell}>
                                            <FaCalendarAlt style={styles.dateIcon} />
                                            {item.createdDate || "12-09-2026"}
                                            <span style={styles.timeText}>{item.reportedTime}</span>
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.accountNumber}>{item.approvedByName}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td style={styles.tableCell}>
                                        <button
                                            style={styles.viewBtn}
                                            onClick={() => handleViewOverview(item)}
                                        >
                                            <FaEye size={16} />
                                            <span style={styles.viewText}>View</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={styles.noDataCell}>
                                    <div style={styles.noData}>
                                        <FaExclamationTriangle size={48} style={styles.noDataIcon} />
                                        <p style={styles.noDataText}>No stolen card reports found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
                <div style={styles.pagination}>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft size={16} />
                    </button>
                    <span style={styles.pageInfo}>
                        Page {currentPage} of {paginationData.totalPages} ({paginationData.totalElements} total)
                    </span>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
                        disabled={currentPage === paginationData.totalPages}
                    >
                        <FaChevronRight size={16} />
                    </button>
                </div>

            {/* Overview Modal */}
            {showOverview && selectedRequest && (
                <StolenCardModal request={selectedRequest} onClose={closeOverview} />
            )}
        </div>
    );
};

// ==================== COMPLETE STYLES OBJECT ====================
const styles = {
    container: {
        padding: "30px",
        background: "#F5F9FF",
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    headerIcon: {
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #003366, #002244)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 16px rgba(0, 51, 102, 0.15)",
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        margin: 0,
        color: "#003366",
        letterSpacing: "-0.5px",
    },
    subtitle: {
        fontSize: "14px",
        margin: "6px 0 0",
        color: "#4A6F8F",
    },
    statsContainer: {
        display: "flex",
        gap: "16px",
    },
    statCard: {
        background: "#FFFFFF",
        padding: "12px 24px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.15)",
        minWidth: "80px",
    },
    statValue: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#003366",
    },
    statLabel: {
        fontSize: "12px",
        color: "#4A6F8F",
        marginTop: "4px",
    },
    filtersContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        gap: "20px",
        flexWrap: "wrap",
    },
    searchBox: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "2px solid #E6EDF5",
        transition: "all 0.2s ease",
        minWidth: "300px",
    },
    searchIcon: {
        color: "#6B8BA4",
        fontSize: "16px",
    },
    searchInput: {
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: "14px",
        color: "#003366",
        background: "transparent",
        "::placeholder": {
            color: "#8DA6C0",
        },
    },
    filterGroup: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "2px solid #E6EDF5",
        minWidth: "180px",
    },
    filterIcon: {
        color: "#FFD700",
        fontSize: "14px",
    },
    filterSelect: {
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: "14px",
        color: "#003366",
        fontWeight: "500",
        background: "transparent",
        cursor: "pointer",
    },
    tableContainer: {
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(0, 51, 102, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        overflow: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableHead: {
        background: "#F8FBFF",
    },
    tableHeader: {
        padding: "16px",
        textAlign: "left",
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
        borderBottom: "2px solid #FFD700",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    tableRow: {
        borderBottom: "1px solid #E6EDF5",
        transition: "background 0.2s ease",
        ":hover": {
            background: "#F8FBFF",
        },
    },
    tableCell: {
        padding: "16px",
        fontSize: "14px",
        color: "#1E293B",
    },
    requestId: {
        fontWeight: "600",
        color: "#003366",
        fontFamily: "monospace",
    },
    accountHolder: {
        fontWeight: "500",
        color: "#1E293B",
    },
    accountNumber: {
        fontFamily: "monospace",
        color: "#4A6F8F",
    },
    cardType: {
        padding: "4px 10px",
        background: "#F0F7FF",
        borderRadius: "20px",
        fontSize: "12px",
        color: "#0052A5",
        fontWeight: "500",
    },
    dateCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#4A6F8F",
        flexWrap: "wrap",
    },
    dateIcon: {
        color: "#FFD700",
        fontSize: "12px",
    },
    timeText: {
        fontSize: "11px",
        color: "#6B8BA4",
        marginLeft: "4px",
    },
    transactionCell: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    transactionAmount: {
        fontWeight: "600",
        color: "#1E293B",
    },
    transactionTime: {
        fontSize: "11px",
        color: "#6B8BA4",
    },
    viewBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        background: "linear-gradient(135deg, #003366, #002244)",
        border: "none",
        borderRadius: "10px",
        color: "#FFFFFF",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.15)",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(0, 51, 102, 0.25)",
        },
    },
    viewText: {
        marginLeft: "2px",
    },
    noData: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        textAlign: "center",
    },
    noDataIcon: {
        color: "#FFD700",
        opacity: 0.5,
        marginBottom: "16px",
    },
    noDataText: {
        fontSize: "16px",
        color: "#4A6F8F",
        margin: 0,
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginTop: "24px",
    },
    pageBtn: {
        width: "80px",
        height: "40px",
        borderRadius: "12px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#003366",
        transition: "all 0.2s ease",
        ":hover": {
            borderColor: "#FFD700",
            background: "#FFF9E6",
        },
        ":disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
            borderColor: "#E6EDF5",
        },
    },
    pageInfo: {
        fontSize: "14px",
        color: "#4A6F8F",
        fontWeight: "500",
    },
    // Modal Styles
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 51, 102, 0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modalContent: {
        width: "90%",
        maxWidth: "800px",
        maxHeight: "90vh",
        overflow: "auto",
        background: "#FFFFFF",
        borderRadius: "32px",
        boxShadow: "0 25px 50px rgba(0, 51, 102, 0.25)",
        border: "1px solid rgba(255, 215, 0, 0.2)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 32px",
        borderBottom: "1px solid #E6EDF5",
        background: "linear-gradient(135deg, #F8FBFF, #FFFFFF)",
    },
    modalTitleGroup: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    modalIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #003366, #002244)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalTitle: {
        fontSize: "20px",
        fontWeight: "700",
        margin: 0,
        color: "#003366",
    },
    modalSubtitle: {
        fontSize: "13px",
        margin: "4px 0 0",
        color: "#4A6F8F",
        fontFamily: "monospace",
    },
    closeBtn: {
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        border: "2px solid #E6EDF5",
        background: "#FFFFFF",
        fontSize: "24px",
        fontWeight: "500",
        color: "#4A6F8F",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        ":hover": {
            borderColor: "#FFD700",
            color: "#FFD700",
        },
    },
    modalBody: {
        padding: "32px",
    },
    statusBar: {
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        paddingBottom: "24px",
        borderBottom: "1px solid #E6EDF5",
        flexWrap: "wrap",
    },
    infoSection: {
        marginBottom: "28px",
    },
    sectionTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#003366",
        marginBottom: "16px",
    },
    sectionIcon: {
        color: "#FFD700",
        fontSize: "16px",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
        background: "#F8FBFF",
        padding: "20px",
        borderRadius: "16px",
    },
    infoRow: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    infoLabel: {
        fontSize: "12px",
        color: "#6B8BA4",
        fontWeight: "500",
    },
    infoValue: {
        fontSize: "15px",
        color: "#003366",
        fontWeight: "600",
    },
    modalActions: {
        display: "flex",
        gap: "12px",
        marginTop: "32px",
        paddingTop: "24px",
        borderTop: "1px solid #E6EDF5",
        flexWrap: "wrap",
    },
    blockBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "linear-gradient(135deg, #DC2626, #B91C1C)",
        border: "none",
        borderRadius: "14px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 8px 16px rgba(220, 38, 38, 0.15)",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 20px rgba(220, 38, 38, 0.25)",
        },
    },
    approveBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "linear-gradient(135deg, #10B981, #059669)",
        border: "none",
        borderRadius: "14px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 8px 16px rgba(16, 185, 129, 0.15)",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 20px rgba(16, 185, 129, 0.25)",
        },
    },
    printBtn: {
        padding: "14px 20px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        borderRadius: "14px",
        color: "#4A6F8F",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            borderColor: "#FFD700",
            color: "#003366",
        },
    },
    downloadBtn: {
        padding: "14px 20px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        borderRadius: "14px",
        color: "#4A6F8F",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            borderColor: "#FFD700",
            color: "#003366",
        },
    },
    // Header right section
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
    },
    // Refresh button
    refreshBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 20px",
        background: "linear-gradient(135deg, #003366, #002244)",
        border: "none",
        borderRadius: "16px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.15)",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(0, 51, 102, 0.25)",
        },
        ":disabled": {
            opacity: 0.7,
            cursor: "not-allowed",
            transform: "none",
        },
    },
    refreshIcon: {
        transition: "transform 0.3s ease",
    },
    refreshIconSpinning: {
        animation: "spin 1s linear infinite",
    },
    // Loading state
    loadingCell: {
        padding: "60px",
        textAlign: "center",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
    },
    loader: {
        width: "40px",
        height: "40px",
        border: "4px solid #E6EDF5",
        borderTop: "4px solid #FFD700",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    loadingText: {
        fontSize: "16px",
        color: "#4A6F8F",
        fontWeight: "500",
    },
    noDataCell: {
        padding: "0",
    },
    // Rejection Modal Styles
    rejectModalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
    },
    rejectModalContent: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "0",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        border: "1px solid rgba(220, 38, 38, 0.2)",
    },
    rejectModalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 28px",
        borderBottom: "1px solid #E6EDF5",
        background: "linear-gradient(135deg, #FEF2F2, #FFFFFF)",
        borderRadius: "20px 20px 0 0",
    },
    rejectModalTitle: {
        display: "flex",
        alignItems: "center",
        fontSize: "18px",
        fontWeight: "700",
        color: "#DC2626",
        margin: 0,
    },
    rejectCloseBtn: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        border: "2px solid #E6EDF5",
        background: "#FFFFFF",
        fontSize: "20px",
        fontWeight: "500",
        color: "#6B8BA4",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        ":hover": {
            borderColor: "#DC2626",
            color: "#DC2626",
            background: "#FEF2F2",
        },
    },
    rejectModalBody: {
        padding: "28px",
    },
    rejectFieldGroup: {
        marginBottom: "24px",
    },
    rejectLabel: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: "8px",
    },
    rejectInput: {
        width: "100%",
        padding: "14px 16px",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        fontSize: "14px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: "100px",
        height: "100px",
        outline: "none",
        transition: "all 0.2s ease",
        direction: "ltr",
        textAlign: "left",
        verticalAlign: "top",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        ":focus": {
            borderColor: "#DC2626",
            boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
        },
        "::placeholder": {
            color: "#8DA6C0",
        },
    },
    rejectCharCount: {
        textAlign: "right",
        fontSize: "12px",
        color: "#6B8BA4",
        marginTop: "6px",
        fontWeight: "500",
    },
    rejectModalActions: {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end",
        paddingTop: "8px",
    },
    rejectCancelBtn: {
        padding: "12px 24px",
        background: "#F8FBFF",
        border: "2px solid #E6EDF5",
        borderRadius: "10px",
        color: "#4A6F8F",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            background: "#E6F0FF",
            borderColor: "#CCE5FF",
        },
    },
    rejectSubmitBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        background: "linear-gradient(135deg, #DC2626, #B91C1C)",
        border: "none",
        borderRadius: "10px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(220, 38, 38, 0.15)",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(220, 38, 38, 0.25)",
        },
        ":disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
            transform: "none",
            boxShadow: "none",
        },
    },
};

export default StolenCardRequests;