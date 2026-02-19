import React, { useState, useEffect, useRef } from "react";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";
import {
    FaQuestionCircle,
    FaEye,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaFilter,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaUser,
    FaCalendarAlt,
    FaSync,
    FaFileAlt,
    FaReply,
    FaBan,
    FaEdit
} from "react-icons/fa";

const CustomerQueries = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const [queries, setQueries] = useState([]);
    const [queryDetails, setQueryDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    const inputRef = useRef(null);
    const responseInputRef = useRef(null);

    // Fetch customer queries from API
    const fetchQueries = async (page = 0) => {
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

            console.log("Fetching queries with payload:", payload);

            // Check if API is properly configured
            if (!API || !API.defaults) {
                console.error("API not properly configured");
                showSnackbar("error", "API configuration error. Please check your connection.");
                setQueries([]);
                setPaginationData(null);
                setIsLoading(false);
                return;
            }

            const response = await API.post("queriesResponse/adminQueriesList", payload, {
                signal: abortControllerRef.current.signal,
                timeout: 30000
            });

            console.log("API Response Status:", response.status);
            console.log("API Response Data:", response.data);

            if (response?.data?.status === true && response?.data?.data) {
                // Check for duplicate keys and log warning
                const content = response.data.data.content || [];
                const uniqueIds = new Set();
                const duplicates = [];

                content.forEach(item => {
                    if (uniqueIds.has(item.queriesId)) {
                        duplicates.push(item.queriesId);
                    }
                    uniqueIds.add(item.queriesId);
                });

                if (duplicates.length > 0) {
                    console.warn(`Found duplicate queriesId values: ${duplicates.join(', ')}`);
                }

                setQueries(content);
                setPaginationData({
                    pageNumber: response.data.data.pageNumber,
                    pageSize: response.data.data.pageSize,
                    totalElements: response.data.data.totalElements,
                    totalPages: response.data.data.totalPages,
                    last: response.data.data.last
                });
            } else {
                setQueries([]);
                setPaginationData(null);
                console.error("API returned status: false", response.data);
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
                showSnackbar("error", "Failed to load customer queries. Please try again.");
            }

            setQueries([]);
            setPaginationData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch statistics
    const fetchStats = async () => {
        try {
            const response = await API.get("queriesResponse/count", {
                timeout: 30000
            });
            console.log("Stats response:", response.data);
            if (response?.data?.status === true && response?.data?.data) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Don't show error for stats to avoid too many messages
        }
    };

    useEffect(() => {
        fetchQueries(currentPage);
        fetchStats();

        // Cleanup function to cancel requests on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [currentPage, statusFilter]);

    // Focus input when rejection modal opens
    useEffect(() => {
        if (showRejectReason && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [showRejectReason]);

    // Focus input when response modal opens
    useEffect(() => {
        if (showResponseModal && responseInputRef.current) {
            setTimeout(() => {
                responseInputRef.current.focus();
            }, 100);
        }
    }, [showResponseModal]);

    // Handle search functionality
    const filteredData = queries?.filter(item => {
        const queryId = `Q-${item.queriesId}`.toLowerCase();
        const accountNumber = item.accountNumber?.toString() || "";
        const fullName = item.fullName?.toLowerCase() || "";
        const email = item.email?.toLowerCase() || "";
        const customerQuery = item.customerQuery?.toLowerCase() || "";
        const searchLower = searchTerm.toLowerCase();

        return queryId.includes(searchLower) ||
            accountNumber.includes(searchLower) ||
            fullName.includes(searchLower) ||
            email.includes(searchLower) ||
            customerQuery.includes(searchLower);
    });

    const handleRefresh = () => {
        setCurrentPage(0);
        fetchQueries(0);
        fetchStats();
    };

    const handleStatusFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setCurrentPage(0);
    };

    const fetchQueryDetails = async (id) => {
        try {
            const res = await API.get(`queriesResponse/queryBy/${id}`, {
                timeout: 30000
            });
            console.log("Details response:", res.data);
            if (res.data && res.data.status === true && res.data.data) {
                setQueryDetails(res.data.data);
                return res.data.data;
            }
            return null;
        } catch (error) {
            console.log("Error fetching query details:", error);
            showSnackbar("error", "Failed to fetch query details");
            setQueryDetails(null);
            return null;
        }
    };

    const updateQueryStatus = async (id, action, remarks, response = "") => {
        setIsSubmitting(true);
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                showSnackbar("error", "User not authenticated");
                setIsSubmitting(false);
                return null;
            }

            const payload = {
                action: action,
                approvedById: parseInt(userId),
                remarks: remarks,
                queryResponse: response || remarks // Use response if provided, otherwise use remarks
            };

            console.log("Update payload:", payload);

            const res = await API.post(`queriesResponse/queryUpdateAdmin/${id}`, payload, {
                timeout: 30000
            });

            console.log("Update response:", res.data);

            if (res.data && res.data.status === true) {
                showSnackbar("success", `Query ${action.toLowerCase()}d successfully with response`);
                setIsSubmitting(false);
                return res.data;
            } else {
                showSnackbar("error", res.data?.message || `Failed to ${action.toLowerCase()} query`);
                setIsSubmitting(false);
                return null;
            }
        } catch (error) {
            console.log("Error updating query status:", error);
            showSnackbar("error", "Failed to update query status");
            setIsSubmitting(false);
            return null;
        }
    };

    const handleViewOverview = async (item) => {
        setSelectedQuery(item);
        setShowOverview(true);
        await fetchQueryDetails(item.queriesId);
    };

    const handleApproveWithResponse = () => {
        setShowResponseModal(true);
        setResponseText("");
    };

    const handleSubmitApproveWithResponse = async () => {
        if (!responseText.trim()) {
            showSnackbar("error", "Please provide a response message");
            return;
        }

        try {
            const queryId = queryDetails?.queriesId || selectedQuery?.queriesId;
            if (!queryId) {
                showSnackbar("error", "Query ID not found");
                return;
            }

            const result = await updateQueryStatus(
                queryId,
                "APPROVE",
                responseText, // Using response text as remarks
                responseText
            );

            if (result) {
                setShowResponseModal(false);
                setResponseText("");
                closeOverview();
                fetchQueries(currentPage);
                fetchStats();
            }
        } catch (error) {
            console.log("Error approving query with response:", error);
            showSnackbar("error", "Failed to approve query");
        }
    };

    const handleRejectWithResponse = () => {
        setShowRejectReason(true);
        setRejectReason("");
    };

    const handleSubmitRejection = async () => {
        if (!rejectReason.trim()) {
            showSnackbar("error", "Please provide a reason for rejection");
            return;
        }

        try {
            const queryId = queryDetails?.queriesId || selectedQuery?.queriesId;
            if (!queryId) {
                showSnackbar("error", "Query ID not found");
                return;
            }

            const result = await updateQueryStatus(
                queryId,
                "REJECT",
                rejectReason,
                rejectReason
            );

            if (result) {
                // Reset states after successful rejection
                setShowRejectReason(false);
                setRejectReason("");
                closeOverview();
                fetchQueries(currentPage);
                fetchStats();
            }
        } catch (error) {
            console.log("Error rejecting query:", error);
            showSnackbar("error", "Failed to reject query");
        }
    };

    const handleCancelRejection = () => {
        setShowRejectReason(false);
        setRejectReason("");
    };

    const handleCancelResponse = () => {
        setShowResponseModal(false);
        setResponseText("");
    };

    const closeOverview = () => {
        setShowOverview(false);
        setSelectedQuery(null);
        setQueryDetails(null);
        // Also ensure rejection modal is closed and reason is cleared
        setShowRejectReason(false);
        setRejectReason("");
        setShowResponseModal(false);
        setResponseText("");
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            APPROVED: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Approved" },
            REJECTED: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaBan, text: "Rejected" },
            PENDING: { color: "#F97316", bg: "rgba(249, 115, 22, 0.1)", icon: FaClock, text: "Pending" }
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const QueryModal = ({ request, onClose }) => {
        if (!request) return null;

        // Use the detailed data if available, otherwise use the request data from the table
        const displayData = queryDetails || request;

        console.log("Modal display data:", displayData); // Debug log

        return (
            <div style={styles.modalOverlay} onClick={onClose}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.modalHeader}>
                        <div style={styles.modalTitleGroup}>
                            <div style={styles.modalIcon}>
                                <FaQuestionCircle size={20} color="#FFD700" />
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>Customer Query Details</h3>
                                <p style={styles.modalSubtitle}>Query ID: Q-{displayData.queriesId}</p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    <div style={styles.modalBody}>
                        {/* Status Bar */}
                        <div style={styles.statusBar}>
                            <StatusBadge status={displayData.status} />
                        </div>

                        {/* Customer Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaUser style={styles.sectionIcon} />
                                Customer Information
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Customer Name</span>
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

                        {/* Query Details */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaFileAlt style={styles.sectionIcon} />
                                Query Details
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={{ ...styles.infoRow, gridColumn: "span 2" }}>
                                    <span style={styles.infoLabel}>Query</span>
                                    <span style={styles.infoValue}>{displayData.customerQuery || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Raised Date</span>
                                    <span style={styles.infoValue}>{formatDate(displayData.queryRaisedDate) || "N/A"}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Status</span>
                                    <span style={styles.infoValue}>{displayData.status || "N/A"}</span>
                                </div>

                                {/* Response Section - Show for Approved/Rejected queries */}
                                {(displayData.status === "APPROVED" || displayData.status === "REJECTED") && (
                                    <>
                                        {displayData.queryResponse && (
                                            <div style={{ ...styles.infoRow, gridColumn: "span 2" }}>
                                                <span style={styles.infoLabel}>
                                                    {displayData.status === "APPROVED" ? "Approval Response" : "Rejection Reason"}
                                                </span>
                                                <span style={{
                                                    ...styles.infoValue,
                                                    background: displayData.status === "APPROVED" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                                    padding: "12px",
                                                    borderRadius: "8px",
                                                    color: displayData.status === "APPROVED" ? "#065F46" : "#991B1B",
                                                    fontWeight: "500",
                                                    lineHeight: "1.5",
                                                    whiteSpace: "pre-wrap"
                                                }}>
                                                    {displayData.queryResponse}
                                                </span>
                                            </div>
                                        )}
                                        {displayData.remarks && displayData.remarks !== displayData.queryResponse && (
                                            <div style={{ ...styles.infoRow, gridColumn: "span 2" }}>
                                                <span style={styles.infoLabel}>Additional Remarks</span>
                                                <span style={styles.infoValue}>{displayData.remarks}</span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Show existing response for completed queries */}
                                {displayData.queryResponse && displayData.status !== "APPROVED" && displayData.status !== "REJECTED" && (
                                    <div style={{ ...styles.infoRow, gridColumn: "span 2" }}>
                                        <span style={styles.infoLabel}>Response</span>
                                        <span style={styles.infoValue}>{displayData.queryResponse}</span>
                                    </div>
                                )}

                                {displayData.queryApprovedDate && (
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Approved Date</span>
                                        <span style={styles.infoValue}>{formatDate(displayData.queryApprovedDate)}</span>
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

                        {/* Action Buttons - Only show for pending requests */}
                        {displayData.status === "PENDING" && !isSubmitting && (
                            <div style={styles.modalActions}>
                                <button
                                    style={styles.rejectBtn}
                                    onClick={handleRejectWithResponse}
                                    disabled={isSubmitting}
                                >
                                    <FaBan size={14} />
                                    Reject with Response
                                </button>
                                <button
                                    style={styles.approveBtn}
                                    onClick={handleApproveWithResponse}
                                    disabled={isSubmitting}
                                >
                                    <FaCheckCircle size={14} />
                                    Approve with Response
                                </button>
                            </div>
                        )}
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
                <div
                    style={styles.rejectModalContent}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={styles.rejectModalHeader}>
                        <h3 style={styles.rejectModalTitle}>
                            <FaBan size={16} style={{ marginRight: "8px", color: "#DC2626" }} />
                            Reject Request
                        </h3>
                        <button
                            style={styles.rejectCloseBtn}
                            onClick={handleCancelRejection}
                            disabled={isSubmitting}
                        >
                            ×
                        </button>
                    </div>

                    <div style={styles.rejectModalBody}>
                        <div style={styles.rejectFieldGroup}>
                            <label style={styles.rejectLabel}>Rejection Reason *</label>
                            <input
                                ref={inputRef}
                                type="text"
                                style={styles.rejectInput}
                                placeholder="Please provide a reason for rejecting this request..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                autoFocus
                                disabled={isSubmitting}
                                dir="ltr"
                            />
                            <div style={styles.rejectCharCount}>
                                {rejectReason.length}/500
                            </div>
                        </div>

                        <div style={styles.rejectModalActions}>
                            <button
                                style={styles.rejectCancelBtn}
                                onClick={handleCancelRejection}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.rejectSubmitBtn}
                                onClick={handleSubmitRejection}
                                disabled={!rejectReason.trim() || isSubmitting}
                            >
                                <FaBan size={14} />
                                {isSubmitting ? "Submitting..." : "Submit Rejection"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Response Modal for Approvals
    const ResponseModal = () => {
        if (!showResponseModal) return null;

        return (
            <div style={styles.responseModalOverlay} onClick={handleCancelResponse}>
                <div
                    style={styles.responseModalContent}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={styles.responseModalHeader}>
                        <h3 style={styles.responseModalTitle}>
                            <FaCheckCircle size={16} style={{ marginRight: "8px", color: "#10B981" }} />
                            Approve Request
                        </h3>
                        <button
                            style={styles.responseCloseBtn}
                            onClick={handleCancelResponse}
                            disabled={isSubmitting}
                        >
                            ×
                        </button>
                    </div>

                    <div style={styles.responseModalBody}>
                        <div style={styles.responseFieldGroup}>
                            <label style={styles.responseLabel}>Approval Response *</label>
                            <input
                                ref={responseInputRef}
                                type="text"
                                style={styles.responseInput}
                                placeholder="Please provide a response to the customer's query..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                autoFocus
                                disabled={isSubmitting}
                                dir="ltr"
                            />
                            <div style={styles.responseCharCount}>
                                {responseText.length}/500
                            </div>
                        </div>

                        <div style={styles.responseModalActions}>
                            <button
                                style={styles.responseCancelBtn}
                                onClick={handleCancelResponse}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.responseSubmitBtn}
                                onClick={handleSubmitApproveWithResponse}
                                disabled={!responseText.trim() || isSubmitting}
                            >
                                <FaCheckCircle size={14} />
                                {isSubmitting ? "Submitting..." : "Submit Approval"}
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
                        <FaQuestionCircle size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Customer Queries Management</h1>
                        <p style={styles.subtitle}>Manage and respond to customer inquiries</p>
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
                        placeholder="Search by query ID, account number, customer name, email or query..."
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
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHead}>
                        <tr>
                            <th style={styles.tableHeader}>S.No</th>
                            <th style={styles.tableHeader}>QUERY ID</th>
                            <th style={styles.tableHeader}>CUSTOMER</th>
                            <th style={styles.tableHeader}>ACCOUNT NO.</th>
                            <th style={styles.tableHeader}>QUERY</th>
                            <th style={styles.tableHeader}>RAISED DATE</th>
                            <th style={styles.tableHeader}>STATUS</th>
                            <th style={styles.tableHeader}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="8" style={styles.loadingCell}>
                                    <div style={styles.loadingContainer}>
                                        <div style={styles.loader}></div>
                                        <span style={styles.loadingText}>Loading customer queries...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={`${item.queriesId}-${index}`} style={styles.tableRow}>
                                    <td style={styles.tableCell}>
                                        <span style={styles.serialNumber}>
                                            {(currentPage * itemsPerPage) + index + 1}
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.requestId}>Q-{item.queriesId}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.customerInfo}>
                                            <span style={styles.accountHolder}>{item.fullName || "N/A"}</span>
                                            <span style={styles.customerEmail}>{item.email || "No email"}</span>
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.accountNumber}>{item.accountNumber || "XXXX XXXX"}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.queryText} title={item.customerQuery}>
                                            {item.customerQuery?.substring(0, 40)}
                                            {item.customerQuery?.length > 40 ? '...' : ''}
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.dateCell}>
                                            <FaCalendarAlt style={styles.dateIcon} />
                                            {formatDate(item.queryRaisedDate)}
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td style={styles.tableCell}>
                                        <button
                                            style={styles.viewBtn}
                                            onClick={() => handleViewOverview(item)}
                                            disabled={isSubmitting}
                                        >
                                            <FaEye size={16} />
                                            <span style={styles.viewText}>View</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={styles.noDataCell}>
                                    <div style={styles.noData}>
                                        <FaQuestionCircle size={48} style={styles.noDataIcon} />
                                        <p style={styles.noDataText}>No customer queries found</p>
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
                        disabled={currentPage === 0 || isSubmitting}
                    >
                        <FaChevronLeft size={16} />
                    </button>
                    <span style={styles.pageInfo}>
                        Page {currentPage + 1} of {paginationData.totalPages} ({paginationData.totalElements} total)
                    </span>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages - 1))}
                        disabled={currentPage === paginationData.totalPages - 1 || isSubmitting}
                    >
                        <FaChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Overview Modal */}
            {showOverview && selectedQuery && (
                <QueryModal request={selectedQuery} onClose={closeOverview} />
            )}

            {/* Rejection Modal */}
            <RejectionModal />

            {/* Response Modal for Approvals */}
            <ResponseModal />
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
    serialNumber: {
        fontWeight: "600",
        color: "#003366",
        fontFamily: "monospace",
    },
    requestId: {
        fontWeight: "600",
        color: "#003366",
        fontFamily: "monospace",
    },
    customerInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    accountHolder: {
        fontWeight: "500",
        color: "#1E293B",
    },
    customerEmail: {
        fontSize: "11px",
        color: "#6B8BA4",
    },
    accountNumber: {
        fontFamily: "monospace",
        color: "#4A6F8F",
    },
    queryText: {
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "#1E293B",
        fontSize: "13px",
        cursor: "pointer",
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
        ":disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
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
    noDataCell: {
        padding: "0",
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
    rejectBtn: {
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
        ":disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
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
        ":disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
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
        ":disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
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
        outline: "none",
        transition: "all 0.2s ease",
        ":focus": {
            borderColor: "#DC2626",
            boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
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
        ":disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
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
    // Response Modal Styles (for Approvals)
    responseModalOverlay: {
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
    responseModalContent: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "0",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        position: "relative",
    },
    responseModalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 28px",
        borderBottom: "1px solid #E6EDF5",
        background: "linear-gradient(135deg, #F0FDF4, #FFFFFF)",
        borderRadius: "20px 20px 0 0",
    },
    responseModalTitle: {
        display: "flex",
        alignItems: "center",
        fontSize: "18px",
        fontWeight: "700",
        color: "#10B981",
        margin: 0,
    },
    responseCloseBtn: {
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
            borderColor: "#10B981",
            color: "#10B981",
            background: "#F0FDF4",
        },
        ":disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
        },
    },
    responseModalBody: {
        padding: "28px",
    },
    responseFieldGroup: {
        marginBottom: "24px",
    },
    responseLabel: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#1E293B",
        marginBottom: "8px",
    },
    responseInput: {
        width: "100%",
        padding: "14px 16px",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        fontSize: "14px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        outline: "none",
        transition: "all 0.2s ease",
        ":focus": {
            borderColor: "#10B981",
            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
        },
    },
    responseCharCount: {
        textAlign: "right",
        fontSize: "12px",
        color: "#6B8BA4",
        marginTop: "6px",
        fontWeight: "500",
    },
    responseModalActions: {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end",
        paddingTop: "8px",
    },
    responseCancelBtn: {
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
        ":disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
        },
    },
    responseSubmitBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        background: "linear-gradient(135deg, #10B981, #059669)",
        border: "none",
        borderRadius: "10px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
        },
        ":disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
            transform: "none",
            boxShadow: "none",
        },
    },
};

// Add global keyframes for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

export default CustomerQueries;