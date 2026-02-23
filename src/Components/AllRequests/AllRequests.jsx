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
    FaFileAlt,
    FaHourglassHalf,
    FaCheckCircle,
    FaBan,
    FaSearch,
    FaFilter,
    FaDownload,
    FaSync,
    FaCalendarAlt,
    FaUser,
    FaEye,
    FaChevronLeft,
    FaChevronRight,
    FaBook,
    FaShieldAlt
} from "react-icons/fa";

const AllRequests = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [displayedRequests, setDisplayedRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    // Get filter state from navigation
    const { month, year, filterType, status } = location.state || {
        month: "feb",
        year: "2026",
        filterType: "all",
        status: "all"
    };

    // Set initial status filter based on navigation
    useEffect(() => {
        if (status && status !== "all") {
            setSelectedStatus(status);
        }
    }, [status]);

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

    // Fetch all requests
    const fetchAllRequests = async () => {
        setIsLoading(true);
        try {
            // Fetch from all modules
            const [chequeRes, queryRes, limitRes, stolenRes] = await Promise.allSettled([
                API.post("chequeRequest/adminChequeList", { status: "", page: 0, size: 100 }),
                API.post("queriesResponse/adminQueriesList", { status: "", page: 0, size: 100 }),
                API.post("creditLimit/adminCreditLimitList", { status: "", page: 0, size: 100 }),
                API.post("lostCard/adminLastCardList", { status: "", page: 0, size: 100 })
            ]);

            // Process and combine all requests
            let allRequests = [];

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
                allRequests = [...allRequests, ...chequeRequests];
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
                allRequests = [...allRequests, ...queryRequests];
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
                allRequests = [...allRequests, ...limitRequests];
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
                allRequests = [...allRequests, ...stolenRequests];
            }

            // Filter by selected month and year
            const monthNum = getMonthNumber(month);
            const yearNum = parseInt(year);

            const filteredByDate = allRequests.filter(request => {
                if (!request.requestedDate) return false;
                const date = new Date(request.requestedDate);
                return date.getMonth() === monthNum && date.getFullYear() === yearNum;
            });

            // Apply status filter if coming from pending/resolved clicks
            let finalFiltered = filteredByDate;
            if (filterType === 'pending') {
                finalFiltered = filteredByDate.filter(r => 
                    r.status?.toLowerCase() === 'pending'
                );
            } else if (filterType === 'resolved') {
                finalFiltered = filteredByDate.filter(r => 
                    r.status?.toLowerCase() === 'approved' || r.status?.toLowerCase() === 'resolved'
                );
            }

            // Sort by date (newest first)
            finalFiltered.sort((a, b) => 
                new Date(b.requestedDate) - new Date(a.requestedDate)
            );

            setRequests(finalFiltered);
            setFilteredRequests(finalFiltered);
            setTotalElements(finalFiltered.length);
            setTotalPages(Math.ceil(finalFiltered.length / pageSize));

            if (finalFiltered.length === 0) {
                showSnackbar("info", `No requests found for ${getFormattedMonthYear()}`);
            }

        } catch (error) {
            console.error("Error fetching requests:", error);
            showSnackbar("error", "Failed to load requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRequests();
    }, [month, year, filterType]);

    // Filter requests based on search, module, and status
    useEffect(() => {
        let filtered = [...requests];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(request =>
                request.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply module filter
        if (selectedModule !== "all") {
            filtered = filtered.filter(request => 
                request.module.toLowerCase() === selectedModule.toLowerCase()
            );
        }

        // Apply status filter (if not already applied from navigation)
        if (selectedStatus !== "all" && filterType === 'all') {
            filtered = filtered.filter(request => 
                request.status?.toLowerCase() === selectedStatus.toLowerCase()
            );
        }

        setFilteredRequests(filtered);
        setTotalElements(filtered.length);
        setTotalPages(Math.ceil(filtered.length / pageSize));
        setCurrentPage(0);
    }, [searchTerm, selectedModule, selectedStatus, requests, filterType]);

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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return '#10B981';
            case 'pending':
                return '#F97316';
            case 'rejected':
                return '#EF4444';
            default:
                return '#6B8BA4';
        }
    };

    // ===== UPDATED NAVIGATION FUNCTION =====
    const handleViewDetails = (request) => {
        console.log("Navigating to:", request.module, "with ID:", request.requestId);
        
        // Navigate to the main list page with the ID in state
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
                'Status': request.status,
                'Requested Date': formatDate(request.requestedDate),
                'Description': request.description,
                'Value': request.value
            }));

            const csv = convertToCSV(csvData);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `requests-${month}-${year}.csv`;
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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const getPageTitle = () => {
        if (filterType === 'pending') {
            return `Pending Requests - ${getFormattedMonthYear()}`;
        } else if (filterType === 'resolved') {
            return `Resolved Requests - ${getFormattedMonthYear()}`;
        } else {
            return `All Requests - ${getFormattedMonthYear()}`;
        }
    };

    const getModuleOptions = () => {
        const modules = ['all', ...new Set(requests.map(r => r.module))];
        return modules;
    };

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p style={styles.loadingText}>Loading requests for {getFormattedMonthYear()}...</p>
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
                        <FaFileAlt size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>{getPageTitle()}</h1>
                        <p style={styles.subtitle}>
                            Total {filteredRequests.length} requests found
                        </p>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <button style={styles.exportBtn} onClick={handleExport} disabled={filteredRequests.length === 0}>
                        <FaDownload size={14} />
                        Export
                    </button>
                    <button style={styles.refreshBtn} onClick={fetchAllRequests}>
                        <FaSync size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
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
                        {getModuleOptions().filter(m => m !== 'all').map(module => (
                            <option key={module} value={module}>{module}</option>
                        ))}
                    </select>
                    <select
                        style={styles.filterSelect}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        disabled={filterType !== 'all'}
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Requests Table */}
            <div style={styles.tableContainer}>
                {displayedRequests.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Module</th>
                                <th style={styles.th}>Customer</th>
                                <th style={styles.th}>Account</th>
                                <th style={styles.th}>Description</th>
                                <th style={styles.th}>Status</th>
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
                                            <span style={{
                                                ...styles.statusBadge,
                                                background: `${getStatusColor(request.status)}15`,
                                                color: getStatusColor(request.status)
                                            }}>
                                                {request.status}
                                            </span>
                                        </td>
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
                        <FaFileAlt size={48} color="#E6EDF5" />
                        <p style={styles.noDataText}>No requests found for {getFormattedMonthYear()}</p>
                        <p style={styles.noDataSubtext}>Try adjusting your filters or select a different month</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={styles.pagination}>
                    <button
                        style={styles.pageButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        <FaChevronLeft size={12} />
                    </button>
                    <span style={styles.pageInfo}>
                        Page {currentPage + 1} of {totalPages} ({filteredRequests.length} total)
                    </span>
                    <button
                        style={styles.pageButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};

// Styles (keep your existing styles)
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
    statusBadge: {
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
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
        gap: "6px",
        padding: "6px 12px",
        background: "#F0F4F9",
        border: "none",
        borderRadius: "8px",
        color: "#003366",
        fontSize: "12px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            background: "#FFD700",
            color: "#003366",
        },
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginTop: "20px",
    },
    pageButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        borderRadius: "10px",
        color: "#003366",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover:not(:disabled)": {
            borderColor: "#FFD700",
        },
        ":disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
        },
    },
    pageInfo: {
        fontSize: "14px",
        color: "#4A6F8F",
        fontWeight: "500",
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

export default AllRequests;