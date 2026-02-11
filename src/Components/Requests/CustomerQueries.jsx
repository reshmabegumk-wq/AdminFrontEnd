import React, { useState } from "react";
import {
    FaQuestionCircle,
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
    FaUserTie,
    FaEnvelope,
    FaPhone,
    FaTag,
    FaReply,
    FaCheckDouble,
    FaExclamationTriangle,
    FaShieldAlt,
    FaArrowUp,
    FaArrowDown,
    FaPaperclip,
    FaCalendarAlt
} from "react-icons/fa";

const CustomerQueries = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const itemsPerPage = 8;

    // Sample data for customer queries
    const customerQueriesData = [
        {
            id: "QRY-2024-001",
            customerName: "Rajesh Sharma",
            customerId: "CUST-4582",
            email: "rajesh.s@email.com",
            phone: "+91 98765 43210",
            category: "Account",
            subCategory: "Account Statement",
            subject: "Unable to download December 2023 statement",
            description: "I've been trying to download my December 2023 account statement but keep getting an error message. Need assistance urgently.",
            priority: "high",
            status: "open",
            createdDate: "2024-03-15",
            createdTime: "09:30",
            assignedTo: "Priya Sharma",
            lastUpdated: "2024-03-15",
            lastUpdatedTime: "11:45",
            attachment: "Yes"
        },
        {
            id: "QRY-2024-002",
            customerName: "Priya Patel",
            customerId: "CUST-7891",
            email: "priya.p@email.com",
            phone: "+91 87654 32109",
            category: "Credit Card",
            subCategory: "Transaction Dispute",
            subject: "Unauthorized transaction on my credit card",
            description: "There is an unauthorized transaction of ₹5,299 from an online merchant. I did not make this purchase.",
            priority: "urgent",
            status: "in-progress",
            createdDate: "2024-03-14",
            createdTime: "14:20",
            assignedTo: "Amit Kumar",
            lastUpdated: "2024-03-15",
            lastUpdatedTime: "10:15",
            attachment: "Yes"
        },
        {
            id: "QRY-2024-003",
            customerName: "Amit Kumar",
            customerId: "CUST-1234",
            email: "amit.k@email.com",
            phone: "+91 76543 21098",
            category: "Net Banking",
            subCategory: "Login Issues",
            subject: "Unable to login to net banking",
            description: "I'm unable to login to my net banking account. It says 'Invalid credentials' even after resetting password.",
            priority: "high",
            status: "pending",
            createdDate: "2024-03-14",
            createdTime: "18:45",
            assignedTo: "Unassigned",
            lastUpdated: "2024-03-14",
            lastUpdatedTime: "18:45",
            attachment: "No"
        },
        {
            id: "QRY-2024-004",
            customerName: "Sneha Reddy",
            customerId: "CUST-5678",
            email: "sneha.r@email.com",
            phone: "+91 65432 10987",
            category: "Loan",
            subCategory: "Home Loan",
            subject: "Home loan interest rate query",
            description: "I would like to know the current interest rates for home loan. I'm planning to apply for a loan of ₹35L.",
            priority: "medium",
            status: "resolved",
            createdDate: "2024-03-13",
            createdTime: "11:20",
            assignedTo: "Neha Gupta",
            lastUpdated: "2024-03-14",
            lastUpdatedTime: "15:30",
            attachment: "No"
        },
        {
            id: "QRY-2024-005",
            customerName: "Vikram Singh",
            customerId: "CUST-9012",
            email: "vikram.s@email.com",
            phone: "+91 54321 09876",
            category: "Credit Card",
            subCategory: "Reward Points",
            subject: "Reward points not credited",
            description: "I made a transaction of ₹15,000 on March 10th but the reward points haven't been credited yet.",
            priority: "low",
            status: "open",
            createdDate: "2024-03-13",
            createdTime: "15:50",
            assignedTo: "Rajesh Kumar",
            lastUpdated: "2024-03-13",
            lastUpdatedTime: "16:20",
            attachment: "Yes"
        },
        {
            id: "QRY-2024-006",
            customerName: "Anjali Nair",
            customerId: "CUST-3456",
            email: "anjali.n@email.com",
            phone: "+91 43210 98765",
            category: "Debit Card",
            subCategory: "Card Block",
            subject: "Block my debit card",
            description: "I've misplaced my debit card. Please block it immediately and guide me through replacement process.",
            priority: "urgent",
            status: "in-progress",
            createdDate: "2024-03-12",
            createdTime: "08:30",
            assignedTo: "Suresh Iyer",
            lastUpdated: "2024-03-12",
            lastUpdatedTime: "14:15",
            attachment: "No"
        },
        {
            id: "QRY-2024-007",
            customerName: "Suresh Iyer",
            customerId: "CUST-7890",
            email: "suresh.i@email.com",
            phone: "+91 32109 87654",
            category: "Mobile Banking",
            subCategory: "App Issues",
            subject: "App crashing on startup",
            description: "The ABC Bank mobile app crashes immediately after opening. I've tried reinstalling but still same issue.",
            priority: "high",
            status: "pending",
            createdDate: "2024-03-12",
            createdTime: "20:15",
            assignedTo: "Unassigned",
            lastUpdated: "2024-03-12",
            lastUpdatedTime: "20:15",
            attachment: "No"
        },
        {
            id: "QRY-2024-008",
            customerName: "Neha Gupta",
            customerId: "CUST-2345",
            email: "neha.g@email.com",
            phone: "+91 21098 76543",
            category: "Fixed Deposit",
            subCategory: "FD Maturity",
            subject: "FD maturity proceeds not credited",
            description: "My fixed deposit matured on March 10th but the amount hasn't been credited to my savings account.",
            priority: "medium",
            status: "resolved",
            createdDate: "2024-03-11",
            createdTime: "13:45",
            assignedTo: "Priya Sharma",
            lastUpdated: "2024-03-13",
            lastUpdatedTime: "09:30",
            attachment: "Yes"
        },
        {
            id: "QRY-2024-009",
            customerName: "Rahul Verma",
            customerId: "CUST-6789",
            email: "rahul.v@email.com",
            phone: "+91 10987 65432",
            category: "UPI",
            subCategory: "Transaction Failed",
            subject: "UPI transaction failed but amount debited",
            description: "UPI transaction of ₹2,500 failed but amount was debited from my account. Transaction ID: UPI123456789",
            priority: "high",
            status: "open",
            createdDate: "2024-03-11",
            createdTime: "10:30",
            assignedTo: "Amit Kumar",
            lastUpdated: "2024-03-11",
            lastUpdatedTime: "11:45",
            attachment: "Yes"
        },
        {
            id: "QRY-2024-010",
            customerName: "Kavita Singh",
            customerId: "CUST-4567",
            email: "kavita.s@email.com",
            phone: "+91 99887 76655",
            category: "Account",
            subCategory: "Address Change",
            subject: "Update residential address",
            description: "I need to update my residential address in your records. New address: B-201, Green Heights, Pune.",
            priority: "low",
            status: "pending",
            createdDate: "2024-03-10",
            createdTime: "16:20",
            assignedTo: "Unassigned",
            lastUpdated: "2024-03-10",
            lastUpdatedTime: "16:20",
            attachment: "Yes"
        }
    ];

    // Filter data based on search, status and category
    const filteredData = customerQueriesData.filter(item => {
        const matchesSearch = 
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.customerId.includes(searchTerm);
        
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            open: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", icon: FaQuestionCircle, text: "Open" },
            "in-progress": { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", icon: FaCheckDouble, text: "In Progress" },
            pending: { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)", icon: FaClock, text: "Pending" },
            resolved: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Resolved" }
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
            urgent: { color: "#DC2626", bg: "rgba(220, 38, 38, 0.1)", icon: FaExclamationTriangle, text: "Urgent" },
            high: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaArrowUp, text: "High" },
            medium: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", icon: FaClock, text: "Medium" },
            low: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaArrowDown, text: "Low" }
        };

        const config = priorityConfig[priority] || priorityConfig.medium;
        const Icon = config.icon;

        return (
            <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                background: config.bg,
                color: config.color,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600"
            }}>
                <Icon size={11} />
                {config.text}
            </span>
        );
    };

    // Category badge
    const CategoryBadge = ({ category }) => {
        const categoryColors = {
            "Account": { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
            "Credit Card": { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)" },
            "Debit Card": { color: "#EC4899", bg: "rgba(236, 72, 153, 0.1)" },
            "Net Banking": { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
            "Mobile Banking": { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
            "Loan": { color: "#6366F1", bg: "rgba(99, 102, 241, 0.1)" },
            "Fixed Deposit": { color: "#14B8A6", bg: "rgba(20, 184, 166, 0.1)" },
            "UPI": { color: "#A855F7", bg: "rgba(168, 85, 247, 0.1)" }
        };

        const colors = categoryColors[category] || { color: "#64748B", bg: "rgba(100, 116, 139, 0.1)" };

        return (
            <span style={{
                padding: "4px 10px",
                background: colors.bg,
                color: colors.color,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600"
            }}>
                {category}
            </span>
        );
    };

    // Handle view overview
    const handleViewOverview = (query) => {
        setSelectedQuery(query);
        setShowOverview(true);
    };

    // Close overview modal
    const closeOverview = () => {
        setShowOverview(false);
        setSelectedQuery(null);
    };

    // Overview Modal Component
    const RequestOverview = ({ request, onClose }) => {
        if (!request) return null;

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
                                <p style={styles.modalSubtitle}>Query ID: {request.id}</p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    <div style={styles.modalBody}>
                        {/* Status Bar */}
                        <div style={styles.statusBar}>
                            <StatusBadge status={request.status} />
                            <PriorityBadge priority={request.priority} />
                            <CategoryBadge category={request.category} />
                            {request.attachment === "Yes" && (
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
                                    <FaPaperclip size={12} />
                                    Attachment
                                </span>
                            )}
                        </div>

                        {/* Customer Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaUserTie style={styles.sectionIcon} />
                                Customer Information
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Customer Name</span>
                                    <span style={styles.infoValue}>{request.customerName}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Customer ID</span>
                                    <span style={styles.infoValue}>{request.customerId}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Email Address</span>
                                    <span style={styles.infoValue}>{request.email}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Contact Number</span>
                                    <span style={styles.infoValue}>{request.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Query Details */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaQuestionCircle style={styles.sectionIcon} />
                                Query Details
                            </h4>
                            <div style={styles.queryBox}>
                                <div style={styles.queryHeader}>
                                    <span style={styles.querySubject}>{request.subject}</span>
                                    <span style={styles.queryCategory}>
                                        {request.category} • {request.subCategory}
                                    </span>
                                </div>
                                <p style={styles.queryDescription}>{request.description}</p>
                            </div>
                        </div>

                        {/* Assignment Details */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaUserTie style={styles.sectionIcon} />
                                Assignment Details
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Assigned To</span>
                                    <span style={styles.infoValue}>
                                        {request.assignedTo === "Unassigned" ? (
                                            <span style={{ color: "#F59E0B" }}>Unassigned</span>
                                        ) : (
                                            request.assignedTo
                                        )}
                                    </span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Created Date</span>
                                    <span style={styles.infoValue}>
                                        {request.createdDate} at {request.createdTime}
                                    </span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Last Updated</span>
                                    <span style={styles.infoValue}>
                                        {request.lastUpdated} at {request.lastUpdatedTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={styles.modalActions}>
                            <button style={styles.replyBtn}>
                                <FaReply size={14} />
                                Reply to Customer
                            </button>
                            <button style={styles.assignBtn}>
                                <FaUserTie size={14} />
                                Assign to Agent
                            </button>
                            <button style={styles.resolveBtn}>
                                <FaCheckCircle size={14} />
                                Mark as Resolved
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
                        <FaQuestionCircle size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Customer Queries</h1>
                        <p style={styles.subtitle}>Manage and respond to customer inquiries</p>
                    </div>
                </div>
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>4</span>
                        <span style={styles.statLabel}>Open</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>3</span>
                        <span style={styles.statLabel}>In Progress</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>3</span>
                        <span style={styles.statLabel}>Pending</span>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by ID, customer name or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <div style={styles.filterGroup}>
                    <FaFilter style={styles.filterIcon} />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All Categories</option>
                        <option value="Account">Account</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Mobile Banking">Mobile Banking</option>
                        <option value="Loan">Loan</option>
                        <option value="Fixed Deposit">Fixed Deposit</option>
                        <option value="UPI">UPI</option>
                    </select>
                </div>
                <div style={styles.filterGroup}>
                    <FaFilter style={styles.filterIcon} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHead}>
                        <tr>
                            <th style={styles.tableHeader}>Query ID</th>
                            <th style={styles.tableHeader}>Customer</th>
                            <th style={styles.tableHeader}>Category</th>
                            <th style={styles.tableHeader}>Subject</th>
                            <th style={styles.tableHeader}>Created Date</th>
                            <th style={styles.tableHeader}>Priority</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeader}>Assigned To</th>
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
                                    <div style={styles.customerInfo}>
                                        <span style={styles.accountHolder}>{item.customerName}</span>
                                        <span style={styles.customerId}>{item.customerId}</span>
                                    </div>
                                </td>
                                <td style={styles.tableCell}>
                                    <CategoryBadge category={item.category} />
                                </td>
                                <td style={styles.tableCell}>
                                    <span style={styles.subjectText}>{item.subject}</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={styles.dateCell}>
                                        <FaCalendarAlt style={styles.dateIcon} />
                                        {item.createdDate}
                                        <span style={styles.timeText}>{item.createdTime}</span>
                                    </div>
                                </td>
                                <td style={styles.tableCell}>
                                    <PriorityBadge priority={item.priority} />
                                </td>
                                <td style={styles.tableCell}>
                                    <StatusBadge status={item.status} />
                                </td>
                                <td style={styles.tableCell}>
                                    <span style={item.assignedTo === "Unassigned" ? styles.unassignedText : styles.assignedText}>
                                        {item.assignedTo === "Unassigned" ? "—" : item.assignedTo.split(' ')[0]}
                                    </span>
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
                        ))}
                    </tbody>
                </table>

                {paginatedData.length === 0 && (
                    <div style={styles.noData}>
                        <FaQuestionCircle size={48} style={styles.noDataIcon} />
                        <p style={styles.noDataText}>No customer queries found</p>
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
                        <FaChevronLeft size={12} />
                    </button>
                    <span style={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        style={styles.pageBtn}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            )}

            {/* Overview Modal */}
            {showOverview && selectedQuery && (
                <RequestOverview request={selectedQuery} onClose={closeOverview} />
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
    timeText: {
        fontSize: "11px",
        color: "#6B8BA4",
        marginLeft: "4px",
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
    // Additional styles for Customer Queries
    customerInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    customerId: {
        fontSize: "11px",
        color: "#6B8BA4",
        fontFamily: "monospace",
    },
    subjectText: {
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "#1E293B",
        fontSize: "13px",
    },
    unassignedText: {
        color: "#F59E0B",
        fontSize: "13px",
        fontWeight: "500",
    },
    assignedText: {
        color: "#0052A5",
        fontSize: "13px",
        fontWeight: "500",
    },
    queryBox: {
        background: "#F8FBFF",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid #E6EDF5",
    },
    queryHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
        flexWrap: "wrap",
        gap: "10px",
    },
    querySubject: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#003366",
    },
    queryCategory: {
        fontSize: "12px",
        color: "#6B8BA4",
        fontWeight: "500",
    },
    queryDescription: {
        fontSize: "14px",
        lineHeight: "1.6",
        color: "#1E293B",
        margin: 0,
    },
    replyBtn: {
        flex: 2,
        padding: "14px 20px",
        background: "linear-gradient(135deg, #003366, #002244)",
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
        boxShadow: "0 8px 16px rgba(0, 51, 102, 0.15)",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 20px rgba(0, 51, 102, 0.25)",
        },
    },
    assignBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "#FFFFFF",
        border: "2px solid #8B5CF6",
        borderRadius: "14px",
        color: "#8B5CF6",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            background: "#F5F3FF",
            borderColor: "#7C3AED",
        },
    },
    resolveBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "#FFFFFF",
        border: "2px solid #10B981",
        borderRadius: "14px",
        color: "#10B981",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            background: "#F0FDF9",
            borderColor: "#059669",
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

export default CustomerQueries;