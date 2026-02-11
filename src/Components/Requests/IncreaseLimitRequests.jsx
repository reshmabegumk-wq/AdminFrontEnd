import React, { useState } from "react";
import {
    FaArrowUp,
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
    FaChartLine,
    FaRupeeSign,
    FaCalendarAlt,
    FaCheckDouble,
    FaShieldAlt,
    FaRegCreditCard
} from "react-icons/fa";

const IncreaseLimitRequests = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const itemsPerPage = 8;

    // Sample data for limit increase requests
    const limitIncreaseData = [
        {
            id: "LIM-2024-001",
            cardNumber: "XXXX XXXX XXXX 4582",
            cardHolder: "Rajesh Sharma",
            cardType: "Visa Platinum",
            currentLimit: "₹1,50,000",
            requestedLimit: "₹3,00,000",
            requestDate: "2024-03-15",
            employmentType: "Salaried",
            annualIncome: "₹12,00,000",
            reason: "Higher education expenses for daughter",
            status: "pending",
            priority: "medium",
            creditScore: "780",
            accountAge: "5 years 2 months",
            contactNo: "+91 98765 43210",
            email: "rajesh.s@email.com",
            monthlyAverage: "₹45,000",
            existingEMI: "₹12,000"
        },
        {
            id: "LIM-2024-002",
            cardNumber: "XXXX XXXX XXXX 7891",
            cardHolder: "Priya Patel",
            cardType: "Mastercard World",
            currentLimit: "₹2,00,000",
            requestedLimit: "₹5,00,000",
            requestDate: "2024-03-14",
            employmentType: "Self-Employed",
            annualIncome: "₹25,00,000",
            reason: "Business expansion and inventory purchase",
            status: "approved",
            priority: "high",
            creditScore: "820",
            accountAge: "3 years 8 months",
            contactNo: "+91 87654 32109",
            email: "priya.p@email.com",
            monthlyAverage: "₹1,20,000",
            existingEMI: "₹25,000"
        },
        {
            id: "LIM-2024-003",
            cardNumber: "XXXX XXXX XXXX 1234",
            cardHolder: "Amit Kumar",
            cardType: "Visa Signature",
            currentLimit: "₹2,50,000",
            requestedLimit: "₹4,00,000",
            requestDate: "2024-03-14",
            employmentType: "Salaried",
            annualIncome: "₹18,00,000",
            reason: "International vacation package",
            status: "processing",
            priority: "low",
            creditScore: "750",
            accountAge: "2 years 1 month",
            contactNo: "+91 76543 21098",
            email: "amit.k@email.com",
            monthlyAverage: "₹65,000",
            existingEMI: "₹8,000"
        },
        {
            id: "LIM-2024-004",
            cardNumber: "XXXX XXXX XXXX 5678",
            cardHolder: "Sneha Reddy",
            cardType: "RuPay Platinum",
            currentLimit: "₹1,00,000",
            requestedLimit: "₹2,00,000",
            requestDate: "2024-03-13",
            employmentType: "Salaried",
            annualIncome: "₹9,00,000",
            reason: "Medical treatment expenses",
            status: "rejected",
            priority: "high",
            creditScore: "680",
            accountAge: "1 year 4 months",
            contactNo: "+91 65432 10987",
            email: "sneha.r@email.com",
            monthlyAverage: "₹38,000",
            existingEMI: "₹5,000"
        },
        {
            id: "LIM-2024-005",
            cardNumber: "XXXX XXXX XXXX 9012",
            cardHolder: "Vikram Singh",
            cardType: "Visa Infinite",
            currentLimit: "₹3,00,000",
            requestedLimit: "₹6,00,000",
            requestDate: "2024-03-13",
            employmentType: "Self-Employed",
            annualIncome: "₹30,00,000",
            reason: "Daughter's wedding arrangements",
            status: "pending",
            priority: "high",
            creditScore: "800",
            accountAge: "7 years 6 months",
            contactNo: "+91 54321 09876",
            email: "vikram.s@email.com",
            monthlyAverage: "₹2,50,000",
            existingEMI: "₹45,000"
        },
        {
            id: "LIM-2024-006",
            cardNumber: "XXXX XXXX XXXX 3456",
            cardHolder: "Anjali Nair",
            cardType: "Mastercard Titanium",
            currentLimit: "₹80,000",
            requestedLimit: "₹1,50,000",
            requestDate: "2024-03-12",
            employmentType: "Salaried",
            annualIncome: "₹7,50,000",
            reason: "Home renovation and furniture",
            status: "approved",
            priority: "low",
            creditScore: "720",
            accountAge: "8 months",
            contactNo: "+91 43210 98765",
            email: "anjali.n@email.com",
            monthlyAverage: "₹32,000",
            existingEMI: "₹0"
        },
        {
            id: "LIM-2024-007",
            cardNumber: "XXXX XXXX XXXX 7890",
            cardHolder: "Suresh Iyer",
            cardType: "Visa Platinum",
            currentLimit: "₹1,80,000",
            requestedLimit: "₹3,50,000",
            requestDate: "2024-03-12",
            employmentType: "Salaried",
            annualIncome: "₹15,00,000",
            reason: "New car down payment",
            status: "processing",
            priority: "medium",
            creditScore: "760",
            accountAge: "4 years 2 months",
            contactNo: "+91 32109 87654",
            email: "suresh.i@email.com",
            monthlyAverage: "₹55,000",
            existingEMI: "₹15,000"
        },
        {
            id: "LIM-2024-008",
            cardNumber: "XXXX XXXX XXXX 2345",
            cardHolder: "Neha Gupta",
            cardType: "RuPay Select",
            currentLimit: "₹60,000",
            requestedLimit: "₹1,00,000",
            requestDate: "2024-03-11",
            employmentType: "Salaried",
            annualIncome: "₹6,00,000",
            reason: "Premium shopping needs",
            status: "rejected",
            priority: "low",
            creditScore: "650",
            accountAge: "8 months",
            contactNo: "+91 21098 76543",
            email: "neha.g@email.com",
            monthlyAverage: "₹25,000",
            existingEMI: "₹3,000"
        }
    ];

    // Filter data based on search and status
    const filteredData = limitIncreaseData.filter(item => {
        const matchesSearch = 
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.cardHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.cardNumber.includes(searchTerm);
        
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

    // Credit score badge
    const CreditScoreBadge = ({ score }) => {
        let color, bg, text;
        const numScore = parseInt(score);
        
        if (numScore >= 800) {
            color = "#10B981";
            bg = "rgba(16, 185, 129, 0.1)";
            text = "Excellent";
        } else if (numScore >= 750) {
            color = "#3B82F6";
            bg = "rgba(59, 130, 246, 0.1)";
            text = "Good";
        } else if (numScore >= 700) {
            color = "#F59E0B";
            bg = "rgba(245, 158, 11, 0.1)";
            text = "Fair";
        } else {
            color = "#EF4444";
            bg = "rgba(239, 68, 68, 0.1)";
            text = "Poor";
        }

        return (
            <span style={{
                padding: "4px 10px",
                background: bg,
                color: color,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600",
                whiteSpace: "nowrap"
            }}>
                {score} • {text}
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
                    {/* Modal Header - Exact same design */}
                    <div style={styles.modalHeader}>
                        <div style={styles.modalTitleGroup}>
                            <div style={styles.modalIcon}>
                                <FaArrowUp size={20} color="#FFD700" />
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>Limit Increase Request</h3>
                                <p style={styles.modalSubtitle}>Request ID: {request.id}</p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    {/* Modal Body */}
                    <div style={styles.modalBody}>
                        {/* Status Bar - Three badges now */}
                        <div style={styles.statusBar}>
                            <StatusBadge status={request.status} />
                            <PriorityBadge priority={request.priority} />
                            <CreditScoreBadge score={request.creditScore} />
                        </div>

                        {/* Cardholder Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaRegCreditCard style={styles.sectionIcon} />
                                Cardholder Information
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Cardholder Name</span>
                                    <span style={styles.infoValue}>{request.cardHolder}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Card Number</span>
                                    <span style={styles.infoValue}>{request.cardNumber}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Card Type</span>
                                    <span style={styles.infoValue}>{request.cardType}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Account Age</span>
                                    <span style={styles.infoValue}>{request.accountAge}</span>
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

                        {/* Limit Details - Special design for limit comparison */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaChartLine style={styles.sectionIcon} />
                                Limit Details
                            </h4>
                            <div style={styles.limitComparison}>
                                <div style={styles.limitBox}>
                                    <span style={styles.limitBoxLabel}>Current Limit</span>
                                    <span style={styles.currentLimitValue}>{request.currentLimit}</span>
                                </div>
                                <div style={styles.limitArrow}>
                                    <FaArrowUp style={{ color: "#FFD700", fontSize: "20px" }} />
                                </div>
                                <div style={styles.limitBox}>
                                    <span style={styles.limitBoxLabel}>Requested Limit</span>
                                    <span style={styles.requestedLimitValue}>{request.requestedLimit}</span>
                                </div>
                            </div>
                            <div style={styles.limitDifference}>
                                <span style={styles.differenceLabel}>Increase Amount:</span>
                                <span style={styles.differenceValue}>
                                    {request.requestedLimit} - {request.currentLimit}
                                </span>
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaRupeeSign style={styles.sectionIcon} />
                                Financial Profile
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Employment Type</span>
                                    <span style={styles.infoValue}>{request.employmentType}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Annual Income</span>
                                    <span style={styles.infoValue}>{request.annualIncome}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Monthly Average</span>
                                    <span style={styles.infoValue}>{request.monthlyAverage}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Existing EMI</span>
                                    <span style={styles.infoValue}>{request.existingEMI}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Credit Score</span>
                                    <span style={styles.infoValue}>
                                        <CreditScoreBadge score={request.creditScore} />
                                    </span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Request Date</span>
                                    <span style={styles.infoValue}>{request.requestDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Reason for Request */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaCalendarAlt style={styles.sectionIcon} />
                                Request Reason
                            </h4>
                            <div style={styles.reasonContainer}>
                                <p style={styles.reasonText}>{request.reason}</p>
                            </div>
                        </div>

                        {/* Action Buttons - Exact same design */}
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
            {/* Header Section - Exact same design */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>
                        <FaArrowUp size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Limit Increase Requests</h1>
                        <p style={styles.subtitle}>Review and process credit card limit enhancement requests</p>
                    </div>
                </div>
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>2</span>
                        <span style={styles.statLabel}>Pending</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>2</span>
                        <span style={styles.statLabel}>Approved</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>2</span>
                        <span style={styles.statLabel}>Processing</span>
                    </div>
                </div>
            </div>

            {/* Filters Section - Exact same design */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by ID, cardholder or card number..."
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
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table Section - Exact same design with more columns */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHead}>
                        <tr>
                            <th style={styles.tableHeader}>Request ID</th>
                            <th style={styles.tableHeader}>Cardholder</th>
                            <th style={styles.tableHeader}>Card Number</th>
                            <th style={styles.tableHeader}>Current Limit</th>
                            <th style={styles.tableHeader}>Requested Limit</th>
                            <th style={styles.tableHeader}>Request Date</th>
                            <th style={styles.tableHeader}>Credit Score</th>
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
                                    <span style={styles.accountHolder}>{item.cardHolder}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <span style={styles.accountNumber}>{item.cardNumber}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <span style={styles.currentLimitCell}>{item.currentLimit}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <span style={styles.requestedLimitCell}>{item.requestedLimit}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={styles.dateCell}>
                                        <FaCalendarAlt style={styles.dateIcon} />
                                        {item.requestDate}
                                    </div>
                                </td>
                                <td style={styles.tableCell}>
                                    <CreditScoreBadge score={item.creditScore} />
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

                {/* No Data Message - Exact same design */}
                {paginatedData.length === 0 && (
                    <div style={styles.noData}>
                        <FaArrowUp size={48} style={styles.noDataIcon} />
                        <p style={styles.noDataText}>No limit increase requests found</p>
                    </div>
                )}
            </div>

            {/* Pagination - Exact same design */}
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

// Complete styles object - EXACT copy from ChequeBookRequests with additions for limit-specific elements
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
    currentLimitCell: {
        color: "#4A6F8F",
        fontWeight: "500",
    },
    requestedLimitCell: {
        color: "#10B981",
        fontWeight: "600",
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
    // New styles for limit comparison
    limitComparison: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        background: "#F8FBFF",
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "12px",
    },
    limitBox: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        background: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 51, 102, 0.05)",
    },
    limitBoxLabel: {
        fontSize: "12px",
        color: "#6B8BA4",
        fontWeight: "500",
        marginBottom: "8px",
    },
    currentLimitValue: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#4A6F8F",
    },
    requestedLimitValue: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#10B981",
    },
    limitArrow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    limitDifference: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        padding: "12px",
        background: "rgba(255, 215, 0, 0.1)",
        borderRadius: "10px",
    },
    differenceLabel: {
        fontSize: "13px",
        color: "#4A6F8F",
        fontWeight: "500",
    },
    differenceValue: {
        fontSize: "14px",
        color: "#003366",
        fontWeight: "700",
    },
    reasonContainer: {
        background: "#F8FBFF",
        padding: "20px",
        borderRadius: "16px",
    },
    reasonText: {
        fontSize: "15px",
        color: "#003366",
        margin: 0,
        lineHeight: "1.6",
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
    },
};

export default IncreaseLimitRequests;