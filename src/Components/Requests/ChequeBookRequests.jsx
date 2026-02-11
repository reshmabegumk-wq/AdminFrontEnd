import React, { useState } from "react";
import {
    FaBook,
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
    FaBuilding,
    FaUserTie,
    FaFileInvoiceDollar,
    FaCalendarAlt,
    FaCheckDouble
} from "react-icons/fa";

const ChequeBookRequests = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const itemsPerPage = 8;

    // Sample data for cheque book requests
    const chequeBookData = [
        {
            id: "CHQ-2024-001",
            accountNumber: "XXXX XXXX 4582",
            accountHolder: "Rajesh Sharma",
            accountType: "Savings",
            requestDate: "2024-03-15",
            leafType: "25 Leaves",
            deliveryMethod: "Branch Pickup",
            status: "pending",
            priority: "medium",
            address: "Andheri East, Mumbai",
            contactNo: "+91 98765 43210",
            email: "rajesh.s@email.com"
        },
        {
            id: "CHQ-2024-002",
            accountNumber: "XXXX XXXX 7891",
            accountHolder: "Priya Patel",
            accountType: "Current",
            requestDate: "2024-03-14",
            leafType: "50 Leaves",
            deliveryMethod: "Courier",
            status: "approved",
            priority: "high",
            address: "Banjara Hills, Hyderabad",
            contactNo: "+91 87654 32109",
            email: "priya.p@email.com"
        },
        {
            id: "CHQ-2024-003",
            accountNumber: "XXXX XXXX 1234",
            accountHolder: "Amit Kumar",
            accountType: "Savings",
            requestDate: "2024-03-14",
            leafType: "100 Leaves",
            deliveryMethod: "Branch Pickup",
            status: "processing",
            priority: "low",
            address: "Connaught Place, Delhi",
            contactNo: "+91 76543 21098",
            email: "amit.k@email.com"
        },
        {
            id: "CHQ-2024-004",
            accountNumber: "XXXX XXXX 5678",
            accountHolder: "Sneha Reddy",
            accountType: "Current",
            requestDate: "2024-03-13",
            leafType: "25 Leaves",
            deliveryMethod: "Courier",
            status: "delivered",
            priority: "medium",
            address: "Jubilee Hills, Hyderabad",
            contactNo: "+91 65432 10987",
            email: "sneha.r@email.com"
        },
        {
            id: "CHQ-2024-005",
            accountNumber: "XXXX XXXX 9012",
            accountHolder: "Vikram Singh",
            accountType: "Savings",
            requestDate: "2024-03-13",
            leafType: "50 Leaves",
            deliveryMethod: "Branch Pickup",
            status: "rejected",
            priority: "high",
            address: "Civil Lines, Jaipur",
            contactNo: "+91 54321 09876",
            email: "vikram.s@email.com"
        },
        {
            id: "CHQ-2024-006",
            accountNumber: "XXXX XXXX 3456",
            accountHolder: "Anjali Nair",
            accountType: "Savings",
            requestDate: "2024-03-12",
            leafType: "25 Leaves",
            deliveryMethod: "Courier",
            status: "pending",
            priority: "low",
            address: "Chembur, Mumbai",
            contactNo: "+91 43210 98765",
            email: "anjali.n@email.com"
        },
        {
            id: "CHQ-2024-007",
            accountNumber: "XXXX XXXX 7890",
            accountHolder: "Suresh Iyer",
            accountType: "Current",
            requestDate: "2024-03-12",
            leafType: "100 Leaves",
            deliveryMethod: "Branch Pickup",
            status: "approved",
            priority: "medium",
            address: "T Nagar, Chennai",
            contactNo: "+91 32109 87654",
            email: "suresh.i@email.com"
        },
        {
            id: "CHQ-2024-008",
            accountNumber: "XXXX XXXX 2345",
            accountHolder: "Neha Gupta",
            accountType: "Savings",
            requestDate: "2024-03-11",
            leafType: "50 Leaves",
            deliveryMethod: "Courier",
            status: "processing",
            priority: "high",
            address: "Salt Lake, Kolkata",
            contactNo: "+91 21098 76543",
            email: "neha.g@email.com"
        }
    ];

    // Filter data based on search and status
    const filteredData = chequeBookData.filter(item => {
        const matchesSearch = 
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.accountHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.accountNumber.includes(searchTerm);
        
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            pending: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", icon: FaClock, text: "Pending" },
            approved: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Approved" },
            processing: { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", icon: FaCheckDouble, text: "Processing" },
            delivered: { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)", icon: FaCheckCircle, text: "Delivered" },
            rejected: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaTimesCircle, text: "Rejected" }
        };

        const config = statusConfig[status] || statusConfig.pending;
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
            high: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", text: "High" },
            medium: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", text: "Medium" },
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

    // Handle view overview
    const handleViewOverview = (request) => {
        setSelectedRequest(request);
        setShowOverview(true);
    };

    // Close overview modal
    const closeOverview = () => {
        setShowOverview(false);
        setSelectedRequest(null);
    };

    // Overview Modal Component
    const RequestOverview = ({ request, onClose }) => {
        if (!request) return null;

        return (
            <div style={styles.modalOverlay} onClick={onClose}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div style={styles.modalHeader}>
                        <div style={styles.modalTitleGroup}>
                            <div style={styles.modalIcon}>
                                <FaBook size={20} color="#FFD700" />
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>Cheque Book Request Details</h3>
                                <p style={styles.modalSubtitle}>Request ID: {request.id}</p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    {/* Modal Body */}
                    <div style={styles.modalBody}>
                        {/* Status Bar */}
                        <div style={styles.statusBar}>
                            <StatusBadge status={request.status} />
                            <PriorityBadge priority={request.priority} />
                        </div>

                        {/* Account Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaUserTie style={styles.sectionIcon} />
                                Account Information
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Account Holder</span>
                                    <span style={styles.infoValue}>{request.accountHolder}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Account Number</span>
                                    <span style={styles.infoValue}>{request.accountNumber}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Account Type</span>
                                    <span style={styles.infoValue}>{request.accountType}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Contact Number</span>
                                    <span style={styles.infoValue}>{request.contactNo}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Email Address</span>
                                    <span style={styles.infoValue}>{request.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cheque Book Details */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaFileInvoiceDollar style={styles.sectionIcon} />
                                Cheque Book Details
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Request Date</span>
                                    <span style={styles.infoValue}>{request.requestDate}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Leaf Type</span>
                                    <span style={styles.infoValue}>{request.leafType}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Delivery Method</span>
                                    <span style={styles.infoValue}>{request.deliveryMethod}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Delivery Address</span>
                                    <span style={styles.infoValue}>{request.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={styles.modalActions}>
                            <button style={styles.approveBtn}>
                                <FaCheckCircle size={14} />
                                Approve Request
                            </button>
                            <button style={styles.rejectBtn}>
                                <FaTimesCircle size={14} />
                                Reject Request
                            </button>
                            <button style={styles.printBtn}>
                                <FaPrint size={14} />
                                Print
                            </button>
                            <button style={styles.downloadBtn}>
                                <FaDownload size={14} />
                                Download
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
                        <FaBook size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Cheque Book Requests</h1>
                        <p style={styles.subtitle}>Manage and process customer cheque book requests</p>
                    </div>
                </div>
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>24</span>
                        <span style={styles.statLabel}>Pending</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>18</span>
                        <span style={styles.statLabel}>Approved</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>8</span>
                        <span style={styles.statLabel}>Processing</span>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by ID, name or account..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <div style={styles.filterGroup}>
                    <FaFilter style={styles.filterIcon} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHead}>
                        <tr>
                            <th style={styles.tableHeader}>Request ID</th>
                            <th style={styles.tableHeader}>Account Holder</th>
                            <th style={styles.tableHeader}>Account No.</th>
                            <th style={styles.tableHeader}>Request Date</th>
                            <th style={styles.tableHeader}>Leaf Type</th>
                            <th style={styles.tableHeader}>Delivery</th>
                            <th style={styles.tableHeader}>Priority</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeader}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item) => (
                            <tr key={item.id} style={styles.tableRow}>
                                <td style={styles.tableCell}>
                                    <span style={styles.requestId}>{item.id}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <span style={styles.accountHolder}>{item.accountHolder}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <span style={styles.accountNumber}>{item.accountNumber}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={styles.dateCell}>
                                        <FaCalendarAlt style={styles.dateIcon} />
                                        {item.requestDate}
                                    </div>
                                </td>
                                <td style={styles.tableCell}>{item.leafType}</td>
                                <td style={styles.tableCell}>
                                    <span style={styles.deliveryMethod}>{item.deliveryMethod}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <PriorityBadge priority={item.priority} />
                                </td>
                                <td style={styles.tableCell}>
                                    <StatusBadge status={item.status} />
                                </td>
                                <td style={styles.tableCell}>
                                    <button
                                        style={styles.viewBtn}
                                        onClick={() => handleViewOverview(item)}
                                        title="View Details"
                                    >
                                        <FaEye size={16} />
                                        <span style={styles.viewText}>View</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* No Data Message */}
                {paginatedData.length === 0 && (
                    <div style={styles.noData}>
                        <FaBook size={48} style={styles.noDataIcon} />
                        <p style={styles.noDataText}>No cheque book requests found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
                <div style={styles.pagination}>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft color="#003366" size={12} />
                    </button>
                    <span style={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight color="#003366" size={12} />
                    </button>
                </div>
            )}

            {/* Overview Modal */}
            {showOverview && selectedRequest && (
                <RequestOverview request={selectedRequest} onClose={closeOverview} />
            )}
        </div>
    );
};

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
        ":focus-within": {
            borderColor: "#FFD700",
            boxShadow: "0 4px 12px rgba(255, 215, 0, 0.1)",
        },
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
        minWidth: "200px",
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
    dateCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#4A6F8F",
    },
    dateIcon: {
        color: "#FFD700",
        fontSize: "12px",
    },
    deliveryMethod: {
        padding: "4px 10px",
        background: "#F0F7FF",
        borderRadius: "20px",
        fontSize: "12px",
        color: "#0052A5",
        fontWeight: "500",
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
            background: "linear-gradient(135deg, #004080, #003366)",
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
        width: "40px",
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
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(16, 185, 129, 0.25)",
        },
    },
    rejectBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "#FFFFFF",
        border: "2px solid #EF4444",
        borderRadius: "14px",
        color: "#EF4444",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            background: "#FEF2F2",
            borderColor: "#DC2626",
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
};

export default ChequeBookRequests;