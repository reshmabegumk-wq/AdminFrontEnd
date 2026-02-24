import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";
import {
    FaArrowLeft,
    FaMoneyCheck,
    FaQuestionCircle,
    FaArrowUp,
    FaExclamationTriangle,
    FaHourglassHalf,
    FaSearch,
    FaFilter,
    FaDownload,
    FaSync,
    FaCalendarAlt,
    FaUser,
    FaEye,
    FaChevronLeft,
    FaChevronRight,
    FaCheckCircle,
    FaBan,
    FaExclamationCircle,
    FaBook,
    FaShieldAlt
} from "react-icons/fa";

const PendingActions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [displayedRequests, setDisplayedRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState("all");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    const [stats, setStats] = useState({
        total: 0,
        chequeBooks: 0,
        customerQueries: 0,
        limitRequests: 0,
        stolenCards: 0
    });

    // Get filter state from navigation - this comes from dashboard
    const { month, year } = location.state || {
        month: "feb",
        year: "2026"
    };

    // Format month name for display
    const getFormattedMonthYear = () => {
        const monthNames = {
            'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
            'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
            'sep': 'September', 'oct': 'October', 'nov': 'November', 'dec': 'December'
        };
        return `${monthNames[month]} ${year}`;
    };

    // Get month number from month abbreviation
    const getMonthNumber = (monthAbbr) => {
        const months = {
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        return months[monthAbbr];
    };

    // Helper function to safely convert any value to lowercase string
    const safeToLowerCase = (value) => {
        if (value === null || value === undefined) return '';
        return String(value).toLowerCase();
    };

    // Fetch all pending requests for the selected month
    const fetchPendingRequests = async () => {
        setIsLoading(true);
        try {
            showSnackbar("info", `Loading pending actions for ${getFormattedMonthYear()}...`);
            
            // Fetch from all modules with pending status
            const [chequeRes, queryRes, limitRes, stolenRes] = await Promise.allSettled([
                API.post("chequeRequest/adminChequeList", { status: "pending", page: 0, size: 100 }),
                API.post("queriesResponse/adminQueriesList", { status: "pending", page: 0, size: 100 }),
                API.post("creditLimit/adminCreditLimitList", { status: "pending", page: 0, size: 100 }),
                API.post("lostCard/adminLastCardList", { status: "pending", page: 0, size: 100 })
            ]);

            // Process and combine all pending requests
            let allPending = [];

            // Cheque requests
            if (chequeRes.status === 'fulfilled' && chequeRes.value?.data?.data?.content) {
                const chequeRequests = chequeRes.value.data.data.content.map(item => ({
                    id: `cheque-${item.chequeRequestId}`,
                    requestId: item.chequeRequestId,
                    module: "Cheque Leaves",
                    moduleIcon: FaBook,
                    moduleColor: "#003366",
                    customerName: item.fullName || "Unknown",
                    accountNumber: item.accountNumber || "N/A",
                    status: item.status || "Pending",
                    requestedDate: item.requestedDate || item.createdDate,
                    description: `${item.noOfLeaves || 0} leaves cheque book`,
                    value: `${item.noOfLeaves || 0} leaves`,
                    originalData: item
                }));
                allPending = [...allPending, ...chequeRequests];
            }

            // Query requests
            if (queryRes.status === 'fulfilled' && queryRes.value?.data?.data?.content) {
                const queryRequests = queryRes.value.data.data.content.map(item => ({
                    id: `query-${item.queriesId}`,
                    requestId: item.queriesId,
                    module: "Customer Queries",
                    moduleIcon: FaQuestionCircle,
                    moduleColor: "#FFD700",
                    customerName: item.fullName || "Unknown",
                    accountNumber: item.accountNumber || "N/A",
                    status: item.status || "Pending",
                    requestedDate: item.queryRaisedDate,
                    description: item.customerQuery?.substring(0, 50) + "...",
                    value: "Query",
                    originalData: item
                }));
                allPending = [...allPending, ...queryRequests];
            }

            // Limit requests
            if (limitRes.status === 'fulfilled' && limitRes.value?.data?.data?.content) {
                const limitRequests = limitRes.value.data.data.content.map(item => ({
                    id: `limit-${item.increaseCreditLimitId}`,
                    requestId: item.increaseCreditLimitId,
                    module: "Limit Requests",
                    moduleIcon: FaArrowUp,
                    moduleColor: "#10B981",
                    customerName: item.fullName || "Unknown",
                    accountNumber: item.accountNumber || "N/A",
                    status: item.status || "Pending",
                    requestedDate: item.requestDate,
                    description: `Requested ₹${item.requestedLimit?.toLocaleString() || 0}`,
                    value: `₹${item.requestedLimit?.toLocaleString() || 0}`,
                    originalData: item
                }));
                allPending = [...allPending, ...limitRequests];
            }

            // Stolen card requests
            if (stolenRes.status === 'fulfilled' && stolenRes.value?.data?.data?.content) {
                const stolenRequests = stolenRes.value.data.data.content.map(item => ({
                    id: `stolen-${item.lostCardId}`,
                    requestId: item.lostCardId,
                    module: "Stolen Cards",
                    moduleIcon: FaShieldAlt,
                    moduleColor: "#EF4444",
                    customerName: item.fullName || item.cardHolder || "Unknown",
                    accountNumber: item.accountNumber || "N/A",
                    status: item.status || "Pending",
                    requestedDate: item.createdDate,
                    description: `Card: ${maskCardNumber(item.lostCardNumber)}`,
                    value: "Card Blocked",
                    originalData: item
                }));
                allPending = [...allPending, ...stolenRequests];
            }

            // Filter by selected month and year
            const monthNum = getMonthNumber(month);
            const yearNum = parseInt(year);

            const filteredByDate = allPending.filter(request => {
                if (!request.requestedDate) return false;
                const date = new Date(request.requestedDate);
                return date.getMonth() === monthNum && date.getFullYear() === yearNum;
            });

            // Sort by date (oldest first)
            filteredByDate.sort((a, b) => 
                new Date(a.requestedDate) - new Date(b.requestedDate)
            );

            // Calculate stats
            const chequeBooks = filteredByDate.filter(r => r.module === "Cheque Leaves").length;
            const customerQueries = filteredByDate.filter(r => r.module === "Customer Queries").length;
            const limitRequests = filteredByDate.filter(r => r.module === "Limit Requests").length;
            const stolenCards = filteredByDate.filter(r => r.module === "Stolen Cards").length;

            setStats({
                total: filteredByDate.length,
                chequeBooks,
                customerQueries,
                limitRequests,
                stolenCards
            });

            setPendingRequests(filteredByDate);
            setFilteredRequests(filteredByDate);
            setTotalElements(filteredByDate.length);
            setTotalPages(Math.ceil(filteredByDate.length / pageSize));
            setCurrentPage(0);

            if (filteredByDate.length === 0) {
                showSnackbar("info", `No pending actions found for ${getFormattedMonthYear()}`);
            }

        } catch (error) {
            console.error("Error fetching pending requests:", error);
            showSnackbar("error", "Failed to load pending requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, [month, year]);

    // Filter requests based on search and module
    useEffect(() => {
        if (!pendingRequests.length) return;

        let filtered = [...pendingRequests];

        // Apply search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(request => 
                safeToLowerCase(request.customerName).includes(term) ||
                safeToLowerCase(request.accountNumber).includes(term) ||
                safeToLowerCase(request.description).includes(term) ||
                safeToLowerCase(request.module).includes(term)
            );
        }

        // Apply module filter
        if (selectedModule !== "all") {
            filtered = filtered.filter(request => 
                safeToLowerCase(request.module) === safeToLowerCase(selectedModule)
            );
        }

        setFilteredRequests(filtered);
        setTotalElements(filtered.length);
        setTotalPages(Math.ceil(filtered.length / pageSize));
        setCurrentPage(0); // Reset to first page when filters change
    }, [searchTerm, selectedModule, pendingRequests]);

    // Update displayed requests based on current page
    useEffect(() => {
        const start = currentPage * pageSize;
        const end = start + pageSize;
        setDisplayedRequests(filteredRequests.slice(start, end));
    }, [filteredRequests, currentPage, pageSize]);

    const maskCardNumber = (cardNumber) => {
        if (!cardNumber) return "XXXX";
        const str = cardNumber.toString();
        return "XXXX XXXX XXXX " + str.slice(-4);
    };

    // Updated date formatter to return only dd-mm-yyyy without time
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) return "N/A";
            
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        } catch (e) {
            return dateString;
        }
    };

    // ===== UPDATED NAVIGATION FUNCTION =====
    const handleViewDetails = (request) => {
        console.log("Navigating to:", request.module, "with ID:", request.requestId);
        
        // Navigate to the appropriate page based on module with the ID in state
        switch (request.module) {
            case 'Cheque Leaves':
                navigate('/cheque-book', { 
                    state: { selectedRequestId: request.requestId } 
                });
                break;
                
            case 'Customer Queries':
                navigate('/customer-queries', { 
                    state: { selectedQueryId: request.requestId } 
                });
                break;
                
            case 'Limit Requests':
                navigate('/increase-limit', { 
                    state: { selectedRequestId: request.requestId } 
                });
                break;
                
            case 'Stolen Cards':
                navigate('/stolen-card', { 
                    state: { selectedCardId: request.requestId } 
                });
                break;
                
            default:
                showSnackbar("info", "Detail view not available for this module");
        }
    };

    const handleExport = () => {
        try {
            const csvData = filteredRequests.map(request => ({
                'Module': request.module,
                'Customer Name': request.customerName,
                'Account Number': request.accountNumber,
                'Requested Date': formatDate(request.requestedDate),
                'Description': request.description,
                'Value': request.value
            }));

            const csv = convertToCSV(csvData);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pending-actions-${month}-${year}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            showSnackbar("success", "Export started successfully");
        } catch (error) {
            showSnackbar("error", "Failed to export data");
        }
    };

    const convertToCSV = (data) => {
        const headers = Object.keys(data[0] || {});
        const rows = data.map(obj => headers.map(header => JSON.stringify(obj[header] || '')).join(','));
        return [headers.join(','), ...rows].join('\n');
    };

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p style={styles.loadingText}>Loading pending actions for {getFormattedMonthYear()}...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
                        <FaArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                    <div style={styles.headerIcon}>
                        <FaHourglassHalf size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Pending Actions - {getFormattedMonthYear()}</h1>
                        <p style={styles.subtitle}>
                            {filteredRequests.length} of {pendingRequests.length} pending request{filteredRequests.length !== 1 ? 's' : ''} shown
                        </p>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <button style={styles.exportBtn} onClick={handleExport} disabled={filteredRequests.length === 0}>
                        <FaDownload size={14} />
                        Export
                    </button>
                    <button style={styles.refreshBtn} onClick={fetchPendingRequests}>
                        <FaSync size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards - Removed urgent stat */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.primary)}>
                        <FaHourglassHalf size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.total}</span>
                        <span style={styles.statLabel}>Total Pending</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.cheque)}>
                        <FaBook size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.chequeBooks}</span>
                        <span style={styles.statLabel}>Cheque Leaves</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.query)}>
                        <FaQuestionCircle size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.customerQueries}</span>
                        <span style={styles.statLabel}>Queries</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.limit)}>
                        <FaArrowUp size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.limitRequests}</span>
                        <span style={styles.statLabel}>Limit Requests</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.stolen)}>
                        <FaShieldAlt size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.stolenCards}</span>
                        <span style={styles.statLabel}>Stolen Cards</span>
                    </div>
                </div>
            </div>

            {/* Filters - Only Module filter remains */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <FaSearch size={14} color="#8DA6C0" style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by customer, account, or description..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button 
                            style={styles.clearSearch}
                            onClick={() => setSearchTerm("")}
                        >
                            ×
                        </button>
                    )}
                </div>
                <div style={styles.filterGroup}>
                    <FaFilter size={14} color="#4A6F8F" />
                    <select
                        style={styles.filterSelect}
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                    >
                        <option value="all">All Modules</option>
                        <option value="cheque leaves">Cheque Leaves</option>
                        <option value="customer queries">Customer Queries</option>
                        <option value="limit requests">Limit Requests</option>
                        <option value="stolen cards">Stolen Cards</option>
                    </select>
                </div>
            </div>

            {/* Pending Requests Table - Removed priority column */}
            <div style={styles.tableContainer}>
                {displayedRequests.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Module</th>
                                <th style={styles.th}>Customer</th>
                                <th style={styles.th}>Account</th>
                                <th style={styles.th}>Description</th>
                                <th style={styles.th}>Requested Date</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRequests.map((request) => {
                                const Icon = request.moduleIcon;
                                return (
                                    <tr key={request.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <div style={styles.moduleCell}>
                                                <div style={styles.moduleIconSmall(request.moduleColor)}>
                                                    <Icon size={12} color="#FFFFFF" />
                                                </div>
                                                <span>{request.module}</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.customerCell}>
                                                <FaUser size={12} color="#4A6F8F" />
                                                <span>{request.customerName}</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>{request.accountNumber}</td>
                                        <td style={styles.td}>{request.description}</td>
                                        <td style={styles.td}>
                                            <div style={styles.dateCell}>
                                                <FaCalendarAlt size={10} color="#8DA6C0" />
                                                {formatDate(request.requestedDate)}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.viewBtn}
                                                onClick={() => handleViewDetails(request)}
                                                title={`View ${request.module} Details`}
                                            >
                                                <FaEye size={14} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div style={styles.noDataContainer}>
                        <FaHourglassHalf size={48} color="#E6EDF5" />
                        <p style={styles.noDataText}>
                            {searchTerm || selectedModule !== "all"
                                ? "No matching pending actions found" 
                                : `No pending actions for ${getFormattedMonthYear()}`}
                        </p>
                        <p style={styles.noDataSubtext}>
                            {searchTerm || selectedModule !== "all"
                                ? "Try adjusting your filters"
                                : "All caught up! Check back later."}
                        </p>
                    </div>
                )}
            </div>

            {/* Simple Pagination Text - Exactly as requested: "Page 1 of 1 (2 total)" */}
            {filteredRequests.length > 0 && (
                <div style={styles.paginationContainer}>
                    <div style={styles.pagination}>
                        Page {currentPage + 1} of {totalPages} ({filteredRequests.length} total)
                    </div>
                </div>
            )}
        </div>
    );
};

