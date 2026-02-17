import React, { useState, useEffect, useRef } from "react";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";
import {
    FaEye,
    FaCheckCircle,
    FaBan,
    FaClock,
    FaDownload,
    FaPrint,
    FaFilter,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaCalendarAlt,
    FaSync,
    FaMoneyCheck,
    FaUser
} from "react-icons/fa";

const ChequeBookRequests = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const [chequeRequests, setChequeRequests] = useState([]);
    const [requestDetails, setRequestDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [paginationData, setPaginationData] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });
    const { showSnackbar } = useSnackbar();
    const itemsPerPage = 5;
    const abortControllerRef = useRef(null);

    // Fetch cheque book requests from API
    const fetchChequeRequests = async (page = 0) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        try {
            const payload = {
                "status": statusFilter,
                "page": page,
                "size": itemsPerPage
            };
            
            console.log("Fetching with payload:", payload);
            
            // Check if API is properly configured
            if (!API || !API.defaults) {
                console.error("API not properly configured");
                showSnackbar("error", "API configuration error. Please check your connection.");
                setChequeRequests([]);
                setPaginationData(null);
                setIsLoading(false);
                return;
            }

            const response = await API.post("chequeRequest/adminChequeList", payload, {
                signal: abortControllerRef.current.signal,
                timeout: 30000
            });

            console.log("API Response Status:", response.status);
            console.log("API Response Data:", response.data);

            if (response?.data?.data) {
                setChequeRequests(response.data.data.content || []);
                setPaginationData({
                    pageNumber: response.data.data.pageNumber,
                    pageSize: response.data.data.pageSize,
                    totalElements: response.data.data.totalElements,
                    totalPages: response.data.data.totalPages,
                    last: response.data.data.last
                });
            } else {
                setChequeRequests([]);
                setPaginationData(null);
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request was cancelled');
            } else if (error.code === 'ECONNABORTED') {
                console.log('Request timeout');
                showSnackbar("error", "Request timeout. The server is taking too long to respond.");
            } else if (error.response) {
                console.log('Error response:', error.response.status, error.response.data);
                showSnackbar("error", `Server error: ${error.response.status}`);
            } else if (error.request) {
                console.log('No response received');
                showSnackbar("error", "Cannot connect to server. Please check if the server is running.");
            } else {
                console.log('Error:', error.message);
                showSnackbar("error", "Failed to load cheque book requests. Please try again.");
            }
            
            setChequeRequests([]);
            setPaginationData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await API.get("chequeRequest/counts", {
                timeout: 30000
            });
            console.log("Stats response:", response.data);
            if (response?.data?.data) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Don't show error for stats to avoid too many messages
        }
    };

    useEffect(() => {
        fetchChequeRequests(currentPage);
        fetchStats();

        // Cleanup function to cancel requests on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [currentPage, statusFilter]);

    // Handle search functionality
    const filteredData = chequeRequests?.filter(item => {
        const requestId = `CHQ-${item.chequeRequestId}`.toLowerCase();
        const accountNumber = item.accountNumber?.toString() || "";
        const fullName = item.fullName?.toLowerCase() || "";
        const searchLower = searchTerm.toLowerCase();
        
        return requestId.includes(searchLower) || 
               accountNumber.includes(searchLower) ||
               fullName.includes(searchLower);
    });

    const handleRefresh = () => {
        setCurrentPage(0);
        fetchChequeRequests(0);
        fetchStats();
    };

    const handleStatusFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setCurrentPage(0);
    };

    const fetchChequeDetails = async (id) => {
        try {
            const res = await API.get(`chequeRequest/chequeBy/${id}`, {
                timeout: 30000
            });
            console.log("Details response:", res.data);
            if (res.data && res.data.data) {
                setRequestDetails(res.data.data);
                return res.data.data;
            }
            return null;
        } catch (error) {
            console.log("Error fetching cheque details:", error);
            showSnackbar("error", "Failed to fetch request details");
            setRequestDetails(null);
            return null;
        }
    };

    const updateChequeStatus = async (id, action, remarks) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                showSnackbar("error", "User not authenticated");
                return null;
            }

            const payload = {
                action: action,
                approvedById: parseInt(userId),
                remarks: remarks
            };
            console.log("Update payload:", payload);
            const res = await API.post(`chequeRequest/chequeUpdateAdmin/${id}`, payload, {
                timeout: 30000
            });
            
            console.log("Update response:", res.data);
            
            if (res.data && res.data.status === true) {
                return res.data;
            }
            return null;
        } catch (error) {
            console.log("Error updating cheque status:", error);
            showSnackbar("error", "Failed to update request status");
            return null;
        }
    };

    const handleViewOverview = async (item) => {
        setSelectedRequest(item);
        setShowOverview(true);
        await fetchChequeDetails(item.chequeRequestId);
    };

    const handleApproveRequest = async () => {
        try {
            const requestId = requestDetails?.chequeRequestId || selectedRequest?.chequeRequestId;
            if (!requestId) {
                showSnackbar("error", "Request ID not found");
                return;
            }

            const result = await updateChequeStatus(
                requestId,
                "APPROVE",
                ""
            );
            
            if (result) {
                showSnackbar("success", "Request approved successfully");
                closeOverview();
                fetchChequeRequests(currentPage);
                fetchStats();
            } else {
                showSnackbar("error", "Failed to approve request");
            }
        } catch (error) {
            console.log("Error approving request:", error);
            showSnackbar("error", "Failed to approve request");
        }
    };

    const handleRejectRequest = () => {
        setShowRejectReason(true);
    };

    const handleSubmitRejection = async () => {
        if (!rejectReason.trim()) {
            showSnackbar("error", "Please provide a reason for rejection");
            return;
        }

        try {
            const requestId = requestDetails?.chequeRequestId || selectedRequest?.chequeRequestId;
            if (!requestId) {
                showSnackbar("error", "Request ID not found");
                return;
            }

            const result = await updateChequeStatus(
                requestId,
                "REJECT",
                rejectReason
            );
            
            if (result) {
                showSnackbar("success", "Request rejected successfully");
                setShowRejectReason(false);
                setRejectReason("");
                closeOverview();
                fetchChequeRequests(currentPage);
                fetchStats();
            } else {
                showSnackbar("error", "Failed to reject request");
            }
        } catch (error) {
            console.log("Error rejecting request:", error);
            showSnackbar("error", "Failed to reject request");
        }
    };

    const handleCancelRejection = () => {
        setShowRejectReason(false);
        setRejectReason("");
    };

    const closeOverview = () => {
        setShowOverview(false);
        setSelectedRequest(null);
        setRequestDetails(null);
        setShowRejectReason(false);
        setRejectReason("");
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            Approved: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Approved" },
            Rejected: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaBan, text: "Rejected" },
            Pending: { color: "#F97316", bg: "rgba(249, 115, 22, 0.1)", icon: FaClock, text: "Pending" },
            Processing: { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", icon: FaClock, text: "Processing" }
        };

        const config = statusConfig[status] || { 
            color: "#6B7280", 
            bg: "rgba(107, 114, 128, 0.1)", 
            icon: FaClock, 
            text: status 
        };
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

    const getLeafTypeText = (leaves) => {
        if (leaves === 25) return "25 Leaves";
        if (leaves === 50) return "50 Leaves";
        if (leaves === 100) return "100 Leaves";
        return `${leaves} Leaves`;
    };

    const ChequeRequestModal = ({ request, onClose }) => {
        if (!request) return null;

        const displayData = requestDetails || request;

        return (
            <div style={styles.modalOverlay} onClick={onClose}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.modalHeader}>
                        <div style={styles.modalTitleGroup}>
                            <div style={styles.modalIcon}>
                                <FaMoneyCheck size={20} color="#FFD700" />
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>Cheque Book Request</h3>
                                <p style={styles.modalSubtitle}>Request ID: CHQ-{displayData.chequeRequestId}</p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    <div style={styles.modalBody}>
                        <div style={styles.statusBar}>
                            <StatusBadge status={displayData.status} />
                        </div>

                        {/* Account Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaUser style={styles.sectionIcon} />
                                Account Information
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Account Holder</span>
                                    <span style={styles.infoValue}>{displayData.fullName || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Account Number</span>
                                    <span style={styles.infoValue}>{displayData.accountNumber || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Mobile Number</span>
                                    <span style={styles.infoValue}>{displayData.mobileNumber || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Email</span>
                                    <span style={styles.infoValue}>{displayData.email || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>City</span>
                                    <span style={styles.infoValue}>{displayData.city || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cheque Details */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaMoneyCheck style={styles.sectionIcon} />
                                Cheque Details
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Request Date</span>
                                    <span style={styles.infoValue}>{displayData.requestedDate || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Leaf Type</span>
                                    <span style={styles.infoValue}>{getLeafTypeText(displayData.noOfLeaves)}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Status</span>
                                    <span style={styles.infoValue}>{displayData.status || "N/A"}</span>
                                </div>
                                {displayData.remarks && (
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Remarks</span>
                                        <span style={styles.infoValue}>{displayData.remarks}</span>
                                    </div>
                                )}
                                {displayData.approvedDate && (
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Approved Date</span>
                                        <span style={styles.infoValue}>{displayData.approvedDate}</span>
                                    </div>
                                )}
                                {displayData.approvedByName && (
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Approved By</span>
                                        <span style={styles.infoValue}>{displayData.approvedByName}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {displayData.status === "Pending" && (
                            <div style={styles.modalActions}>
                                <button style={styles.blockBtn} onClick={handleRejectRequest}>
                                    <FaBan size={14} />
                                    Reject Request
                                </button>
                                <button style={styles.approveBtn} onClick={handleApproveRequest}>
                                    <FaCheckCircle size={14} />
                                    Approve Request
                                </button>
                            </div>
                        )}

                        {/* <div style={styles.modalActions}>
                            <button style={styles.printBtn}>
                                <FaPrint size={14} />
                                Print
                            </button>
                            <button style={styles.downloadBtn}>
                                <FaDownload size={14} />
                                Download
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    };

    // Rejection Modal - Separate component
    const RejectionModal = () => {
        if (!showRejectReason) return null;

        return (
            <div style={styles.rejectModalOverlay} onClick={handleCancelRejection}>
                <div style={styles.rejectModalContent} onClick={(e) => e.stopPropagation()}>
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelRejection();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.rejectSubmitBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubmitRejection();
                                }}
                                disabled={!rejectReason.trim()}
                            >
                                <FaBan size={14} />
                                Submit Rejection
                            </button>
                        </div>
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
                        <FaMoneyCheck size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Cheque Book Requests</h1>
                        <p style={styles.subtitle}>Manage and process customer cheque book requests</p>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <div style={styles.statsContainer}>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>{stats.total}</span>
                            <span style={styles.statLabel}>Total</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>{stats.pending}</span>
                            <span style={styles.statLabel}>Pending</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>{stats.approved}</span>
                            <span style={styles.statLabel}>Approved</span>
                        </div>
                        <div style={styles.statCard}>
                            <span style={styles.statValue}>{stats.rejected}</span>
                            <span style={styles.statLabel}>Rejected</span>
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
                        placeholder="Search by request ID, account number or customer name..."
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
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHead}>
                        <tr>
                            <th style={styles.tableHeader}>S.No</th>
                            <th style={styles.tableHeader}>ACCOUNT HOLDER</th>
                            <th style={styles.tableHeader}>ACCOUNT NO.</th>
                            <th style={styles.tableHeader}>REQUEST DATE</th>
                            <th style={styles.tableHeader}>LEAF TYPE</th>
                            <th style={styles.tableHeader}>STATUS</th>
                            <th style={styles.tableHeader}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" style={styles.loadingCell}>
                                    <div style={styles.loadingContainer}>
                                        <div style={styles.loader}></div>
                                        <span style={styles.loadingText}>Loading cheque requests...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={item.chequeRequestId} style={styles.tableRow}>
                                    <td style={styles.tableCell}>
                                        <span style={styles.serialNumber}>
                                            {(currentPage * itemsPerPage) + index + 1}
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.accountHolder}>{item.fullName || "N/A"}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.accountNumber}>{item.accountNumber || "XXXX XXXX"}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.dateCell}>
                                            <FaCalendarAlt style={styles.dateIcon} />
                                            {item.requestedDate}
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.cardType}>{getLeafTypeText(item.noOfLeaves)}</span>
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
                                <td colSpan="7" style={styles.noDataCell}>
                                    <div style={styles.noData}>
                                        <FaMoneyCheck size={48} style={styles.noDataIcon} />
                                        <p style={styles.noDataText}>No cheque book requests found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {paginationData && paginationData.totalPages > 0 && (
                <div style={styles.pagination}>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                    >
                        <FaChevronLeft size={16} />
                    </button>
                    <span style={styles.pageInfo}>
                        Page {currentPage + 1} of {paginationData.totalPages} ({paginationData.totalElements} total)
                    </span>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages - 1))}
                        disabled={currentPage === paginationData.totalPages - 1}
                    >
                        <FaChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Overview Modal */}
            {showOverview && selectedRequest && (
                <ChequeRequestModal request={selectedRequest} onClose={closeOverview} />
            )}

            {/* Rejection Modal */}
            <RejectionModal />
        </div>
    );
};

// ==================== STYLES OBJECT ====================
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
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
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
    serialNumber: {
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
        position: "relative",
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

export default ChequeBookRequests;