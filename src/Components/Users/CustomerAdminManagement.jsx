import React, { useEffect, useState, useCallback, useMemo } from "react";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";
import {
    FaUsers,
    FaUserTie,
    FaUser,
    FaSearch,
    FaFilter,
    FaEye,
    FaChevronLeft,
    FaChevronRight,
    FaEnvelope,
    FaPhone,
} from "react-icons/fa";

const CustomerAdminManagement = () => {
    const [activeTab, setActiveTab] = useState("customer");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const itemsPerPage = 8;

    // Fetch users based on active tab
    const fetchUsers = async () => {
        console.log(`Fetching ${activeTab} list...`);
        setLoading(true);

        try {
            const payload = {
                page: 0,
                size: 100,
                status: statusFilter || "",
                roleId: activeTab === "customer" ? 2 : 1
            };
            const response = await API.post("/users/getAllUser/search", payload);

            if (response && response.data && response.data.content) {
                setUsers(response.data.content);
                console.log(`${activeTab} data:`, response.data.content);
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab}:`, error);
            showSnackbar("error", `Failed to fetch ${activeTab}s`);
        } finally {
            setLoading(false);
        }
    };

    const getUserData = async (id) => {
        try {
            const res = await API.get(`/account/userDataBy/${id}`)
            if (res && res.data) {
                setSelectedUser(formatUserForModal(res.data));
                setShowOverview(true);
            }
        } catch (error) {
            console.error("User Not Found", error)
            showSnackbar("error", "Failed to fetch user details");
        }
    }

    // Fetch users on mount and when dependencies change
    useEffect(() => {
        fetchUsers();
    }, [activeTab, statusFilter]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!Array.isArray(users)) return [];

        return users.filter(user => {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
            const email = (user.email || '').toLowerCase();
            const phone = user.mobileNumber || '';
            const searchLower = debouncedSearchTerm.toLowerCase();

            const matchesSearch = debouncedSearchTerm === "" ||
                fullName.includes(searchLower) ||
                email.includes(searchLower) ||
                phone.includes(debouncedSearchTerm);

            const userStatus = (user.accountStatus || user.status || 'inactive').toLowerCase();
            const matchesStatus = statusFilter === "" ||
                userStatus === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [users, debouncedSearchTerm, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Format user for modal
    const formatUserForModal = (user) => {
        const baseData = {
            id: activeTab === "customer" ? `CUST-${user.userId}` : `ADMIN-${user.userId}`,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
            email: user.email || 'N/A',
            phone: user.mobileNumber || 'N/A',
            status: (user.accountStatus || 'inactive').toLowerCase(),
            city: user.city || 'N/A',
            state: user.state || 'N/A',
            address: user.address || 'N/A',
            branch: user.branchName || 'N/A',
            branchCode: user.branchCode || 'N/A',
            role: user.roleName || (user.roleId === 1 ? 'Administrator' : 'Customer')
        };

        if (activeTab === "customer") {
            return {
                ...baseData,
                accountNumber: user.accountNumber || 'N/A',
                accountType: user.accountTypeName || 'N/A',
                balance: user.balance || 0,
                branchName: user.branchName || 'N/A',
                branchCode: user.branchCode || 'N/A',
                address: user.address || 'N/A',
                country: user.country || 'N/A',
                alternativeNumber: user.alternativeNumber || 'N/A'
            };
        } else {
            return {
                ...baseData,
                employeeId: `EMP-${user.userId}`,
                department: 'Banking Operations',
                accountNumber: user.accountNumber || 'N/A',
                accountType: user.accountTypeName || 'N/A',
                balance: user.balance || 0,
            };
        }
    };

    // Status Badge Component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            active: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", text: "Active" },
            inactive: { color: "#6B8BA4", bg: "rgba(107, 139, 164, 0.1)", text: "Inactive" }
        };

        const config = statusConfig[status] || statusConfig.inactive;

        return (
            <span style={{
                display: "inline-block",
                padding: "4px 12px",
                background: config.bg,
                color: config.color,
                borderRadius: "30px",
                fontSize: "12px",
                fontWeight: "600"
            }}>
                {config.text}
            </span>
        );
    };

    // View Details Modal
    const UserOverviewModal = ({ user, onClose }) => {
        if (!user) return null;

        return (
            <div style={styles.modalOverlay} onClick={onClose}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.modalHeader}>
                        <div style={styles.modalTitleGroup}>
                            <div style={styles.modalIcon}>
                                {activeTab === "customer" ? (
                                    <FaUser size={20} color="#FFD700" />
                                ) : (
                                    <FaUserTie size={20} color="#FFD700" />
                                )}
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>
                                    {activeTab === "customer" ? "Customer Details" : "Admin Details"}
                                </h3>
                                <p style={styles.modalSubtitle}>ID: {user.id}</p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    <div style={styles.modalBody}>
                        <div style={styles.statusBar}>
                            <StatusBadge status={user.status} />
                        </div>

                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>Personal Information</h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Full Name</span>
                                    <span style={styles.infoValue}>{user.name}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Email</span>
                                    <span style={styles.infoValue}>
                                        <FaEnvelope style={{ marginRight: "6px", color: "#FFD700" }} />
                                        {user.email}
                                    </span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Phone</span>
                                    <span style={styles.infoValue}>
                                        <FaPhone style={{ marginRight: "6px", color: "#FFD700" }} />
                                        {user.phone}
                                    </span>
                                </div>
                                {user.alternativeNumber && (
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Alternative Phone</span>
                                        <span style={styles.infoValue}>
                                            <FaPhone style={{ marginRight: "6px", color: "#FFD700" }} />
                                            {user.alternativeNumber}
                                        </span>
                                    </div>
                                )}
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Address</span>
                                    <span style={styles.infoValue}>{user.address}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Location</span>
                                    <span style={styles.infoValue}>{user.city}, {user.state}</span>
                                </div>
                                {user.country && (
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Country</span>
                                        <span style={styles.infoValue}>{user.country}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {activeTab === "customer" && (
                            <div style={styles.infoSection}>
                                <h4 style={styles.sectionTitle}>Account Information</h4>
                                <div style={styles.infoGrid}>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Account Number</span>
                                        <span style={styles.infoValue}>{user.accountNumber}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Account Type</span>
                                        <span style={styles.infoValue}>{user.accountType}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Balance</span>
                                        <span style={styles.infoValue}>₹{user.balance?.toLocaleString() || '0'}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Branch Name</span>
                                        <span style={styles.infoValue}>{user.branchName}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Branch Code</span>
                                        <span style={styles.infoValue}>{user.branchCode}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "admin" && (
                            <div style={styles.infoSection}>
                                <h4 style={styles.sectionTitle}>Employment Information</h4>
                                <div style={styles.infoGrid}>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Employee ID</span>
                                        <span style={styles.infoValue}>{user.employeeId}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Department</span>
                                        <span style={styles.infoValue}>{user.department}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Branch Name</span>
                                        <span style={styles.infoValue}>{user.branch}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Branch Code</span>
                                        <span style={styles.infoValue}>{user.branchCode}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Account Number</span>
                                        <span style={styles.infoValue}>{user.accountNumber}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Account Type</span>
                                        <span style={styles.infoValue}>{user.accountType}</span>
                                    </div>
                                     <div style={styles.infoRow}>
                                        <span style={styles.infoLabel}>Balance</span>
                                        <span style={styles.infoValue}>₹{user.balance?.toLocaleString() || '0'}</span>
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
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>
                        <FaUsers size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Customer & Admin Management</h1>
                        <p style={styles.subtitle}>Manage customers and administrators</p>
                    </div>
                </div>

                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>{users.length}</span>
                        <span style={styles.statLabel}>
                            Total {activeTab === "customer" ? "Customers" : "Admins"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabsContainer}>
                <div style={styles.tabsWrapper}>
                    <div
                        style={{
                            ...styles.tab,
                            background: activeTab === "customer"
                                ? "linear-gradient(135deg, #003366, #002244)"
                                : "transparent",
                            border: activeTab === "customer"
                                ? "2px solid #FFD700"
                                : "2px solid #E6EDF5",
                            color: activeTab === "customer" ? "#FFFFFF" : "#003366"
                        }}
                        onClick={() => {
                            setActiveTab("customer");
                            setCurrentPage(1);
                            setSearchTerm("");
                            setStatusFilter("");
                        }}
                    >
                        <FaUser size={16} style={{ marginRight: "8px" }} />
                        Customers
                    </div>

                    <div
                        style={{
                            ...styles.tab,
                            background: activeTab === "admin"
                                ? "linear-gradient(135deg, #003366, #002244)"
                                : "transparent",
                            border: activeTab === "admin"
                                ? "2px solid #FFD700"
                                : "2px solid #E6EDF5",
                            color: activeTab === "admin" ? "#FFFFFF" : "#003366"
                        }}
                        onClick={() => {
                            setActiveTab("admin");
                            setCurrentPage(1);
                            setSearchTerm("");
                            setStatusFilter("");
                        }}
                    >
                        <FaUserTie size={16} style={{ marginRight: "8px" }} />
                        Administrators
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={`Search by name, email or phone...`}
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
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={styles.tableContainer}>
                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.loadingSpinner}></div>
                        <p style={styles.loadingText}>Loading users...</p>
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead style={styles.tableHead}>
                            <tr>
                                {activeTab === "customer" ? (
                                    <>
                                        <th style={styles.tableHeader}>S.No</th>
                                        <th style={styles.tableHeader}>Name</th>
                                        <th style={styles.tableHeader}>Contact</th>
                                        <th style={styles.tableHeader}>Account Type</th>
                                        <th style={styles.tableHeader}>Account Number</th>
                                        <th style={styles.tableHeader}>Location</th>
                                        <th style={styles.tableHeader}>Status</th>
                                        <th style={styles.tableHeader}>Actions</th>
                                    </>
                                ) : (
                                    <>
                                        <th style={styles.tableHeader}>S.No</th>
                                        <th style={styles.tableHeader}>Name</th>
                                        <th style={styles.tableHeader}>Contact</th>
                                        <th style={styles.tableHeader}>Role</th>
                                        <th style={styles.tableHeader}>Employee ID</th>
                                        <th style={styles.tableHeader}>Location</th>
                                        <th style={styles.tableHeader}>Status</th>
                                        <th style={styles.tableHeader}>Actions</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr key={`${activeTab}-${item.userId || index}`} style={styles.tableRow}>
                                    {activeTab === "customer" ? (
                                        <>
                                            <td style={styles.tableCell}>
                                                <span style={styles.id}>{index + 1}</span>
                                            </td>
                                            <td style={styles.tableCell}>
                                                <span style={styles.name}>
                                                    {`${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={styles.tableCell}>
                                                <div style={styles.contactInfo}>
                                                    <span style={styles.email}>
                                                        <FaEnvelope style={styles.contactIcon} />
                                                        {item.email || 'N/A'}
                                                    </span>
                                                    <span style={styles.phone}>
                                                        <FaPhone style={styles.contactIcon} />
                                                        {item.mobileNumber || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={styles.tableCell}>{item.accountType || 'N/A'}</td>
                                            <td style={styles.tableCell}>
                                                {item.accountNumber ?
                                                    `XXXX XXXX ${item.accountNumber.toString().slice(-4)}` :
                                                    'N/A'}
                                            </td>
                                            <td style={styles.tableCell}>
                                                {`${item.city || ''}, ${item.state || ''}`.trim() || 'N/A'}
                                            </td>
                                            <td style={styles.tableCell}>
                                                <StatusBadge status={(item.accountStatus || 'inactive').toLowerCase()} />
                                            </td>
                                            <td style={styles.tableCell}>
                                                <button
                                                    style={styles.iconBtn}
                                                    // onClick={() => {
                                                    //     setSelectedUser(formatUserForModal(item));
                                                    //     setShowOverview(true);
                                                    // }}
                                                    onClick={() => getUserData(item?.accountNumber)}
                                                    title="View Details"
                                                >
                                                    <FaEye color="#003366" size={14} />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={styles.tableCell}>
                                                <span style={styles.id}>{index + 1}</span>
                                            </td>
                                            <td style={styles.tableCell}>
                                                <span style={styles.name}>
                                                    {`${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={styles.tableCell}>
                                                <div style={styles.contactInfo}>
                                                    <span style={styles.email}>
                                                        <FaEnvelope style={styles.contactIcon} />
                                                        {item.email || 'N/A'}
                                                    </span>
                                                    <span style={styles.phone}>
                                                        <FaPhone style={styles.contactIcon} />
                                                        {item.mobileNumber || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={styles.tableCell}>Administrator</td>
                                            <td style={styles.tableCell}>EMP-{item.userId}</td>
                                            <td style={styles.tableCell}>
                                                {`${item.city || ''}, ${item.state || ''}`.trim() || 'N/A'}
                                            </td>
                                            <td style={styles.tableCell}>
                                                <StatusBadge status={(item.accountStatus || 'inactive').toLowerCase()} />
                                            </td>
                                            <td style={styles.tableCell}>
                                                <button
                                                    style={styles.iconBtn}
                                                    // onClick={() => {
                                                    //     setSelectedUser(formatUserForModal(item));
                                                    //     setShowOverview(true);
                                                    // }}
                                                    onClick={() => getUserData(item?.accountNumber)}
                                                    title="View Details"
                                                >
                                                    <FaEye color="#003366" size={14} />
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && paginatedData.length === 0 && (
                    <div style={styles.noData}>
                        <FaUsers size={48} style={styles.noDataIcon} />
                        <p style={styles.noDataText}>No {activeTab === "customer" ? "customers" : "admins"} found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
                <div style={styles.pagination}>
                    <button
                        style={{
                            ...styles.pageBtn,
                            opacity: currentPage === 1 ? 0.5 : 1,
                            cursor: currentPage === 1 ? "not-allowed" : "pointer"
                        }}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft color="#003366" size={12} />
                    </button>
                    <span style={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        style={{
                            ...styles.pageBtn,
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                        }}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight color="#003366" size={12} />
                    </button>
                </div>
            )}

            {/* Modal */}
            {showOverview && selectedUser && (
                <UserOverviewModal
                    user={selectedUser}
                    onClose={() => {
                        setShowOverview(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
};

// Styles
const styles = {
    container: {
        padding: "30px",
        background: "#F5F9FF",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
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
    tabsContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },
    tabsWrapper: {
        display: "flex",
        gap: "12px",
    },
    tab: {
        display: "flex",
        alignItems: "center",
        padding: "12px 24px",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "15px",
        transition: "all 0.2s ease",
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
    },
    tableCell: {
        padding: "16px",
        fontSize: "14px",
        color: "#1E293B",
    },
    id: {
        fontWeight: "600",
        color: "#003366",
        fontFamily: "monospace",
    },
    name: {
        fontWeight: "600",
        color: "#1E293B",
    },
    contactInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    email: {
        fontSize: "12px",
        color: "#4A6F8F",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    phone: {
        fontSize: "12px",
        color: "#4A6F8F",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    contactIcon: {
        color: "#FFD700",
        fontSize: "10px",
    },
    iconBtn: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        border: "1px solid #E6EDF5",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        padding: 0,
        ":hover": {
            background: "#F0F7FF",
            borderColor: "#FFD700",
        },
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
        },
    },
    pageInfo: {
        fontSize: "14px",
        color: "#4A6F8F",
        fontWeight: "500",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        textAlign: "center",
    },
    loadingSpinner: {
        width: "40px",
        height: "40px",
        border: "3px solid #E6EDF5",
        borderTop: "3px solid #FFD700",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "16px",
    },
    loadingText: {
        fontSize: "14px",
        color: "#4A6F8F",
        margin: 0,
    },
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
        padding: "20px",
    },
    modalContent: {
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflow: "auto",
        background: "#FFFFFF",
        borderRadius: "32px",
        boxShadow: "0 25px 50px rgba(0, 51, 102, 0.25)",
        border: "1px solid rgba(255, 215, 0, 0.2)",
        animation: "slideIn 0.3s ease",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 32px",
        borderBottom: "1px solid #E6EDF5",
        background: "linear-gradient(135deg, #F8FBFF, #FFFFFF)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
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
            background: "#F0F7FF",
            borderColor: "#FFD700",
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
        fontSize: "16px",
        fontWeight: "600",
        color: "#003366",
        marginBottom: "16px",
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
        display: "flex",
        alignItems: "center",
    },
};

// Add global animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default CustomerAdminManagement;