// Colors
const COLORS = {
    primary: '#003366',
    cheque: '#003366',
    query: '#FFD700',
    limit: '#10B981',
    stolen: '#EF4444'
};

// Styles
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
        flexWrap: "wrap",
        gap: "20px",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        color: "#003366",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            borderColor: "#FFD700",
        },
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
    exportBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        color: "#003366",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover:not(:disabled)": {
            borderColor: "#10B981",
            color: "#10B981",
        },
        ":disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
        },
    },
    refreshBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: "linear-gradient(135deg, #003366, #002244)",
        border: "none",
        borderRadius: "12px",
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
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "15px",
        marginBottom: "25px",
    },
    statCard: {
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
    },
    statIcon: (color) => ({
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }),
    statInfo: {
        display: "flex",
        flexDirection: "column",
    },
    statValue: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#003366",
    },
    statLabel: {
        fontSize: "12px",
        color: "#6B8BA4",
    },
    filtersContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "15px",
    },
    searchBox: {
        flex: 1,
        minWidth: "300px",
        position: "relative",
    },
    searchIcon: {
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
    },
    searchInput: {
        width: "100%",
        padding: "12px 40px 12px 40px",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#003366",
        outline: "none",
        transition: "all 0.2s ease",
        ":focus": {
            borderColor: "#FFD700",
        },
    },
    clearSearch: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        fontSize: "20px",
        color: "#8DA6C0",
        cursor: "pointer",
        padding: "0 4px",
        ":hover": {
            color: "#EF4444",
        },
    },
    filterGroup: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#FFFFFF",
        padding: "4px 4px 4px 16px",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
    },
    filterSelect: {
        padding: "8px 24px 8px 12px",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#003366",
        fontWeight: "500",
        cursor: "pointer",
        outline: "none",
        background: "#FFFFFF",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23003366' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 4px center",
        backgroundSize: "16px",
    },
    tableContainer: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        textAlign: "left",
        padding: "15px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#4A6F8F",
        borderBottom: "2px solid #E6EDF5",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    tr: {
        transition: "background 0.2s ease",
        ":hover": {
            background: "#F8FBFF",
        },
    },
    td: {
        padding: "15px",
        fontSize: "14px",
        color: "#1E293B",
        borderBottom: "1px solid #F0F4F9",
    },
    moduleCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    moduleIconSmall: (color) => ({
        width: "24px",
        height: "24px",
        borderRadius: "6px",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }),
    customerCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    dateCell: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        color: "#6B8BA4",
    },
    viewBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "8px 16px",
        background: "#F0F4F9",
        border: "none",
        borderRadius: "8px",
        color: "#003366",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            background: "#FFD700",
            color: "#003366",
        },
    },
    paginationContainer: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
    },
    pagination: {
        fontSize: "14px",
        color: "#4A6F8F",
        fontWeight: "500",
        padding: "10px 20px",
        background: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid #E6EDF5",
        boxShadow: "0 2px 4px rgba(0, 51, 102, 0.05)",
    },
    noDataContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
    },
    noDataText: {
        fontSize: "16px",
        color: "#4A6F8F",
        margin: "15px 0 5px",
        fontWeight: "500",
    },
    noDataSubtext: {
        fontSize: "14px",
        color: "#8DA6C0",
        margin: 0,
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
    },
    loader: {
        width: "50px",
        height: "50px",
        border: "5px solid #E6EDF5",
        borderTop: "5px solid #FFD700",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "20px",
    },
    loadingText: {
        fontSize: "16px",
        color: "#4A6F8F",
        fontWeight: "500",
    },
};

// Add global keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

export default PendingActions;