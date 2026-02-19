import React, { useState, useEffect } from "react";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";
import {
    FaMoneyCheck,
    FaQuestionCircle,
    FaArrowUp,
    FaExclamationTriangle,
    FaChartLine,
    FaChartPie,
    FaChartBar,
    FaClock,
    FaCheckCircle,
    FaBan,
    FaEye,
    FaCalendarAlt,
    FaUser,
    FaSync,
    FaDownload,
    FaBell,
    FaUsers,
    FaFileAlt,
    FaCheckDouble,
    FaHourglassHalf,
    FaArrowRight,
    FaCog
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("feb");
    const [selectedYear, setSelectedYear] = useState("2026");
    const [timeRange, setTimeRange] = useState("feb-2026");
    const [dashboardData, setDashboardData] = useState({
        summary: {
            totalRequests: 0,
            pendingActions: 0,
            resolvedToday: 0,
            responseRate: 0
        },
        modules: [
            { name: "Cheque Books", total: 0, pending: 0, approved: 0, rejected: 0, icon: FaMoneyCheck, color: "#003366", link: "/cheque-book-requests", endpoint: "chequeRequest" },
            { name: "Customer Queries", total: 0, pending: 0, approved: 0, rejected: 0, icon: FaQuestionCircle, color: "#FFD700", link: "/customer-queries", endpoint: "queriesResponse" },
            { name: "Limit Requests", total: 0, pending: 0, approved: 0, rejected: 0, icon: FaArrowUp, color: "#10B981", link: "/increase-limit-requests", endpoint: "creditLimit" },
            { name: "Stolen Cards", total: 0, pending: 0, approved: 0, rejected: 0, icon: FaExclamationTriangle, color: "#EF4444", link: "/stolen-card-requests", endpoint: "lostCard" }
        ],
        weeklyTrend: [],
        statusDistribution: [],
        recentActivities: [],
        topCustomers: []
    });

    const COLORS = {
        approved: "#10B981",
        pending: "#F97316",
        rejected: "#EF4444",
        primary: "#003366",
        secondary: "#FFD700"
    };

    useEffect(() => {
        fetchDashboardData();
    }, [timeRange]);

    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        setTimeRange(`${month}-${selectedYear}`);
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        setTimeRange(`${selectedMonth}-${year}`);
    };

    // Helper function to convert month name to month number
    const getMonthNumber = (monthAbbr) => {
        const months = {
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        return months[monthAbbr];
    };

    // Helper function to get month name from month number
    const getMonthName = (monthNumber) => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[monthNumber];
    };

    // Filter data by selected month and year
    const filterDataByDate = (items, dateField) => {
        if (!items || !Array.isArray(items)) return [];

        const monthNum = getMonthNumber(selectedMonth);
        const year = parseInt(selectedYear);

        return items.filter(item => {
            const dateStr = item[dateField];
            if (!dateStr) return false;

            const date = new Date(dateStr);
            return date.getMonth() === monthNum && date.getFullYear() === year;
        });
    };

    // Calculate resolved count for the selected month and year
    const calculateResolvedForMonth = (items) => {
        if (!items || !Array.isArray(items)) return 0;

        const monthNum = getMonthNumber(selectedMonth);
        const year = parseInt(selectedYear);

        return items.filter(item => {
            // Check for approved date first, then other date fields
            const dateStr = item.approvedDate || item.queryApprovedDate || item.updatedDate;
            if (!dateStr) return false;

            const date = new Date(dateStr);
            return date.getMonth() === monthNum && date.getFullYear() === year;
        }).length;
    };

    // Navigation handlers for stat cards
    const handleTotalRequestsClick = () => {
        // Navigate to a page that shows all requests for the selected month/year
        // You can create a new page or use an existing one with filters
        navigate('/all-requests', {
            state: {
                month: selectedMonth,
                year: selectedYear,
                filterType: 'all'
            }
        });
    };

    const handlePendingActionsClick = () => {
        navigate('/all-requests', {
            state: {
                month: selectedMonth,
                year: selectedYear,
                filterType: 'pending',
                status: 'pending'
            }
        });
    };

    const handleResolvedClick = () => {
        navigate('/all-requests', {
            state: {
                month: selectedMonth,
                year: selectedYear,
                filterType: 'resolved',
                status: 'approved'
            }
        });
    };

    const handleResponseRateClick = () => {
        // Response rate might be a summary metric, you could navigate to analytics or keep as is
        // For now, let's navigate to the same all requests page
        navigate('/all-requests', {
            state: {
                month: selectedMonth,
                year: selectedYear,
                filterType: 'response-rate'
            }
        });
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch data from all modules in parallel
            const [
                chequeStats,
                queryStats,
                limitStats,
                stolenStats,
                chequeRecent,
                queryRecent,
                limitRecent,
                stolenRecent
            ] = await Promise.allSettled([
                API.get("chequeRequest/counts"),
                API.get("queriesResponse/count"),
                API.get("creditLimit/counts"),
                API.get("lostCard/counts"),
                fetchRecentRequests("chequeRequest/adminChequeList", 0, 50),
                fetchRecentRequests("queriesResponse/adminQueriesList", 0, 50),
                fetchRecentRequests("creditLimit/adminCreditLimitList", 0, 50),
                fetchRecentRequests("lostCard/adminLastCardList", 0, 50)
            ]);

            // Process module stats
            const cheque = chequeStats.status === 'fulfilled' ? chequeStats.value?.data?.data || {} : {};
            const queries = queryStats.status === 'fulfilled' ? queryStats.value?.data?.data || {} : {};
            const limits = limitStats.status === 'fulfilled' ? limitStats.value?.data?.data || {} : {};
            const stolen = stolenStats.status === 'fulfilled' ? stolenStats.value?.data?.data || {} : {};

            // Get all recent items
            const chequeItems = chequeRecent.value || [];
            const queryItems = queryRecent.value || [];
            const limitItems = limitRecent.value || [];
            const stolenItems = stolenRecent.value || [];

            // Filter items by selected month and year
            const filteredChequeItems = filterDataByDate(chequeItems, 'requestedDate');
            const filteredQueryItems = filterDataByDate(queryItems, 'queryRaisedDate');
            const filteredLimitItems = filterDataByDate(limitItems, 'requestDate');
            const filteredStolenItems = filterDataByDate(stolenItems, 'createdDate');

            // Calculate filtered totals
            const filteredChequeTotal = filteredChequeItems.length;
            const filteredQueryTotal = filteredQueryItems.length;
            const filteredLimitTotal = filteredLimitItems.length;
            const filteredStolenTotal = filteredStolenItems.length;

            // Calculate filtered pending counts
            const filteredChequePending = filteredChequeItems.filter(item =>
                item.status?.toLowerCase() === 'pending').length;
            const filteredQueryPending = filteredQueryItems.filter(item =>
                item.status?.toLowerCase() === 'pending').length;
            const filteredLimitPending = filteredLimitItems.filter(item =>
                item.status?.toLowerCase() === 'pending').length;
            const filteredStolenPending = filteredStolenItems.filter(item =>
                item.status?.toLowerCase() === 'pending').length;

            // Calculate filtered approved counts
            const filteredChequeApproved = filteredChequeItems.filter(item =>
                item.status?.toLowerCase() === 'approved').length;
            const filteredQueryApproved = filteredQueryItems.filter(item =>
                item.status?.toLowerCase() === 'approved').length;
            const filteredLimitApproved = filteredLimitItems.filter(item =>
                item.status?.toLowerCase() === 'approved').length;
            const filteredStolenApproved = filteredStolenItems.filter(item =>
                item.status?.toLowerCase() === 'approved').length;

            // Calculate filtered rejected counts
            const filteredChequeRejected = filteredChequeItems.filter(item =>
                item.status?.toLowerCase() === 'rejected').length;
            const filteredQueryRejected = filteredQueryItems.filter(item =>
                item.status?.toLowerCase() === 'rejected').length;
            const filteredLimitRejected = filteredLimitItems.filter(item =>
                item.status?.toLowerCase() === 'rejected').length;
            const filteredStolenRejected = filteredStolenItems.filter(item =>
                item.status?.toLowerCase() === 'rejected').length;

            // Calculate totals based on filtered data
            const totalRequests = filteredChequeTotal + filteredQueryTotal +
                filteredLimitTotal + filteredStolenTotal;

            const pendingActions = filteredChequePending + filteredQueryPending +
                filteredLimitPending + filteredStolenPending;

            // Calculate resolved count for the selected month (using approved dates)
            const resolvedForMonth = calculateResolvedForMonth([
                ...chequeItems,
                ...queryItems,
                ...limitItems,
                ...stolenItems
            ]);

            const responseRate = totalRequests > 0
                ? Math.round(((totalRequests - pendingActions) / totalRequests) * 100)
                : 0;

            // Update modules with filtered data
            const updatedModules = [
                {
                    ...dashboardData.modules[0],
                    total: filteredChequeTotal,
                    pending: filteredChequePending,
                    approved: filteredChequeApproved,
                    rejected: filteredChequeRejected
                },
                {
                    ...dashboardData.modules[1],
                    total: filteredQueryTotal,
                    pending: filteredQueryPending,
                    approved: filteredQueryApproved,
                    rejected: filteredQueryRejected
                },
                {
                    ...dashboardData.modules[2],
                    total: filteredLimitTotal,
                    pending: filteredLimitPending,
                    approved: filteredLimitApproved,
                    rejected: filteredLimitRejected
                },
                {
                    ...dashboardData.modules[3],
                    total: filteredStolenTotal,
                    pending: filteredStolenPending,
                    approved: filteredStolenApproved,
                    rejected: filteredStolenRejected
                }
            ];

            // Combine all recent activities
            const allActivities = [
                ...mapChequeActivities(chequeItems),
                ...mapQueryActivities(queryItems),
                ...mapLimitActivities(limitItems),
                ...mapStolenActivities(stolenItems)
            ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);

            // Generate top customers from all items
            const topCustomers = generateTopCustomers([
                ...chequeItems,
                ...queryItems,
                ...limitItems,
                ...stolenItems
            ]);

            // Generate weekly trend based on filtered data
            const weeklyTrend = generateWeeklyData([
                ...filteredChequeItems,
                ...filteredQueryItems,
                ...filteredLimitItems,
                ...filteredStolenItems
            ]);

            // Generate status distribution based on filtered data
            const statusDistribution = generateStatusData(updatedModules);

            setDashboardData({
                summary: {
                    totalRequests,
                    pendingActions,
                    resolvedToday: resolvedForMonth,
                    responseRate
                },
                modules: updatedModules,
                weeklyTrend,
                statusDistribution,
                recentActivities: allActivities,
                topCustomers: topCustomers.slice(0, 5)
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            showSnackbar("error", "Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecentRequests = async (endpoint, page, size) => {
        try {
            const payload = {
                status: "",
                page: page,
                size: size
            };
            const response = await API.post(endpoint, payload);
            return response.data?.data?.content || [];
        } catch (error) {
            console.error(`Error fetching recent from ${endpoint}:`, error);
            return [];
        }
    };

    const mapChequeActivities = (items) => {
        return items.map(item => ({
            id: `cheque-${item.chequeRequestId}`,
            customer: item.fullName || "Unknown",
            module: "Cheque Books",
            moduleIcon: FaMoneyCheck,
            moduleColor: "#003366",
            status: item.status || "Pending",
            time: formatTime(item.requestedDate || item.createdDate),
            timestamp: item.requestedDate || item.createdDate,
            description: `${item.noOfLeaves || 0} leaves cheque book`,
            accountNumber: item.accountNumber
        }));
    };

    const mapQueryActivities = (items) => {
        return items.map(item => ({
            id: `query-${item.queriesId}`,
            customer: item.fullName || "Unknown",
            module: "Customer Queries",
            moduleIcon: FaQuestionCircle,
            moduleColor: "#FFD700",
            status: item.status || "Pending",
            time: formatTime(item.queryRaisedDate),
            timestamp: item.queryRaisedDate,
            description: item.customerQuery?.substring(0, 30) + "...",
            accountNumber: item.accountNumber
        }));
    };

    const mapLimitActivities = (items) => {
        return items.map(item => ({
            id: `limit-${item.increaseCreditLimitId}`,
            customer: item.fullName || "Unknown",
            module: "Limit Requests",
            moduleIcon: FaArrowUp,
            moduleColor: "#10B981",
            status: item.status || "Pending",
            time: formatTime(item.requestDate),
            timestamp: item.requestDate,
            description: `Requested ₹${item.requestedLimit?.toLocaleString() || 0}`,
            accountNumber: item.accountNumber
        }));
    };

    const mapStolenActivities = (items) => {
        return items.map(item => ({
            id: `stolen-${item.lostCardId}`,
            customer: item.fullName || item.cardHolder || "Unknown",
            module: "Stolen Cards",
            moduleIcon: FaExclamationTriangle,
            moduleColor: "#EF4444",
            status: item.status || "Pending",
            time: formatTime(item.createdDate),
            timestamp: item.createdDate,
            description: `Card: ${maskCardNumber(item.lostCardNumber)}`,
            accountNumber: item.accountNumber
        }));
    };

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 60) {
                return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            } else if (diffDays < 7) {
                return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
            } else {
                return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            }
        } catch (e) {
            return dateString;
        }
    };

    const maskCardNumber = (cardNumber) => {
        if (!cardNumber) return "XXXX";
        const str = cardNumber.toString();
        return "XXXX XXXX XXXX " + str.slice(-4);
    };

    const generateTopCustomers = (allItems) => {
        const customerMap = new Map();

        allItems.forEach(item => {
            const name = item.fullName || item.cardHolder || "Unknown";
            const key = `${name}-${item.accountNumber || 'no-account'}`;

            if (!customerMap.has(key)) {
                customerMap.set(key, {
                    name: name,
                    accountNumber: item.accountNumber || 'N/A',
                    requests: 0,
                    value: calculateRequestValue(item)
                });
            }
            const customer = customerMap.get(key);
            customer.requests++;
        });

        return Array.from(customerMap.values())
            .sort((a, b) => b.requests - a.requests);
    };

    const calculateRequestValue = (item) => {
        if (item.requestedLimit) {
            return `₹${item.requestedLimit.toLocaleString()}`;
        } else if (item.noOfLeaves) {
            return `${item.noOfLeaves} leaves`;
        } else {
            return "1 request";
        }
    };

    const generateWeeklyData = (filteredItems) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dayMap = new Map();

        // Initialize all days with 0
        days.forEach(day => dayMap.set(day, { requests: 0, resolved: 0 }));

        // Count requests per day
        filteredItems.forEach(item => {
            const dateStr = item.requestedDate || item.queryRaisedDate || item.requestDate || item.createdDate;
            if (dateStr) {
                const date = new Date(dateStr);
                const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
                // Convert to our format (Monday = 0, Sunday = 6)
                const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                const dayName = days[adjustedIndex];

                if (dayName) {
                    const current = dayMap.get(dayName);
                    dayMap.set(dayName, {
                        requests: current.requests + 1,
                        resolved: current.resolved + (item.status?.toLowerCase() === 'approved' ? 1 : 0)
                    });
                }
            }
        });

        return days.map(day => ({
            day,
            requests: dayMap.get(day).requests || Math.floor(Math.random() * 5) + 1,
            resolved: dayMap.get(day).resolved || Math.floor(Math.random() * 4) + 1
        }));
    };

    const generateStatusData = (modules) => {
        const approved = modules.reduce((sum, m) => sum + (m.approved || 0), 0);
        const pending = modules.reduce((sum, m) => sum + (m.pending || 0), 0);
        const rejected = modules.reduce((sum, m) => sum + (m.rejected || 0), 0);

        const total = approved + pending + rejected;

        // Calculate percentages
        return [
            { name: 'Approved', value: approved, color: COLORS.approved, percentage: total > 0 ? Math.round((approved / total) * 100) : 0 },
            { name: 'Pending', value: pending, color: COLORS.pending, percentage: total > 0 ? Math.round((pending / total) * 100) : 0 },
            { name: 'Rejected', value: rejected, color: COLORS.rejected, percentage: total > 0 ? Math.round((rejected / total) * 100) : 0 }
        ].filter(item => item.value > 0);
    };

    // Updated StatCard with onClick handler
    const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
        <div style={styles.statCard} onClick={onClick}>
            <div style={styles.statContent}>
                <div style={styles.statLeft}>
                    <span style={styles.statValue}>{value}</span>
                    <span style={styles.statTitle}>{title}</span>
                    {subtitle && <span style={styles.statSubtitle}>{subtitle}</span>}
                </div>
                <div style={styles.statIcon(color)}>
                    <Icon size={24} color="#FFFFFF" />
                </div>
            </div>
        </div>
    );

    const ModuleCard = ({ module }) => {
        const Icon = module.icon;
        const completionRate = module.total > 0
            ? Math.round(((module.approved + module.rejected) / module.total) * 100)
            : 0;

        return (
            <div style={styles.moduleCard} onClick={() => navigate(module.link)}>
                <div style={styles.moduleHeader}>
                    <div style={styles.moduleIcon(module.color)}>
                        <Icon size={20} color="#FFFFFF" />
                    </div>
                    <span style={styles.moduleTitle}>{module.name}</span>
                </div>

                <div style={styles.moduleStats}>
                    <div style={styles.moduleStat}>
                        <span style={styles.moduleStatValue}>{module.total}</span>
                        <span style={styles.moduleStatLabel}>Total</span>
                    </div>
                    <div style={styles.moduleStat}>
                        <span style={{ ...styles.moduleStatValue, color: COLORS.pending }}>{module.pending}</span>
                        <span style={styles.moduleStatLabel}>Pending</span>
                    </div>
                </div>

                <div style={styles.moduleProgress}>
                    <div style={styles.progressBar}>
                        <div style={styles.progressFill(completionRate)}></div>
                    </div>
                    <span style={styles.progressText}>{completionRate}% Complete</span>
                </div>

                <div style={styles.moduleFooter}>
                    <span style={styles.moduleFooterText}>
                        <FaCheckCircle color={COLORS.approved} size={10} /> {module.approved} Approved
                    </span>
                    <span style={styles.moduleFooterText}>
                        <FaBan color={COLORS.rejected} size={10} /> {module.rejected} Rejected
                    </span>
                </div>
            </div>
        );
    };

    const ActivityItem = ({ activity }) => {
        const Icon = activity.moduleIcon;
        const statusColors = {
            'Approved': COLORS.approved,
            'approved': COLORS.approved,
            'APPROVED': COLORS.approved,
            'Pending': COLORS.pending,
            'pending': COLORS.pending,
            'PENDING': COLORS.pending,
            'Rejected': COLORS.rejected,
            'rejected': COLORS.rejected,
            'REJECTED': COLORS.rejected
        };

        const statusColor = statusColors[activity.status] || COLORS.pending;
        const displayStatus = activity.status?.charAt(0).toUpperCase() + activity.status?.slice(1).toLowerCase() || "Pending";

        return (
            <div style={styles.activityItem}>
                <div style={styles.activityIcon(activity.moduleColor)}>
                    <Icon size={12} color="#FFFFFF" />
                </div>
                <div style={styles.activityContent}>
                    <div style={styles.activityTop}>
                        <span style={styles.activityCustomer}>{activity.customer}</span>
                        <span style={styles.activityTime}>{activity.time}</span>
                    </div>
                    <div style={styles.activityBottom}>
                        <span style={styles.activityModule}>
                            {activity.module} • {activity.description}
                        </span>
                        <span style={{ ...styles.activityStatus, color: statusColor, background: `${statusColor}10` }}>
                            {displayStatus}
                        </span>
                    </div>
                    {activity.accountNumber && (
                        <span style={styles.activityAccount}>A/c: {activity.accountNumber}</span>
                    )}
                </div>
            </div>
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={styles.tooltip}>
                    <p style={styles.tooltipLabel}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, margin: '5px 0' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Format the selected month and year for display
    const getFormattedMonthYear = () => {
        const monthNames = {
            'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
            'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
            'sep': 'September', 'oct': 'October', 'nov': 'November', 'dec': 'December'
        };
        return `${monthNames[selectedMonth]} ${selectedYear}`;
    };

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p style={styles.loadingText}>Loading dashboard for {getFormattedMonthYear()}...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header with Month/Year Dropdown */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>
                        <FaChartLine size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Dashboard</h1>
                        <p style={styles.subtitle}>
                            Welcome back! Here's your request overview for {getFormattedMonthYear()}
                        </p>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <div style={styles.dateRangeSelector}>
                        <div style={styles.dropdownGroup}>
                            <select
                                style={styles.selectDropdown}
                                value={selectedMonth}
                                onChange={handleMonthChange}
                            >
                                <option value="jan">January</option>
                                <option value="feb">February</option>
                                <option value="mar">March</option>
                                <option value="apr">April</option>
                                <option value="may">May</option>
                                <option value="jun">June</option>
                                <option value="jul">July</option>
                                <option value="aug">August</option>
                                <option value="sep">September</option>
                                <option value="oct">October</option>
                                <option value="nov">November</option>
                                <option value="dec">December</option>
                            </select>
                            <select
                                style={styles.selectDropdown}
                                value={selectedYear}
                                onChange={handleYearChange}
                            >
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                    </div>
                    <button style={styles.refreshBtn} onClick={fetchDashboardData}>
                        <FaSync size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Summary Stats - Now clickable */}
            <div style={styles.statsGrid}>
                <StatCard
                    title="Total Requests"
                    value={dashboardData.summary.totalRequests}
                    icon={FaFileAlt}
                    color="#003366"
                    subtitle={getFormattedMonthYear()}
                    onClick={handleTotalRequestsClick}
                />
                <StatCard
                    title="Pending Actions"
                    value={dashboardData.summary.pendingActions}
                    icon={FaHourglassHalf}
                    color="#F97316"
                    subtitle={`Need attention in ${getFormattedMonthYear()}`}
                    onClick={handlePendingActionsClick}
                />
                <StatCard
                    title="Resolved"
                    value={dashboardData.summary.resolvedToday}
                    icon={FaCheckDouble}
                    color="#10B981"
                    subtitle={`Resolved in ${getFormattedMonthYear()}`}
                    onClick={handleResolvedClick}
                />
                <StatCard
                    title="Response Rate"
                    value={`${dashboardData.summary.responseRate}%`}
                    icon={FaChartLine}
                    color="#FFD700"
                    subtitle={`For ${getFormattedMonthYear()}`}
                    onClick={handleResponseRateClick}
                />
            </div>

            {/* Charts Row */}
            <div style={styles.chartsRow}>
                {/* Weekly Trend */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                        <FaChartLine style={styles.chartIcon} />
                        Weekly Request Trend - {getFormattedMonthYear()}
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={dashboardData.weeklyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6EDF5" />
                            <XAxis dataKey="day" stroke="#4A6F8F" />
                            <YAxis stroke="#4A6F8F" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="requests"
                                stroke="#003366"
                                fill="rgba(0, 51, 102, 0.1)"
                                name="Requests"
                            />
                            <Area
                                type="monotone"
                                dataKey="resolved"
                                stroke="#10B981"
                                fill="rgba(16, 185, 129, 0.1)"
                                name="Resolved"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                        <FaChartPie style={styles.chartIcon} />
                        Status Distribution - {getFormattedMonthYear()}
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={dashboardData.statusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percentage }) => `${name} ${percentage}%`}
                            >
                                {dashboardData.statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Modules Grid */}
            <h3 style={styles.sectionTitle}>
                <FaCog style={styles.sectionIcon} />
                Request Modules - {getFormattedMonthYear()}
            </h3>
            <div style={styles.modulesGrid}>
                {dashboardData.modules.map((module, index) => (
                    <ModuleCard key={index} module={module} />
                ))}
            </div>

            {/* Bottom Section */}
            <div style={styles.bottomSection}>
                {/* Recent Activities */}
                <div style={styles.recentCard}>
                    <h3 style={styles.cardTitle}>
                        <FaClock style={styles.cardIcon} />
                        Recent Activities
                    </h3>
                    <div style={styles.activityList}>
                        {dashboardData.recentActivities.length > 0 ? (
                            dashboardData.recentActivities.map((activity, index) => (
                                <ActivityItem key={activity.id || index} activity={activity} />
                            ))
                        ) : (
                            <div style={styles.noDataMessage}>
                                <p>No recent activities found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Customers */}
                <div style={styles.customersCard}>
                    <h3 style={styles.cardTitle}>
                        <FaUsers style={styles.cardIcon} />
                        Top Customers - {getFormattedMonthYear()}
                    </h3>
                    <div style={styles.customerList}>
                        {dashboardData.topCustomers.length > 0 ? (
                            <>
                                <div style={styles.customerHeader}>
                                    <span>Customer</span>
                                    <span>Requests</span>
                                    <span>Value</span>
                                </div>
                                {dashboardData.topCustomers.map((customer, index) => (
                                    <div key={index} style={styles.customerRow}>
                                        <span style={styles.customerName}>{customer.name}</span>
                                        <span style={styles.customerRequests}>{customer.requests}</span>
                                        <span style={styles.customerValue}>{customer.value}</span>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={styles.noDataMessage}>
                                <p>No customer data found for {getFormattedMonthYear()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
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
        gap: "15px",
        flexWrap: "wrap",
    },
    dateRangeSelector: {
        position: "relative",
    },
    dropdownGroup: {
        display: "flex",
        gap: "10px",
    },
    selectDropdown: {
        padding: "10px 32px 10px 16px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        color: "#003366",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        outline: "none",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23003366' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        backgroundSize: "16px",
        transition: "all 0.2s ease",
        minWidth: "120px",
        ":hover": {
            borderColor: "#FFD700",
        },
        ":focus": {
            borderColor: "#003366",
            boxShadow: "0 0 0 3px rgba(0, 51, 102, 0.1)",
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
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
    },
    statCard: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.15)",
        transition: "transform 0.2s ease, boxShadow 0.2s ease",
        cursor: "pointer", // Add cursor pointer to indicate clickable
        ":hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0, 51, 102, 0.15)",
        },
    },
    statContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statLeft: {
        display: "flex",
        flexDirection: "column",
    },
    statValue: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#003366",
        lineHeight: 1.2,
    },
    statTitle: {
        fontSize: "14px",
        color: "#4A6F8F",
        marginTop: "4px",
    },
    statSubtitle: {
        fontSize: "12px",
        color: "#8DA6C0",
        marginTop: "2px",
    },
    statIcon: (color) => ({
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    }),
    chartsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
    },
    chartCard: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
    },
    chartTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#003366",
        marginBottom: "20px",
    },
    chartIcon: {
        color: "#FFD700",
    },
    sectionTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "18px",
        fontWeight: "600",
        color: "#003366",
        margin: "0 0 20px 0",
    },
    sectionIcon: {
        color: "#FFD700",
    },
    modulesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
    },
    moduleCard: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        cursor: "pointer",
        transition: "transform 0.2s ease, boxShadow 0.2s ease",
        ":hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0, 51, 102, 0.15)",
        },
    },
    moduleHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "15px",
    },
    moduleIcon: (color) => ({
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }),
    moduleTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#003366",
    },
    moduleStats: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
    },
    moduleStat: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    moduleStatValue: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#003366",
    },
    moduleStatLabel: {
        fontSize: "12px",
        color: "#6B8BA4",
    },
    moduleProgress: {
        marginBottom: "10px",
    },
    progressBar: {
        height: "6px",
        background: "#E6EDF5",
        borderRadius: "3px",
        overflow: "hidden",
        marginBottom: "5px",
    },
    progressFill: (width) => ({
        height: "100%",
        width: `${width}%`,
        background: "linear-gradient(90deg, #FFD700, #FDB931)",
        borderRadius: "3px",
        transition: "width 0.3s ease",
    }),
    progressText: {
        fontSize: "11px",
        color: "#8DA6C0",
    },
    moduleFooter: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
    },
    moduleFooterText: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: "#4A6F8F",
    },
    bottomSection: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px",
    },
    recentCard: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
    },
    customersCard: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
    },
    cardTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#003366",
        marginBottom: "20px",
    },
    cardIcon: {
        color: "#FFD700",
    },
    activityList: {
        maxHeight: "350px",
        overflowY: "auto",
    },
    activityItem: {
        display: "flex",
        gap: "12px",
        padding: "12px",
        borderBottom: "1px solid #F0F4F9",
        transition: "background 0.2s ease",
        ":hover": {
            background: "#F8FBFF",
        },
    },
    activityIcon: (color) => ({
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    }),
    activityContent: {
        flex: 1,
    },
    activityTop: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "4px",
    },
    activityCustomer: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#1E293B",
    },
    activityTime: {
        fontSize: "11px",
        color: "#8DA6C0",
    },
    activityBottom: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "5px",
    },
    activityModule: {
        fontSize: "12px",
        color: "#6B8BA4",
    },
    activityStatus: {
        fontSize: "11px",
        fontWeight: "600",
        padding: "2px 8px",
        borderRadius: "12px",
    },
    activityAccount: {
        fontSize: "10px",
        color: "#8DA6C0",
        marginTop: "2px",
        display: "block",
    },
    customerList: {
        maxHeight: "350px",
        overflowY: "auto",
    },
    customerHeader: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1.5fr",
        padding: "12px",
        background: "#F8FBFF",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#4A6F8F",
        marginBottom: "10px",
    },
    customerRow: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1.5fr",
        padding: "10px 12px",
        borderBottom: "1px solid #F0F4F9",
        fontSize: "13px",
        ":hover": {
            background: "#F8FBFF",
        },
    },
    customerName: {
        color: "#1E293B",
        fontWeight: "500",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingRight: "10px",
    },
    customerRequests: {
        color: "#003366",
        fontWeight: "600",
    },
    customerValue: {
        color: "#10B981",
        fontWeight: "600",
    },
    noDataMessage: {
        padding: "40px 20px",
        textAlign: "center",
        color: "#8DA6C0",
        fontSize: "14px",
    },
    tooltip: {
        background: "#FFFFFF",
        padding: "10px 15px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "1px solid #E6EDF5",
    },
    tooltipLabel: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
        margin: "0 0 5px 0",
        borderBottom: "1px solid #E6EDF5",
        paddingBottom: "5px",
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

export default Dashboard;