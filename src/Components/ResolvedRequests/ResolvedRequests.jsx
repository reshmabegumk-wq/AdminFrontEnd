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
    FaCheckDouble,
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
    FaClock,
    FaSmile,
    FaStar
} from "react-icons/fa";

const ResolvedRequests = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);
    const [resolvedRequests, setResolvedRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [displayedRequests, setDisplayedRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState("all");
    const [selectedResolutionTime, setSelectedResolutionTime] = useState("all");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    const [stats, setStats] = useState({
        total: 0,
        chequeBooks: 0,
        customerQueries: 0,
        limitRequests: 0,
        stolenCards: 0,
        avgResolutionTime: 0,
        fastResolved: 0
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

    // Calculate resolution time in hours
    const getResolutionTime = (requestedDate, resolvedDate) => {
        if (!requestedDate || !resolvedDate) return null;

        const start = new Date(requestedDate);
        const end = new Date(resolvedDate);
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays}d ${diffHours % 24}h`;
        } else {
            return `${diffHours}h`;
        }
    };

    const getResolutionCategory = (requestedDate, resolvedDate) => {
        if (!requestedDate || !resolvedDate) return 'unknown';

        const start = new Date(requestedDate);
        const end = new Date(resolvedDate);
        const diffHours = (end - start) / (1000 * 60 * 60);

        if (diffHours <= 1) return 'very-fast';
        if (diffHours <= 4) return 'fast';
        if (diffHours <= 24) return 'normal';
        if (diffHours <= 48) return 'slow';
        return 'very-slow';
    };

    const getResolutionColor = (category) => {
        switch (category) {
            case 'very-fast': return '#10B981';
            case 'fast': return '#34D399';
            case 'normal': return '#FFD700';
            case 'slow': return '#F97316';
            case 'very-slow': return '#EF4444';
            default: return '#6B8BA4';
        }
    };

    const getResolutionLabel = (category) => {
        switch (category) {
            case 'very-fast': return '< 1 hour';
            case 'fast': return '1-4 hours';
            case 'normal': return '4-24 hours';
            case 'slow': return '1-2 days';
            case 'very-slow': return '> 2 days';
            default: return 'Unknown';
        }
    };

    // Fetch all resolved requests for the selected month
    const fetchResolvedRequests = async () => {
        setIsLoading(true);
        try {
            showSnackbar("info", `Loading resolved requests for ${getFormattedMonthYear()}...`);

            // Fetch from all modules with approved status
            const [chequeRes, queryRes, limitRes, stolenRes] = await Promise.allSettled([
                API.post("chequeRequest/adminChequeList", { status: "approved", page: 0, size: 100 }),
                API.post("queriesResponse/adminQueriesList", { status: "approved", page: 0, size: 100 }),
                API.post("creditLimit/adminCreditLimitList", { status: "approved", page: 0, size: 100 }),
                API.post("lostCard/adminLastCardList", { status: "approved", page: 0, size: 100 })
            ]);

            // Process and combine all resolved requests
            let allResolved = [];

            // Cheque requests
            if (chequeRes.status === 'fulfilled' && chequeRes.value?.data?.data?.content) {
                const chequeRequests = chequeRes.value.data.data.content.map(item => ({
                    id: `cheque-${item.chequeRequestId}`,
                    requestId: item.chequeRequestId,
                    module: "Cheque Books",
                    moduleIcon: FaMoneyCheck,
                    moduleColor: "#003366",
                    customerName: item.fullName || "Unknown",
                    accountNumber: item.accountNumber || "N/A",
                    status: item.status || "Approved",
                    requestedDate: item.requestedDate || item.createdDate,
                    resolvedDate: item.approvedDate || item.updatedDate,
                    description: `${item.noOfLeaves || 0} leaves cheque book`,
                    value: `${item.noOfLeaves || 0} leaves`,
                    resolvedBy: item.approvedBy || "System",
                    resolutionTime: getResolutionTime(item.requestedDate || item.createdDate, item.approvedDate || item.updatedDate),
                    resolutionCategory: getResolutionCategory(item.requestedDate || item.createdDate, item.approvedDate || item.updatedDate),
                    originalData: item
                }));
                allResolved = [...allResolved, ...chequeRequests];
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
                    status: item.status || "Approved",
                    requestedDate: item.queryRaisedDate,
                    resolvedDate: item.queryApprovedDate,
                    description: item.customerQuery?.substring(0, 50) + "...",
                    value: "Query",
                    resolvedBy: item.approvedBy || "System",
                    resolutionTime: getResolutionTime(item.queryRaisedDate, item.queryApprovedDate),
                    resolutionCategory: getResolutionCategory(item.queryRaisedDate, item.queryApprovedDate),
                    originalData: item
                }));
                allResolved = [...allResolved, ...queryRequests];
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
                    status: item.status || "Approved",
                    requestedDate: item.requestDate,
                    resolvedDate: item.approvedDate,
                    description: `Requested ₹${item.requestedLimit?.toLocaleString() || 0}`,
                    value: `₹${item.requestedLimit?.toLocaleString() || 0}`,
                    resolvedBy: item.approvedBy || "System",
                    resolutionTime: getResolutionTime(item.requestDate, item.approvedDate),
                    resolutionCategory: getResolutionCategory(item.requestDate, item.approvedDate),
                    originalData: item
                }));
                allResolved = [...allResolved, ...limitRequests];
            }

            // Stolen card requests
            if (stolenRes.status === 'fulfilled' && stolenRes.value?.data?.data?.content) {
                const stolenRequests = stolenRes.value.data.data.content.map(item => ({
                    id: `stolen-${item.lostCardId}`,
                    requestId: item.lostCardId,
                    module: "Stolen Cards",
                    moduleIcon: FaExclamationTriangle,
                    moduleColor: "#EF4444",
                    customerName: item.fullName || item.cardHolder || "Unknown",
                    accountNumber: item.accountNumber || "N/A",
                    status: item.status || "Approved",
                    requestedDate: item.createdDate,
                    resolvedDate: item.updatedDate,
                    description: `Card: ${maskCardNumber(item.lostCardNumber)}`,
                    value: "Card Blocked",
                    resolvedBy: item.updatedBy || "System",
                    resolutionTime: getResolutionTime(item.createdDate, item.updatedDate),
                    resolutionCategory: getResolutionCategory(item.createdDate, item.updatedDate),
                    originalData: item
                }));
                allResolved = [...allResolved, ...stolenRequests];
            }

            // Filter by selected month and year
            const monthNum = getMonthNumber(month);
            const yearNum = parseInt(year);

            const filteredByDate = allResolved.filter(request => {
                if (!request.resolvedDate) return false;
                const date = new Date(request.resolvedDate);
                return date.getMonth() === monthNum && date.getFullYear() === yearNum;
            });

            // Sort by resolved date (newest first)
            filteredByDate.sort((a, b) =>
                new Date(b.resolvedDate) - new Date(a.resolvedDate)
            );

            // Calculate stats
            const chequeBooks = filteredByDate.filter(r => r.module === "Cheque Books").length;
            const customerQueries = filteredByDate.filter(r => r.module === "Customer Queries").length;
            const limitRequests = filteredByDate.filter(r => r.module === "Limit Requests").length;
            const stolenCards = filteredByDate.filter(r => r.module === "Stolen Cards").length;

            // Calculate average resolution time (in hours)
            let totalHours = 0;
            let validCount = 0;
            let fastResolved = 0;

            filteredByDate.forEach(request => {
                if (request.requestedDate && request.resolvedDate) {
                    const start = new Date(request.requestedDate);
                    const end = new Date(request.resolvedDate);
                    const hours = (end - start) / (1000 * 60 * 60);
                    totalHours += hours;
                    validCount++;

                    if (hours <= 4) fastResolved++;
                }
            });

            const avgResolutionTime = validCount > 0 ? Math.round(totalHours / validCount) : 0;

            setStats({
                total: filteredByDate.length,
                chequeBooks,
                customerQueries,
                limitRequests,
                stolenCards,
                avgResolutionTime,
                fastResolved
            });

            setResolvedRequests(filteredByDate);
            setFilteredRequests(filteredByDate);
            setTotalElements(filteredByDate.length);
            setTotalPages(Math.ceil(filteredByDate.length / pageSize));
            setCurrentPage(0);

            if (filteredByDate.length === 0) {
                showSnackbar("info", `No resolved requests found for ${getFormattedMonthYear()}`);
            }

        } catch (error) {
            console.error("Error fetching resolved requests:", error);
            showSnackbar("error", "Failed to load resolved requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResolvedRequests();
    }, [month, year]);

    // Filter requests based on search, module, and resolution time
    useEffect(() => {
        if (!resolvedRequests.length) return;

        let filtered = [...resolvedRequests];

        // Apply search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(request =>
                request.customerName?.toLowerCase().includes(term) ||
                request.accountNumber?.toLowerCase().includes(term) ||
                request.description?.toLowerCase().includes(term) ||
                request.module?.toLowerCase().includes(term) ||
                request.resolvedBy?.toLowerCase().includes(term)
            );
        }

        // Apply module filter
        if (selectedModule !== "all") {
            filtered = filtered.filter(request =>
                request.module.toLowerCase() === selectedModule.toLowerCase()
            );
        }

        // Apply resolution time filter
        if (selectedResolutionTime !== "all") {
            filtered = filtered.filter(request =>
                request.resolutionCategory === selectedResolutionTime
            );
        }

        setFilteredRequests(filtered);
        setTotalElements(filtered.length);
        setTotalPages(Math.ceil(filtered.length / pageSize));
        setCurrentPage(0);
    }, [searchTerm, selectedModule, selectedResolutionTime, resolvedRequests]);

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

    // ===== REMOVED handleViewDetails function =====

    const handleExport = () => {
        try {
            const csvData = filteredRequests.map(request => ({
                'Module': request.module,
                'Customer Name': request.customerName,
                'Account Number': request.accountNumber,
                'Requested Date': formatDate(request.requestedDate),
                'Resolved Date': formatDate(request.resolvedDate),
                'Resolution Time': request.resolutionTime || 'N/A',
                'Resolved By': request.resolvedBy,
                'Description': request.description,
                'Value': request.value
            }));

            const csv = convertToCSV(csvData);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resolved-requests-${month}-${year}.csv`;
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
        document.querySelector(`.${styles.tableContainer}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p style={styles.loadingText}>Loading resolved requests for {getFormattedMonthYear()}...</p>
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
                        <FaCheckDouble size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Resolved Requests - {getFormattedMonthYear()}</h1>
                        <p style={styles.subtitle}>
                            {filteredRequests.length} of {resolvedRequests.length} resolved request{filteredRequests.length !== 1 ? 's' : ''} shown
                        </p>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <button style={styles.exportBtn} onClick={handleExport} disabled={filteredRequests.length === 0}>
                        <FaDownload size={14} />
                        Export
                    </button>
                    <button style={styles.refreshBtn} onClick={fetchResolvedRequests}>
                        <FaSync size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.primary)}>
                        <FaCheckDouble size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.total}</span>
                        <span style={styles.statLabel}>Total Resolved</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.fast)}>
                        <FaClock size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.avgResolutionTime}h</span>
                        <span style={styles.statLabel}>Avg Resolution</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.veryFast)}>
                        <FaSmile size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.fastResolved}</span>
                        <span style={styles.statLabel}>Fast Resolved</span>
                    </div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon(COLORS.cheque)}>
                        <FaMoneyCheck size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.chequeBooks}</span>
                        <span style={styles.statLabel}>Cheque Books</span>
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
                        <FaExclamationTriangle size={20} color="#FFFFFF" />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statValue}>{stats.stolenCards}</span>
                        <span style={styles.statLabel}>Stolen Cards</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <FaSearch size={14} color="#8DA6C0" style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by customer, account, description, or resolver..."
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
                        <option value="cheque books">Cheque Books</option>
                        <option value="customer queries">Customer Queries</option>
                        <option value="limit requests">Limit Requests</option>
                        <option value="stolen cards">Stolen Cards</option>
                    </select>
                    <select
                        style={styles.filterSelect}
                        value={selectedResolutionTime}
                        onChange={(e) => setSelectedResolutionTime(e.target.value)}
                    >
                        <option value="all">All Resolution Times</option>
                        <option value="very-fast">Very Fast (&lt; 1 hour)</option>
                        <option value="fast">Fast (1-4 hours)</option>
                        <option value="normal">Normal (4-24 hours)</option>
                        <option value="slow">Slow (1-2 days)</option>
                        <option value="very-slow">Very Slow (&gt; 2 days)</option>
                    </select>
                </div>
            </div>

            {/* Resolved Requests Table - ACTIONS COLUMN REMOVED */}
            <div style={styles.tableContainer}>
                {displayedRequests.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Resolution Time</th>
                                <th style={styles.th}>Module</th>
                                <th style={styles.th}>Customer</th>
                                <th style={styles.th}>Account</th>
                                <th style={styles.th}>Description</th>
                                <th style={styles.th}>Resolved Date</th>
                                <th style={styles.th}>Resolved By</th>
                                {/* ACTIONS COLUMN HEADER REMOVED */}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRequests.map((request) => {
                                const Icon = request.moduleIcon;
                                return (
                                    <tr key={request.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <div style={styles.resolutionCell}>
                                                <div style={{
                                                    ...styles.resolutionIndicator,
                                                    background: getResolutionColor(request.resolutionCategory)
                                                }} />
                                                <div>
                                                    <div style={{
                                                        ...styles.resolutionLabel,
                                                        color: getResolutionColor(request.resolutionCategory)
                                                    }}>
                                                        {request.resolutionTime || 'N/A'}
                                                    </div>
                                                    <div style={styles.resolutionCategory}>
                                                        {getResolutionLabel(request.resolutionCategory)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
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
                                                {formatDate(request.resolvedDate)}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.resolvedByCell}>
                                                <FaStar size={10} color="#FFD700" />
                                                <span>{request.resolvedBy}</span>
                                            </div>
                                        </td>
                                        {/* ACTIONS CELL REMOVED */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div style={styles.noDataContainer}>
                        <FaCheckDouble size={48} color="#E6EDF5" />
                        <p style={styles.noDataText}>
                            {searchTerm || selectedModule !== "all" || selectedResolutionTime !== "all"
                                ? "No matching resolved requests found"
                                : `No resolved requests for ${getFormattedMonthYear()}`}
                        </p>
                        <p style={styles.noDataSubtext}>
                            {searchTerm || selectedModule !== "all" || selectedResolutionTime !== "all"
                                ? "Try adjusting your filters"
                                : "No requests have been resolved yet this month."}
                        </p>
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
                        Page {currentPage + 1} of {totalPages}
                        {filteredRequests.length > 0 && ` (${filteredRequests.length} total)`}
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

// Colors
const COLORS = {
    primary: '#003366',
    veryFast: '#10B981',
    fast: '#34D399',
    normal: '#FFD700',
    slow: '#F97316',
    verySlow: '#EF4444',
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
    resolutionCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    resolutionIndicator: {
        width: "8px",
        height: "8px",
        borderRadius: "4px",
    },
    resolutionLabel: {
        fontSize: "13px",
        fontWeight: "600",
    },
    resolutionCategory: {
        fontSize: "10px",
        color: "#8DA6C0",
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
    resolvedByCell: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        color: "#003366",
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

export default ResolvedRequests;