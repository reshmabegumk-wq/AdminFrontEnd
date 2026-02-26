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
    FaCog,
    FaInfoCircle,
    FaBook,
    FaCreditCard,
    FaShieldAlt,
    FaUserCircle
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

// ─── HDFC Design Tokens (matches login page exactly) ─────────────────────────
const H = {
    navy: "#003580",
    navyDark: "#002D6E",
    navyDeep: "#001E4E",
    navyLight: "#E8EEF8",
    navyMid: "#1A4FA0",
    red: "#E31837",
    redDark: "#C0122D",
    redLight: "#FDEAED",
    white: "#FFFFFF",
    offWhite: "#F4F6FA",
    g100: "#EEF1F7",
    g200: "#DDE3EF",
    g400: "#B0B8CC",
    g500: "#8C9BB5",
    g600: "#6B778C",
    g800: "#2C3347",
    text: "#1A1F36",
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("feb");
    const [selectedYear, setSelectedYear] = useState("2026");
    const [timeRange, setTimeRange] = useState("feb-2026");
    const [isFutureMonth, setIsFutureMonth] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        summary: {
            totalRequests: 0,
            pendingActions: 0,
            resolvedToday: 0,
            responseRate: 0
        },
        modules: [
            {
                name: "Cheque Leaves",
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                icon: FaBook,
                color: H.navy,
                link: "/cheque-book",
                endpoint: "chequeRequest"
            },
            {
                name: "Customer Queries",
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                icon: FaQuestionCircle,
                color: H.red,
                link: "/customer-queries",
                endpoint: "queriesResponse"
            },
            {
                name: "Limit Requests",
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                icon: FaArrowUp,
                color: "#10B981",
                link: "/increase-limit",
                endpoint: "creditLimit"
            },
            {
                name: "Stolen Cards",
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                icon: FaShieldAlt,
                color: "#F97316",
                link: "/stolen-card",
                endpoint: "lostCard"
            }
        ],
        weeklyTrend: [],
        statusDistribution: []
    });

    const COLORS = {
        approved: "#10B981",
        pending: "#F97316",
        rejected: "#E31837",
        primary: H.navy,
        secondary: H.red,
        success: "#10B981",
        info: H.navyMid,
        warning: "#F59E0B",
        green: "#10B981"
    };

    // ── All original logic — 100% untouched ────────────────────────────────

    useEffect(() => {
        checkIfFutureDate();
        fetchDashboardData();
    }, [timeRange]);

    const checkIfFutureDate = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const selectedMonthNum = getMonthNumber(selectedMonth);
        const selectedYearNum = parseInt(selectedYear);
        const isFuture = (selectedYearNum > currentYear) ||
            (selectedYearNum === currentYear && selectedMonthNum > currentMonth);
        setIsFutureMonth(isFuture);
        if (isFuture) {
            showSnackbar("info", `Showing preview for ${getFormattedMonthYear()} (no actual data available yet)`);
        }
    };

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

    const getMonthNumber = (monthAbbr) => {
        const months = {
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
            'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        return months[monthAbbr];
    };

    const getMonthName = (monthNumber) => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[monthNumber];
    };

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

    const calculateResolvedForMonth = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        const monthNum = getMonthNumber(selectedMonth);
        const year = parseInt(selectedYear);
        return items.filter(item => {
            const dateStr = item.approvedDate || item.queryApprovedDate || item.updatedDate;
            if (!dateStr) return false;
            const date = new Date(dateStr);
            return date.getMonth() === monthNum && date.getFullYear() === year;
        }).length;
    };

    const generateMockDataForMonth = () => {
        const monthNum = getMonthNumber(selectedMonth);
        const year = parseInt(selectedYear);
        const seed = (monthNum + 1) * (year - 2020);
        Math.seed = seed;
        const mockRandom = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
        const baseTotal = Math.floor(mockRandom() * 40) + 30;
        const pendingPercent = mockRandom() * 0.3 + 0.2;
        const approvedPercent = mockRandom() * 0.3 + 0.4;
        const rejectedPercent = 1 - pendingPercent - approvedPercent;
        const mockModules = [
            { ...dashboardData.modules[0], total: Math.floor(mockRandom() * 15) + 5, pending: 0, approved: 0, rejected: 0 },
            { ...dashboardData.modules[1], total: Math.floor(mockRandom() * 20) + 10, pending: 0, approved: 0, rejected: 0 },
            { ...dashboardData.modules[2], total: Math.floor(mockRandom() * 10) + 3, pending: 0, approved: 0, rejected: 0 },
            { ...dashboardData.modules[3], total: Math.floor(mockRandom() * 8) + 2, pending: 0, approved: 0, rejected: 0 }
        ];
        const totalRequests = mockModules.reduce((sum, m) => sum + m.total, 0);
        const pendingActions = Math.floor(totalRequests * pendingPercent);
        const resolvedToday = Math.floor(totalRequests * approvedPercent);
        const responseRate = totalRequests > 0 ? Math.round((resolvedToday / totalRequests) * 100) : 0;
        mockModules.forEach(module => {
            const moduleTotal = module.total;
            module.pending = Math.floor(moduleTotal * pendingPercent);
            module.approved = Math.floor(moduleTotal * approvedPercent);
            module.rejected = moduleTotal - module.pending - module.approved;
        });
        return {
            summary: { totalRequests, pendingActions, resolvedToday, responseRate },
            modules: mockModules,
            weeklyTrend: generateMockWeeklyData(totalRequests, resolvedToday),
            statusDistribution: [
                { name: 'Approved', value: resolvedToday, color: COLORS.approved, percentage: responseRate },
                { name: 'Pending', value: pendingActions, color: COLORS.pending, percentage: Math.round(pendingActions / totalRequests * 100) },
                { name: 'Rejected', value: totalRequests - resolvedToday - pendingActions, color: COLORS.rejected, percentage: Math.round((totalRequests - resolvedToday - pendingActions) / totalRequests * 100) }
            ].filter(item => item.value > 0)
        };
    };

    const generateMockWeeklyData = (totalRequests, totalResolved) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const requestsPerDay = Math.floor(totalRequests / 7);
        const resolvedPerDay = Math.floor(totalResolved / 7);
        return days.map((day, index) => ({
            day,
            requests: index < totalRequests % 7 ? requestsPerDay + 1 : requestsPerDay,
            resolved: index < totalResolved % 7 ? resolvedPerDay + 1 : resolvedPerDay
        }));
    };

    const generateEmptyWeeklyData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({ day, requests: 0, resolved: 0 }));
    };

    const handleTotalRequestsClick = () => {
        if (dashboardData.summary.totalRequests === 0) {
            showSnackbar("info", `No requests available for ${getFormattedMonthYear()}`);
            return;
        }
        navigate('/all-requests', { state: { month: selectedMonth, year: selectedYear, filterType: 'all' } });
    };

    const handlePendingActionsClick = () => {
        if (dashboardData.summary.pendingActions === 0) {
            showSnackbar("info", `No pending actions for ${getFormattedMonthYear()}`);
            return;
        }
        navigate('/pending-actions', { state: { month: selectedMonth, year: selectedYear, filterType: 'pending' } });
    };

    const handleResolvedClick = () => {
        if (dashboardData.summary.resolvedToday === 0) {
            showSnackbar("info", `No resolved requests for ${getFormattedMonthYear()}`);
            return;
        }
        navigate('/resolved-requests', { state: { month: selectedMonth, year: selectedYear, filterType: 'resolved' } });
    };

    const handleResponseRateClick = () => {
        showSnackbar("success", `Response rate for ${getFormattedMonthYear()}: ${dashboardData.summary.responseRate}%`);
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            if (isFutureMonth) {
                const mockData = generateMockDataForMonth();
                setDashboardData(mockData);
                setIsLoading(false);
                return;
            }
            const [
                chequeStats, queryStats, limitStats, stolenStats,
                chequeRecent, queryRecent, limitRecent, stolenRecent
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
            const cheque = chequeStats.status === 'fulfilled' ? chequeStats.value?.data?.data || {} : {};
            const queries = queryStats.status === 'fulfilled' ? queryStats.value?.data?.data || {} : {};
            const limits = limitStats.status === 'fulfilled' ? limitStats.value?.data?.data || {} : {};
            const stolen = stolenStats.status === 'fulfilled' ? stolenStats.value?.data?.data || {} : {};
            const chequeItems = chequeRecent.value || [];
            const queryItems = queryRecent.value || [];
            const limitItems = limitRecent.value || [];
            const stolenItems = stolenRecent.value || [];
            const filteredChequeItems = filterDataByDate(chequeItems, 'requestedDate');
            const filteredQueryItems = filterDataByDate(queryItems, 'queryRaisedDate');
            const filteredLimitItems = filterDataByDate(limitItems, 'requestDate');
            const filteredStolenItems = filterDataByDate(stolenItems, 'createdDate');
            const filteredChequeTotal = filteredChequeItems.length;
            const filteredQueryTotal = filteredQueryItems.length;
            const filteredLimitTotal = filteredLimitItems.length;
            const filteredStolenTotal = filteredStolenItems.length;
            const filteredChequePending = filteredChequeItems.filter(i => i.status?.toLowerCase() === 'pending').length;
            const filteredQueryPending = filteredQueryItems.filter(i => i.status?.toLowerCase() === 'pending').length;
            const filteredLimitPending = filteredLimitItems.filter(i => i.status?.toLowerCase() === 'pending').length;
            const filteredStolenPending = filteredStolenItems.filter(i => i.status?.toLowerCase() === 'pending').length;
            const filteredChequeApproved = filteredChequeItems.filter(i => i.status?.toLowerCase() === 'approved').length;
            const filteredQueryApproved = filteredQueryItems.filter(i => i.status?.toLowerCase() === 'approved').length;
            const filteredLimitApproved = filteredLimitItems.filter(i => i.status?.toLowerCase() === 'approved').length;
            const filteredStolenApproved = filteredStolenItems.filter(i => i.status?.toLowerCase() === 'approved').length;
            const filteredChequeRejected = filteredChequeItems.filter(i => i.status?.toLowerCase() === 'rejected').length;
            const filteredQueryRejected = filteredQueryItems.filter(i => i.status?.toLowerCase() === 'rejected').length;
            const filteredLimitRejected = filteredLimitItems.filter(i => i.status?.toLowerCase() === 'rejected').length;
            const filteredStolenRejected = filteredStolenItems.filter(i => i.status?.toLowerCase() === 'rejected').length;
            const totalRequests = filteredChequeTotal + filteredQueryTotal + filteredLimitTotal + filteredStolenTotal;
            const pendingActions = filteredChequePending + filteredQueryPending + filteredLimitPending + filteredStolenPending;
            const resolvedForMonth = calculateResolvedForMonth([...chequeItems, ...queryItems, ...limitItems, ...stolenItems]);
            const responseRate = totalRequests > 0 ? Math.round(((totalRequests - pendingActions) / totalRequests) * 100) : 0;
            const updatedModules = [
                { ...dashboardData.modules[0], total: filteredChequeTotal, pending: filteredChequePending, approved: filteredChequeApproved, rejected: filteredChequeRejected },
                { ...dashboardData.modules[1], total: filteredQueryTotal, pending: filteredQueryPending, approved: filteredQueryApproved, rejected: filteredQueryRejected },
                { ...dashboardData.modules[2], total: filteredLimitTotal, pending: filteredLimitPending, approved: filteredLimitApproved, rejected: filteredLimitRejected },
                { ...dashboardData.modules[3], total: filteredStolenTotal, pending: filteredStolenPending, approved: filteredStolenApproved, rejected: filteredStolenRejected }
            ];
            
            // FIXED: Generate weekly data using all items (not just filtered) but with improved date handling
            const weeklyTrend = totalRequests > 0
                ? generateWeeklyData([...chequeItems, ...queryItems, ...limitItems, ...stolenItems])
                : generateEmptyWeeklyData();
                
            const statusDistribution = generateStatusData(updatedModules);
            setDashboardData({
                summary: { totalRequests, pendingActions, resolvedToday: resolvedForMonth, responseRate },
                modules: updatedModules,
                weeklyTrend,
                statusDistribution
            });
            if (totalRequests === 0) showSnackbar("info", `No data available for ${getFormattedMonthYear()}`);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            showSnackbar("error", "Failed to load dashboard data");
            const mockData = generateMockDataForMonth();
            setDashboardData(mockData);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecentRequests = async (endpoint, page, size) => {
        try {
            const payload = { status: "", page, size };
            const response = await API.post(endpoint, payload);
            return response.data?.data?.content || [];
        } catch (error) {
            console.error(`Error fetching recent from ${endpoint}:`, error);
            return [];
        }
    };

    // FIXED: Improved generateWeeklyData function with better date field mapping
    const generateWeeklyData = (filteredItems) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dayMap = new Map();
        days.forEach(day => dayMap.set(day, { requests: 0, resolved: 0 }));
        
        // Filter items to only include those from the selected month
        const monthNum = getMonthNumber(selectedMonth);
        const year = parseInt(selectedYear);
        
        filteredItems.forEach(item => {
            // Try all possible date field names based on item type
            let dateStr = null;
            let date = null;
            
            // Check which type of item this is and get the appropriate date field
            if (item.requestedDate) {
                dateStr = item.requestedDate;  // chequeRequest
            } else if (item.queryRaisedDate) {
                dateStr = item.queryRaisedDate; // queriesResponse
            } else if (item.requestDate) {
                dateStr = item.requestDate;     // creditLimit
            } else if (item.createdDate) {
                dateStr = item.createdDate;     // lostCard
            } else if (item.updatedDate) {
                dateStr = item.updatedDate;     // fallback
            } else if (item.approvedDate) {
                dateStr = item.approvedDate;    // approved date
            } else if (item.queryApprovedDate) {
                dateStr = item.queryApprovedDate; // query approved date
            }
            
            if (dateStr) {
                date = new Date(dateStr);
                
                // Check if the date is valid and matches selected month/year
                if (!isNaN(date.getTime()) && 
                    date.getMonth() === monthNum && 
                    date.getFullYear() === year) {
                    
                    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                    // Convert to our format (Mon=0, Tue=1, ..., Sun=6)
                    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                    const dayName = days[adjustedIndex];
                    
                    if (dayName) {
                        const current = dayMap.get(dayName);
                        
                        // Check various status field names
                        const status = (item.status || item.queryStatus || item.approvalStatus || '').toLowerCase();
                        const isApproved = status === 'approved';
                        
                        dayMap.set(dayName, {
                            requests: current.requests + 1,
                            resolved: current.resolved + (isApproved ? 1 : 0)
                        });
                    }
                }
            }
        });
        
        return days.map(day => ({ 
            day, 
            requests: dayMap.get(day).requests, 
            resolved: dayMap.get(day).resolved 
        }));
    };

    const generateStatusData = (modules) => {
        const approved = modules.reduce((sum, m) => sum + (m.approved || 0), 0);
        const pending = modules.reduce((sum, m) => sum + (m.pending || 0), 0);
        const rejected = modules.reduce((sum, m) => sum + (m.rejected || 0), 0);
        const total = approved + pending + rejected;
        return [
            { name: 'Approved', value: approved, color: COLORS.approved, percentage: total > 0 ? Math.round((approved / total) * 100) : 0 },
            { name: 'Pending', value: pending, color: COLORS.pending, percentage: total > 0 ? Math.round((pending / total) * 100) : 0 },
            { name: 'Rejected', value: rejected, color: COLORS.rejected, percentage: total > 0 ? Math.round((rejected / total) * 100) : 0 }
        ].filter(item => item.value > 0);
    };

    const getFormattedMonthYear = () => {
        const monthNames = {
            'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
            'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
            'sep': 'September', 'oct': 'October', 'nov': 'November', 'dec': 'December'
        };
        return `${monthNames[selectedMonth]} ${selectedYear}`;
    };

    // ── Sub-components ────────────────────────────────────────────────────────

    const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
        <div
            style={S.statCard}
            onClick={onClick}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,53,128,0.14)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,53,128,0.07)';
            }}
        >
            {/* Left accent bar */}
            <div style={{ ...S.statAccentBar, background: color }} />
            <div style={S.statContent}>
                <div style={S.statLeft}>
                    <span style={S.statValue}>{value}</span>
                    <span style={S.statTitle}>{title}</span>
                    {subtitle && <span style={S.statSubtitle}>{subtitle}</span>}
                </div>
                <div style={S.statIcon(color)}>
                    <Icon size={22} color="#FFFFFF" />
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
            <div
                style={S.moduleCard}
                onClick={() => navigate(module.link)}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,53,128,0.14)';
                    e.currentTarget.style.borderColor = H.red;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,53,128,0.07)';
                    e.currentTarget.style.borderColor = H.g200;
                }}
            >
                {/* Top color bar per module */}
                <div style={{ ...S.moduleTopBar, background: module.color }} />

                <div style={S.moduleHeader}>
                    <div style={S.moduleIcon(module.color)}>
                        <Icon size={18} color="#FFFFFF" />
                    </div>
                    <span style={S.moduleTitle}>{module.name}</span>
                </div>

                <div style={S.moduleStats}>
                    <div style={S.moduleStat}>
                        <span style={S.moduleStatValue}>{module.total}</span>
                        <span style={S.moduleStatLabel}>Total</span>
                    </div>
                    <div style={S.moduleStat}>
                        <span style={{ ...S.moduleStatValue, color: COLORS.pending }}>{module.pending}</span>
                        <span style={S.moduleStatLabel}>Pending</span>
                    </div>
                </div>

                <div style={S.moduleProgress}>
                    <div style={S.progressTrack}>
                        <div style={S.progressFill(completionRate, module.color)} />
                    </div>
                    <span style={S.progressText}>{completionRate}% Complete</span>
                </div>

                <div style={S.moduleFooter}>
                    <span style={S.moduleFooterText}>
                        <FaCheckCircle color={COLORS.approved} size={10} /> {module.approved} Approved
                    </span>
                    <span style={S.moduleFooterText}>
                        <FaBan color={COLORS.rejected} size={10} /> {module.rejected} Rejected
                    </span>
                </div>
            </div>
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={S.tooltip}>
                    <p style={S.tooltipLabel}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: 13 }}>
                            {entry.name}: <strong>{entry.value}</strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const EmptyState = ({ type, message }) => (
        <div style={S.emptyState}>
            {type === 'chart' && <FaChartLine size={44} color={H.g200} />}
            {type === 'pie' && <FaChartPie size={44} color={H.g200} />}
            <p style={S.emptyStateText}>{message}</p>
            {isFutureMonth && <p style={S.emptyStateSubtext}>This is a preview. Data will appear when available.</p>}
        </div>
    );

    // ── Loading ───────────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div style={S.loadingContainer}>
                <div style={S.loader} />
                <p style={S.loadingText}>Loading dashboard for {getFormattedMonthYear()}...</p>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div style={S.container}>

            {/* ── Header ───────────────────────────────────────────────── */}
            <div style={S.header}>
                <div style={S.headerLeft}>
                    <div style={S.headerIcon}>
                        <FaChartLine size={22} color={H.white} />
                    </div>
                    <div>
                        <h1 style={S.title}>Dashboard</h1>
                        <p style={S.subtitle}>
                            Welcome back! Here's your request overview for {getFormattedMonthYear()}
                        </p>
                    </div>
                </div>

                <div style={S.headerRight}>
                    <div style={S.dropdownGroup}>
                        <select style={S.selectDropdown} value={selectedMonth} onChange={handleMonthChange}>
                            {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map((m, i) => (
                                <option key={m} value={m}>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i]}
                                </option>
                            ))}
                        </select>
                        <select style={S.selectDropdown} value={selectedYear} onChange={handleYearChange}>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                    <button style={S.refreshBtn} onClick={fetchDashboardData}
                        onMouseEnter={e => e.currentTarget.style.background = H.redDark}
                        onMouseLeave={e => e.currentTarget.style.background = H.red}
                    >
                        <FaSync size={13} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* ── Future Month Banner ───────────────────────────────────── */}
            {isFutureMonth && (
                <div style={S.futureBanner}>
                    <FaInfoCircle size={15} color={H.navy} />
                    <span>You're viewing a preview for {getFormattedMonthYear()}. Actual data will appear when available.</span>
                </div>
            )}

            {/* ── Stat Cards ───────────────────────────────────────────── */}
            <div style={S.statsGrid}>
                <StatCard title="Total Requests" value={dashboardData.summary.totalRequests} icon={FaFileAlt} color={H.navy} subtitle={getFormattedMonthYear()} onClick={handleTotalRequestsClick} />
                <StatCard title="Pending Actions" value={dashboardData.summary.pendingActions} icon={FaHourglassHalf} color="#F97316" subtitle={`Need attention in ${getFormattedMonthYear()}`} onClick={handlePendingActionsClick} />
                <StatCard title="Resolved" value={dashboardData.summary.resolvedToday} icon={FaCheckDouble} color="#10B981" subtitle={`Resolved in ${getFormattedMonthYear()}`} onClick={handleResolvedClick} />
                <StatCard title="Response Rate" value={`${dashboardData.summary.responseRate}%`} icon={FaChartLine} color={H.red} subtitle={`For ${getFormattedMonthYear()}`} onClick={handleResponseRateClick} />
            </div>

            {/* ── Charts Row ───────────────────────────────────────────── */}
            <div style={S.chartsRow}>
                {/* Weekly Trend */}
                <div style={S.chartCard}>
                    <h3 style={S.chartTitle}>
                        <FaChartLine style={{ color: H.red }} />
                        Weekly Request Trend — {getFormattedMonthYear()}
                    </h3>
                    {dashboardData.summary.totalRequests > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={dashboardData.weeklyTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke={H.g200} />
                                <XAxis dataKey="day" stroke={H.g600} tick={{ fontSize: 12 }} />
                                <YAxis stroke={H.g600} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area type="monotone" dataKey="requests" stroke={H.navy} fill={`${H.navy}18`} name="Requests" strokeWidth={2} />
                                <Area type="monotone" dataKey="resolved" stroke={H.red} fill={`${H.red}15`} name="Resolved" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState type="chart" message={`No request data available for ${getFormattedMonthYear()}`} />
                    )}
                </div>

                {/* Status Distribution */}
                <div style={S.chartCard}>
                    <h3 style={S.chartTitle}>
                        <FaChartPie style={{ color: H.red }} />
                        Status Distribution — {getFormattedMonthYear()}
                    </h3>
                    {dashboardData.statusDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={dashboardData.statusDistribution}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={90}
                                    paddingAngle={5} dataKey="value"
                                    label={({ name, percentage }) => `${name} ${percentage}%`}
                                >
                                    {dashboardData.statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState type="pie" message={`No status data available for ${getFormattedMonthYear()}`} />
                    )}
                </div>
            </div>

            {/* ── Modules Grid ─────────────────────────────────────────── */}
            <h3 style={S.sectionTitle}>
                <FaCog style={{ color: H.red }} />
                Request Modules — {getFormattedMonthYear()}
            </h3>
            <div style={S.modulesGrid}>
                {dashboardData.modules.map((module, index) => (
                    <ModuleCard key={index} module={module} />
                ))}
            </div>
        </div>
    );
};

// ─── Style System ─────────────────────────────────────────────────────────────
const FONT = "'Open Sans', 'Segoe UI', Arial, sans-serif";

const S = {
    container: {
        padding: "28px 32px",
        background: H.offWhite,
        minHeight: "100vh",
        fontFamily: FONT,
    },

    /* Header */
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
        flexWrap: "wrap",
        gap: "16px",
        padding: "20px 24px",
        background: H.white,
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,53,128,0.07)",
        border: `1px solid ${H.g200}`,
        borderTop: `4px solid ${H.red}`,   // HDFC signature red top bar
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    headerIcon: {
        width: "50px",
        height: "50px",
        borderRadius: "10px",
        background: `linear-gradient(135deg, ${H.navy}, ${H.navyDark})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 4px 14px rgba(0,53,128,0.3)`,
        flexShrink: 0,
    },
    title: {
        fontSize: "24px",
        fontWeight: "800",
        margin: 0,
        color: H.navy,
        letterSpacing: "-0.3px",
    },
    subtitle: {
        fontSize: "13px",
        margin: "4px 0 0",
        color: H.g600,
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
    },
    dropdownGroup: {
        display: "flex",
        gap: "10px",
    },
    selectDropdown: {
        padding: "9px 32px 9px 14px",
        background: H.white,
        border: `1.5px solid ${H.g200}`,
        borderRadius: "8px",
        color: H.navy,
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        outline: "none",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23003580' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        backgroundSize: "14px",
        minWidth: "118px",
        fontFamily: FONT,
    },
    refreshBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "9px 18px",
        background: H.red,
        border: "none",
        borderRadius: "8px",
        color: H.white,
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "background 0.2s ease",
        boxShadow: `0 4px 12px rgba(227,24,55,0.3)`,
        fontFamily: FONT,
        letterSpacing: "0.2px",
    },

    /* Future banner */
    futureBanner: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        background: H.navyLight,
        border: `1px solid ${H.g200}`,
        borderLeft: `4px solid ${H.navy}`,
        borderRadius: "8px",
        marginBottom: "20px",
        color: H.navy,
        fontSize: "13.5px",
        fontWeight: "500",
    },

    /* Stats */
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
        gap: "18px",
        marginBottom: "24px",
    },
    statCard: {
        background: H.white,
        borderRadius: "10px",
        padding: "0",
        boxShadow: "0 4px 12px rgba(0,53,128,0.07)",
        border: `1px solid ${H.g200}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
    },
    statAccentBar: {
        height: "4px",
        width: "100%",
    },
    statContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 20px",
    },
    statLeft: {
        display: "flex",
        flexDirection: "column",
    },
    statValue: {
        fontSize: "30px",
        fontWeight: "800",
        color: H.navy,
        lineHeight: 1.2,
    },
    statTitle: {
        fontSize: "13px",
        color: H.g600,
        marginTop: "4px",
        fontWeight: "600",
    },
    statSubtitle: {
        fontSize: "11px",
        color: H.g400,
        marginTop: "2px",
    },
    statIcon: (color) => ({
        width: "50px",
        height: "50px",
        borderRadius: "10px",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        flexShrink: 0,
    }),

    /* Charts */
    chartsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
        gap: "18px",
        marginBottom: "24px",
    },
    chartCard: {
        background: H.white,
        borderRadius: "10px",
        padding: "20px 24px",
        boxShadow: "0 4px 12px rgba(0,53,128,0.07)",
        border: `1px solid ${H.g200}`,
    },
    chartTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "15px",
        fontWeight: "700",
        color: H.navy,
        marginBottom: "18px",
        margin: "0 0 18px 0",
    },

    /* Section heading */
    sectionTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "17px",
        fontWeight: "700",
        color: H.navy,
        margin: "0 0 18px 0",
    },

    /* Modules */
    modulesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "18px",
        marginBottom: "0",
    },
    moduleCard: {
        background: H.white,
        borderRadius: "10px",
        padding: "0",
        boxShadow: "0 4px 12px rgba(0,53,128,0.07)",
        border: `1px solid ${H.g200}`,
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        overflow: "hidden",
    },
    moduleTopBar: {
        height: "4px",
        width: "100%",
    },
    moduleHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 18px 12px",
    },
    moduleIcon: (color) => ({
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    }),
    moduleTitle: {
        fontSize: "15px",
        fontWeight: "700",
        color: H.navy,
    },
    moduleStats: {
        display: "flex",
        justifyContent: "space-around",
        padding: "0 18px 14px",
        borderBottom: `1px solid ${H.g100}`,
    },
    moduleStat: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    moduleStatValue: {
        fontSize: "26px",
        fontWeight: "800",
        color: H.navy,
    },
    moduleStatLabel: {
        fontSize: "11px",
        color: H.g500,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginTop: "2px",
    },
    moduleProgress: {
        padding: "12px 18px 8px",
    },
    progressTrack: {
        height: "5px",
        background: H.g100,
        borderRadius: "3px",
        overflow: "hidden",
        marginBottom: "6px",
    },
    progressFill: (width, color) => ({
        height: "100%",
        width: `${width}%`,
        background: color || H.navy,
        borderRadius: "3px",
        transition: "width 0.4s ease",
    }),
    progressText: {
        fontSize: "11px",
        color: H.g500,
        fontWeight: "600",
    },
    moduleFooter: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 18px 16px",
    },
    moduleFooterText: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        color: H.g600,
        fontSize: "12px",
        fontWeight: "600",
    },

    /* Tooltip */
    tooltip: {
        background: H.white,
        padding: "10px 14px",
        borderRadius: "8px",
        boxShadow: "0 4px 16px rgba(0,53,128,0.12)",
        border: `1px solid ${H.g200}`,
        borderTop: `3px solid ${H.red}`,
    },
    tooltipLabel: {
        fontSize: "12px",
        fontWeight: "700",
        color: H.navy,
        margin: "0 0 6px 0",
        paddingBottom: "6px",
        borderBottom: `1px solid ${H.g100}`,
    },

    /* Empty */
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
    },
    emptyStateText: { color: H.g500, fontSize: "14px", margin: "14px 0 4px" },
    emptyStateSubtext: { color: H.g400, fontSize: "12px", margin: 0 },

    /* Loading */
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        background: H.offWhite,
    },
    loader: {
        width: "48px",
        height: "48px",
        border: `5px solid ${H.g200}`,
        borderTop: `5px solid ${H.red}`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "18px",
    },
    loadingText: {
        fontSize: "15px",
        color: H.g600,
        fontWeight: "600",
    },
};

// Global keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

export default Dashboard;



// import React, { useState, useEffect } from "react";
// import API from "../../api";
// import { useSnackbar } from "../../Context/SnackbarContext";
// import {
//     FaMoneyCheck,
//     FaQuestionCircle,
//     FaArrowUp,
//     FaExclamationTriangle,
//     FaChartLine,
//     FaChartPie,
//     FaChartBar,
//     FaClock,
//     FaCheckCircle,
//     FaBan,
//     FaEye,
//     FaCalendarAlt,
//     FaUser,
//     FaSync,
//     FaDownload,
//     FaBell,
//     FaUsers,
//     FaFileAlt,
//     FaCheckDouble,
//     FaHourglassHalf,
//     FaArrowRight,
//     FaCog,
//     FaInfoCircle,
//     FaBook,
//     FaCreditCard,
//     FaShieldAlt,
//     FaUserCircle
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {
//     LineChart,
//     Line,
//     BarChart,
//     Bar,
//     PieChart,
//     Pie,
//     Cell,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     AreaChart,
//     Area
// } from 'recharts';

// // ─── HDFC Design Tokens (matches login page exactly) ─────────────────────────
// const H = {
//     navy: "#003580",
//     navyDark: "#002D6E",
//     navyDeep: "#001E4E",
//     navyLight: "#E8EEF8",
//     navyMid: "#1A4FA0",
//     red: "#E31837",
//     redDark: "#C0122D",
//     redLight: "#FDEAED",
//     white: "#FFFFFF",
//     offWhite: "#F4F6FA",
//     g100: "#EEF1F7",
//     g200: "#DDE3EF",
//     g400: "#B0B8CC",
//     g500: "#8C9BB5",
//     g600: "#6B778C",
//     g800: "#2C3347",
//     text: "#1A1F36",
// };

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const { showSnackbar } = useSnackbar();
//     const [isLoading, setIsLoading] = useState(true);
//     const [selectedMonth, setSelectedMonth] = useState("feb");
//     const [selectedYear, setSelectedYear] = useState("2026");
//     const [timeRange, setTimeRange] = useState("feb-2026");
//     const [isFutureMonth, setIsFutureMonth] = useState(false);
//     const [dashboardData, setDashboardData] = useState({
//         summary: {
//             totalRequests: 0,
//             pendingActions: 0,
//             resolvedToday: 0,
//             responseRate: 0
//         },
//         modules: [
//             {
//                 name: "Cheque Leaves",
//                 total: 0,
//                 pending: 0,
//                 approved: 0,
//                 rejected: 0,
//                 icon: FaBook,
//                 color: H.navy,
//                 link: "/cheque-book",
//                 endpoint: "chequeRequest"
//             },
//             {
//                 name: "Customer Queries",
//                 total: 0,
//                 pending: 0,
//                 approved: 0,
//                 rejected: 0,
//                 icon: FaQuestionCircle,
//                 color: H.red,
//                 link: "/customer-queries",
//                 endpoint: "queriesResponse"
//             },
//             {
//                 name: "Limit Requests",
//                 total: 0,
//                 pending: 0,
//                 approved: 0,
//                 rejected: 0,
//                 icon: FaArrowUp,
//                 color: "#10B981",
//                 link: "/increase-limit",
//                 endpoint: "creditLimit"
//             },
//             {
//                 name: "Stolen Cards",
//                 total: 0,
//                 pending: 0,
//                 approved: 0,
//                 rejected: 0,
//                 icon: FaShieldAlt,
//                 color: "#F97316",
//                 link: "/stolen-card",
//                 endpoint: "lostCard"
//             }
//         ],
//         weeklyTrend: [],
//         statusDistribution: []
//     });

//     const COLORS = {
//         approved: "#10B981",
//         pending: "#F97316",
//         rejected: "#E31837",
//         primary: H.navy,
//         secondary: H.red,
//         success: "#10B981",
//         info: H.navyMid,
//         warning: "#F59E0B",
//         green: "#10B981"
//     };

//     // ── All original logic — 100% untouched ────────────────────────────────

//     useEffect(() => {
//         checkIfFutureDate();
//         fetchDashboardData();
//     }, [timeRange]);

//     const checkIfFutureDate = () => {
//         const currentDate = new Date();
//         const currentYear = currentDate.getFullYear();
//         const currentMonth = currentDate.getMonth();
//         const selectedMonthNum = getMonthNumber(selectedMonth);
//         const selectedYearNum = parseInt(selectedYear);
//         const isFuture = (selectedYearNum > currentYear) ||
//             (selectedYearNum === currentYear && selectedMonthNum > currentMonth);
//         setIsFutureMonth(isFuture);
//         if (isFuture) {
//             showSnackbar("info", `Showing preview for ${getFormattedMonthYear()} (no actual data available yet)`);
//         }
//     };

//     const handleMonthChange = (e) => {
//         const month = e.target.value;
//         setSelectedMonth(month);
//         setTimeRange(`${month}-${selectedYear}`);
//     };

//     const handleYearChange = (e) => {
//         const year = e.target.value;
//         setSelectedYear(year);
//         setTimeRange(`${selectedMonth}-${year}`);
//     };

//     const getMonthNumber = (monthAbbr) => {
//         const months = {
//             'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
//             'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
//         };
//         return months[monthAbbr];
//     };

//     const getMonthName = (monthNumber) => {
//         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December'];
//         return monthNames[monthNumber];
//     };

//     const filterDataByDate = (items, dateField) => {
//         if (!items || !Array.isArray(items)) return [];
//         const monthNum = getMonthNumber(selectedMonth);
//         const year = parseInt(selectedYear);
//         return items.filter(item => {
//             const dateStr = item[dateField];
//             if (!dateStr) return false;
//             const date = new Date(dateStr);
//             return date.getMonth() === monthNum && date.getFullYear() === year;
//         });
//     };

//     const calculateResolvedForMonth = (items) => {
//         if (!items || !Array.isArray(items)) return 0;
//         const monthNum = getMonthNumber(selectedMonth);
//         const year = parseInt(selectedYear);
//         return items.filter(item => {
//             const dateStr = item.approvedDate || item.queryApprovedDate || item.updatedDate;
//             if (!dateStr) return false;
//             const date = new Date(dateStr);
//             return date.getMonth() === monthNum && date.getFullYear() === year;
//         }).length;
//     };

//     const generateMockDataForMonth = () => {
//         const monthNum = getMonthNumber(selectedMonth);
//         const year = parseInt(selectedYear);
//         const seed = (monthNum + 1) * (year - 2020);
//         Math.seed = seed;
//         const mockRandom = () => {
//             const x = Math.sin(seed++) * 10000;
//             return x - Math.floor(x);
//         };
//         const baseTotal = Math.floor(mockRandom() * 40) + 30;
//         const pendingPercent = mockRandom() * 0.3 + 0.2;
//         const approvedPercent = mockRandom() * 0.3 + 0.4;
//         const rejectedPercent = 1 - pendingPercent - approvedPercent;
//         const mockModules = [
//             { ...dashboardData.modules[0], total: Math.floor(mockRandom() * 15) + 5, pending: 0, approved: 0, rejected: 0 },
//             { ...dashboardData.modules[1], total: Math.floor(mockRandom() * 20) + 10, pending: 0, approved: 0, rejected: 0 },
//             { ...dashboardData.modules[2], total: Math.floor(mockRandom() * 10) + 3, pending: 0, approved: 0, rejected: 0 },
//             { ...dashboardData.modules[3], total: Math.floor(mockRandom() * 8) + 2, pending: 0, approved: 0, rejected: 0 }
//         ];
//         const totalRequests = mockModules.reduce((sum, m) => sum + m.total, 0);
//         const pendingActions = Math.floor(totalRequests * pendingPercent);
//         const resolvedToday = Math.floor(totalRequests * approvedPercent);
//         const responseRate = totalRequests > 0 ? Math.round((resolvedToday / totalRequests) * 100) : 0;
//         mockModules.forEach(module => {
//             const moduleTotal = module.total;
//             module.pending = Math.floor(moduleTotal * pendingPercent);
//             module.approved = Math.floor(moduleTotal * approvedPercent);
//             module.rejected = moduleTotal - module.pending - module.approved;
//         });
//         return {
//             summary: { totalRequests, pendingActions, resolvedToday, responseRate },
//             modules: mockModules,
//             weeklyTrend: generateMockWeeklyData(totalRequests, resolvedToday),
//             statusDistribution: [
//                 { name: 'Approved', value: resolvedToday, color: COLORS.approved, percentage: responseRate },
//                 { name: 'Pending', value: pendingActions, color: COLORS.pending, percentage: Math.round(pendingActions / totalRequests * 100) },
//                 { name: 'Rejected', value: totalRequests - resolvedToday - pendingActions, color: COLORS.rejected, percentage: Math.round((totalRequests - resolvedToday - pendingActions) / totalRequests * 100) }
//             ].filter(item => item.value > 0)
//         };
//     };

//     const generateMockWeeklyData = (totalRequests, totalResolved) => {
//         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//         const requestsPerDay = Math.floor(totalRequests / 7);
//         const resolvedPerDay = Math.floor(totalResolved / 7);
//         return days.map((day, index) => ({
//             day,
//             requests: index < totalRequests % 7 ? requestsPerDay + 1 : requestsPerDay,
//             resolved: index < totalResolved % 7 ? resolvedPerDay + 1 : resolvedPerDay
//         }));
//     };

//     const generateEmptyWeeklyData = () => {
//         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//         return days.map(day => ({ day, requests: 0, resolved: 0 }));
//     };

//     const handleTotalRequestsClick = () => {
//         if (dashboardData.summary.totalRequests === 0) {
//             showSnackbar("info", `No requests available for ${getFormattedMonthYear()}`);
//             return;
//         }
//         navigate('/all-requests', { state: { month: selectedMonth, year: selectedYear, filterType: 'all' } });
//     };

//     const handlePendingActionsClick = () => {
//         if (dashboardData.summary.pendingActions === 0) {
//             showSnackbar("info", `No pending actions for ${getFormattedMonthYear()}`);
//             return;
//         }
//         navigate('/pending-actions', { state: { month: selectedMonth, year: selectedYear, filterType: 'pending' } });
//     };

//     const handleResolvedClick = () => {
//         if (dashboardData.summary.resolvedToday === 0) {
//             showSnackbar("info", `No resolved requests for ${getFormattedMonthYear()}`);
//             return;
//         }
//         navigate('/resolved-requests', { state: { month: selectedMonth, year: selectedYear, filterType: 'resolved' } });
//     };

//     const handleResponseRateClick = () => {
//         showSnackbar("success", `Response rate for ${getFormattedMonthYear()}: ${dashboardData.summary.responseRate}%`);
//     };

//     const fetchDashboardData = async () => {
//         setIsLoading(true);
//         try {
//             if (isFutureMonth) {
//                 const mockData = generateMockDataForMonth();
//                 setDashboardData(mockData);
//                 setIsLoading(false);
//                 return;
//             }
//             const [
//                 chequeStats, queryStats, limitStats, stolenStats,
//                 chequeRecent, queryRecent, limitRecent, stolenRecent
//             ] = await Promise.allSettled([
//                 API.get("chequeRequest/counts"),
//                 API.get("queriesResponse/count"),
//                 API.get("creditLimit/counts"),
//                 API.get("lostCard/counts"),
//                 fetchRecentRequests("chequeRequest/adminChequeList", 0, 50),
//                 fetchRecentRequests("queriesResponse/adminQueriesList", 0, 50),
//                 fetchRecentRequests("creditLimit/adminCreditLimitList", 0, 50),
//                 fetchRecentRequests("lostCard/adminLastCardList", 0, 50)
//             ]);
//             const cheque = chequeStats.status === 'fulfilled' ? chequeStats.value?.data?.data || {} : {};
//             const queries = queryStats.status === 'fulfilled' ? queryStats.value?.data?.data || {} : {};
//             const limits = limitStats.status === 'fulfilled' ? limitStats.value?.data?.data || {} : {};
//             const stolen = stolenStats.status === 'fulfilled' ? stolenStats.value?.data?.data || {} : {};
//             const chequeItems = chequeRecent.value || [];
//             const queryItems = queryRecent.value || [];
//             const limitItems = limitRecent.value || [];
//             const stolenItems = stolenRecent.value || [];
//             const filteredChequeItems = filterDataByDate(chequeItems, 'requestedDate');
//             const filteredQueryItems = filterDataByDate(queryItems, 'queryRaisedDate');
//             const filteredLimitItems = filterDataByDate(limitItems, 'requestDate');
//             const filteredStolenItems = filterDataByDate(stolenItems, 'createdDate');
//             const filteredChequeTotal = filteredChequeItems.length;
//             const filteredQueryTotal = filteredQueryItems.length;
//             const filteredLimitTotal = filteredLimitItems.length;
//             const filteredStolenTotal = filteredStolenItems.length;
//             const filteredChequePending = filteredChequeItems.filter(i => i.status?.toLowerCase() === 'pending').length;
//             const filteredQueryPending = filteredQueryItems.filter(i => i.status?.toLowerCase() === 'pending').length;
//             const filteredLimitPending = filteredLimitItems.filter(i => i.status?.toLowerCase() === 'pending').length;
//             const filteredStolenPending = filteredStolenItems.filter(i => i.status?.toLowerCase() === 'pending').length;
//             const filteredChequeApproved = filteredChequeItems.filter(i => i.status?.toLowerCase() === 'approved').length;
//             const filteredQueryApproved = filteredQueryItems.filter(i => i.status?.toLowerCase() === 'approved').length;
//             const filteredLimitApproved = filteredLimitItems.filter(i => i.status?.toLowerCase() === 'approved').length;
//             const filteredStolenApproved = filteredStolenItems.filter(i => i.status?.toLowerCase() === 'approved').length;
//             const filteredChequeRejected = filteredChequeItems.filter(i => i.status?.toLowerCase() === 'rejected').length;
//             const filteredQueryRejected = filteredQueryItems.filter(i => i.status?.toLowerCase() === 'rejected').length;
//             const filteredLimitRejected = filteredLimitItems.filter(i => i.status?.toLowerCase() === 'rejected').length;
//             const filteredStolenRejected = filteredStolenItems.filter(i => i.status?.toLowerCase() === 'rejected').length;
//             const totalRequests = filteredChequeTotal + filteredQueryTotal + filteredLimitTotal + filteredStolenTotal;
//             const pendingActions = filteredChequePending + filteredQueryPending + filteredLimitPending + filteredStolenPending;
//             const resolvedForMonth = calculateResolvedForMonth([...chequeItems, ...queryItems, ...limitItems, ...stolenItems]);
//             const responseRate = totalRequests > 0 ? Math.round(((totalRequests - pendingActions) / totalRequests) * 100) : 0;
//             const updatedModules = [
//                 { ...dashboardData.modules[0], total: filteredChequeTotal, pending: filteredChequePending, approved: filteredChequeApproved, rejected: filteredChequeRejected },
//                 { ...dashboardData.modules[1], total: filteredQueryTotal, pending: filteredQueryPending, approved: filteredQueryApproved, rejected: filteredQueryRejected },
//                 { ...dashboardData.modules[2], total: filteredLimitTotal, pending: filteredLimitPending, approved: filteredLimitApproved, rejected: filteredLimitRejected },
//                 { ...dashboardData.modules[3], total: filteredStolenTotal, pending: filteredStolenPending, approved: filteredStolenApproved, rejected: filteredStolenRejected }
//             ];
//             const weeklyTrend = totalRequests > 0
//                 ? generateWeeklyData([...filteredChequeItems, ...filteredQueryItems, ...filteredLimitItems, ...filteredStolenItems])
//                 : generateEmptyWeeklyData();
//             const statusDistribution = generateStatusData(updatedModules);
//             setDashboardData({
//                 summary: { totalRequests, pendingActions, resolvedToday: resolvedForMonth, responseRate },
//                 modules: updatedModules,
//                 weeklyTrend,
//                 statusDistribution
//             });
//             if (totalRequests === 0) showSnackbar("info", `No data available for ${getFormattedMonthYear()}`);
//         } catch (error) {
//             console.error("Error fetching dashboard data:", error);
//             showSnackbar("error", "Failed to load dashboard data");
//             const mockData = generateMockDataForMonth();
//             setDashboardData(mockData);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const fetchRecentRequests = async (endpoint, page, size) => {
//         try {
//             const payload = { status: "", page, size };
//             const response = await API.post(endpoint, payload);
//             return response.data?.data?.content || [];
//         } catch (error) {
//             console.error(`Error fetching recent from ${endpoint}:`, error);
//             return [];
//         }
//     };

//     const generateWeeklyData = (filteredItems) => {
//         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//         const dayMap = new Map();
//         days.forEach(day => dayMap.set(day, { requests: 0, resolved: 0 }));
//         filteredItems.forEach(item => {
//             const dateStr = item.requestedDate || item.queryRaisedDate || item.requestDate || item.createdDate;
//             if (dateStr) {
//                 const date = new Date(dateStr);
//                 const dayIndex = date.getDay();
//                 const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
//                 const dayName = days[adjustedIndex];
//                 if (dayName) {
//                     const current = dayMap.get(dayName);
//                     dayMap.set(dayName, {
//                         requests: current.requests + 1,
//                         resolved: current.resolved + (item.status?.toLowerCase() === 'approved' ? 1 : 0)
//                     });
//                 }
//             }
//         });
//         return days.map(day => ({ day, requests: dayMap.get(day).requests, resolved: dayMap.get(day).resolved }));
//     };

//     const generateStatusData = (modules) => {
//         const approved = modules.reduce((sum, m) => sum + (m.approved || 0), 0);
//         const pending = modules.reduce((sum, m) => sum + (m.pending || 0), 0);
//         const rejected = modules.reduce((sum, m) => sum + (m.rejected || 0), 0);
//         const total = approved + pending + rejected;
//         return [
//             { name: 'Approved', value: approved, color: COLORS.approved, percentage: total > 0 ? Math.round((approved / total) * 100) : 0 },
//             { name: 'Pending', value: pending, color: COLORS.pending, percentage: total > 0 ? Math.round((pending / total) * 100) : 0 },
//             { name: 'Rejected', value: rejected, color: COLORS.rejected, percentage: total > 0 ? Math.round((rejected / total) * 100) : 0 }
//         ].filter(item => item.value > 0);
//     };

//     const getFormattedMonthYear = () => {
//         const monthNames = {
//             'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
//             'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
//             'sep': 'September', 'oct': 'October', 'nov': 'November', 'dec': 'December'
//         };
//         return `${monthNames[selectedMonth]} ${selectedYear}`;
//     };

//     // ── Sub-components ────────────────────────────────────────────────────────

//     const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
//         <div
//             style={S.statCard}
//             onClick={onClick}
//             onMouseEnter={e => {
//                 e.currentTarget.style.transform = 'translateY(-4px)';
//                 e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,53,128,0.14)';
//             }}
//             onMouseLeave={e => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,53,128,0.07)';
//             }}
//         >
//             {/* Left accent bar */}
//             <div style={{ ...S.statAccentBar, background: color }} />
//             <div style={S.statContent}>
//                 <div style={S.statLeft}>
//                     <span style={S.statValue}>{value}</span>
//                     <span style={S.statTitle}>{title}</span>
//                     {subtitle && <span style={S.statSubtitle}>{subtitle}</span>}
//                 </div>
//                 <div style={S.statIcon(color)}>
//                     <Icon size={22} color="#FFFFFF" />
//                 </div>
//             </div>
//         </div>
//     );

//     const ModuleCard = ({ module }) => {
//         const Icon = module.icon;
//         const completionRate = module.total > 0
//             ? Math.round(((module.approved + module.rejected) / module.total) * 100)
//             : 0;

//         return (
//             <div
//                 style={S.moduleCard}
//                 onClick={() => navigate(module.link)}
//                 onMouseEnter={e => {
//                     e.currentTarget.style.transform = 'translateY(-4px)';
//                     e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,53,128,0.14)';
//                     e.currentTarget.style.borderColor = H.red;
//                 }}
//                 onMouseLeave={e => {
//                     e.currentTarget.style.transform = 'translateY(0)';
//                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,53,128,0.07)';
//                     e.currentTarget.style.borderColor = H.g200;
//                 }}
//             >
//                 {/* Top color bar per module */}
//                 <div style={{ ...S.moduleTopBar, background: module.color }} />

//                 <div style={S.moduleHeader}>
//                     <div style={S.moduleIcon(module.color)}>
//                         <Icon size={18} color="#FFFFFF" />
//                     </div>
//                     <span style={S.moduleTitle}>{module.name}</span>
//                 </div>

//                 <div style={S.moduleStats}>
//                     <div style={S.moduleStat}>
//                         <span style={S.moduleStatValue}>{module.total}</span>
//                         <span style={S.moduleStatLabel}>Total</span>
//                     </div>
//                     <div style={S.moduleStat}>
//                         <span style={{ ...S.moduleStatValue, color: COLORS.pending }}>{module.pending}</span>
//                         <span style={S.moduleStatLabel}>Pending</span>
//                     </div>
//                 </div>

//                 <div style={S.moduleProgress}>
//                     <div style={S.progressTrack}>
//                         <div style={S.progressFill(completionRate, module.color)} />
//                     </div>
//                     <span style={S.progressText}>{completionRate}% Complete</span>
//                 </div>

//                 <div style={S.moduleFooter}>
//                     <span style={S.moduleFooterText}>
//                         <FaCheckCircle color={COLORS.approved} size={10} /> {module.approved} Approved
//                     </span>
//                     <span style={S.moduleFooterText}>
//                         <FaBan color={COLORS.rejected} size={10} /> {module.rejected} Rejected
//                     </span>
//                 </div>
//             </div>
//         );
//     };

//     const CustomTooltip = ({ active, payload, label }) => {
//         if (active && payload && payload.length) {
//             return (
//                 <div style={S.tooltip}>
//                     <p style={S.tooltipLabel}>{label}</p>
//                     {payload.map((entry, index) => (
//                         <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: 13 }}>
//                             {entry.name}: <strong>{entry.value}</strong>
//                         </p>
//                     ))}
//                 </div>
//             );
//         }
//         return null;
//     };

//     const EmptyState = ({ type, message }) => (
//         <div style={S.emptyState}>
//             {type === 'chart' && <FaChartLine size={44} color={H.g200} />}
//             {type === 'pie' && <FaChartPie size={44} color={H.g200} />}
//             <p style={S.emptyStateText}>{message}</p>
//             {isFutureMonth && <p style={S.emptyStateSubtext}>This is a preview. Data will appear when available.</p>}
//         </div>
//     );

//     // ── Loading ───────────────────────────────────────────────────────────────

//     if (isLoading) {
//         return (
//             <div style={S.loadingContainer}>
//                 <div style={S.loader} />
//                 <p style={S.loadingText}>Loading dashboard for {getFormattedMonthYear()}...</p>
//             </div>
//         );
//     }

//     // ── Render ────────────────────────────────────────────────────────────────

//     return (
//         <div style={S.container}>

//             {/* ── Header ───────────────────────────────────────────────── */}
//             <div style={S.header}>
//                 <div style={S.headerLeft}>
//                     <div style={S.headerIcon}>
//                         <FaChartLine size={22} color={H.white} />
//                     </div>
//                     <div>
//                         <h1 style={S.title}>Dashboard</h1>
//                         <p style={S.subtitle}>
//                             Welcome back! Here's your request overview for {getFormattedMonthYear()}
//                         </p>
//                     </div>
//                 </div>

//                 <div style={S.headerRight}>
//                     <div style={S.dropdownGroup}>
//                         <select style={S.selectDropdown} value={selectedMonth} onChange={handleMonthChange}>
//                             {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map((m, i) => (
//                                 <option key={m} value={m}>
//                                     {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i]}
//                                 </option>
//                             ))}
//                         </select>
//                         <select style={S.selectDropdown} value={selectedYear} onChange={handleYearChange}>
//                             <option value="2024">2024</option>
//                             <option value="2025">2025</option>
//                             <option value="2026">2026</option>
//                         </select>
//                     </div>
//                     <button style={S.refreshBtn} onClick={fetchDashboardData}
//                         onMouseEnter={e => e.currentTarget.style.background = H.redDark}
//                         onMouseLeave={e => e.currentTarget.style.background = H.red}
//                     >
//                         <FaSync size={13} />
//                         Refresh
//                     </button>
//                 </div>
//             </div>

//             {/* ── Future Month Banner ───────────────────────────────────── */}
//             {isFutureMonth && (
//                 <div style={S.futureBanner}>
//                     <FaInfoCircle size={15} color={H.navy} />
//                     <span>You're viewing a preview for {getFormattedMonthYear()}. Actual data will appear when available.</span>
//                 </div>
//             )}

//             {/* ── Stat Cards ───────────────────────────────────────────── */}
//             <div style={S.statsGrid}>
//                 <StatCard title="Total Requests" value={dashboardData.summary.totalRequests} icon={FaFileAlt} color={H.navy} subtitle={getFormattedMonthYear()} onClick={handleTotalRequestsClick} />
//                 <StatCard title="Pending Actions" value={dashboardData.summary.pendingActions} icon={FaHourglassHalf} color="#F97316" subtitle={`Need attention in ${getFormattedMonthYear()}`} onClick={handlePendingActionsClick} />
//                 <StatCard title="Resolved" value={dashboardData.summary.resolvedToday} icon={FaCheckDouble} color="#10B981" subtitle={`Resolved in ${getFormattedMonthYear()}`} onClick={handleResolvedClick} />
//                 <StatCard title="Response Rate" value={`${dashboardData.summary.responseRate}%`} icon={FaChartLine} color={H.red} subtitle={`For ${getFormattedMonthYear()}`} onClick={handleResponseRateClick} />
//             </div>

//             {/* ── Charts Row ───────────────────────────────────────────── */}
//             <div style={S.chartsRow}>
//                 {/* Weekly Trend */}
//                 <div style={S.chartCard}>
//                     <h3 style={S.chartTitle}>
//                         <FaChartLine style={{ color: H.red }} />
//                         Weekly Request Trend — {getFormattedMonthYear()}
//                     </h3>
//                     {dashboardData.summary.totalRequests > 0 ? (
//                         <ResponsiveContainer width="100%" height={250}>
//                             <AreaChart data={dashboardData.weeklyTrend}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke={H.g200} />
//                                 <XAxis dataKey="day" stroke={H.g600} tick={{ fontSize: 12 }} />
//                                 <YAxis stroke={H.g600} tick={{ fontSize: 12 }} />
//                                 <Tooltip content={<CustomTooltip />} />
//                                 <Legend />
//                                 <Area type="monotone" dataKey="requests" stroke={H.navy} fill={`${H.navy}18`} name="Requests" strokeWidth={2} />
//                                 <Area type="monotone" dataKey="resolved" stroke={H.red} fill={`${H.red}15`} name="Resolved" strokeWidth={2} />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     ) : (
//                         <EmptyState type="chart" message={`No request data available for ${getFormattedMonthYear()}`} />
//                     )}
//                 </div>

//                 {/* Status Distribution */}
//                 <div style={S.chartCard}>
//                     <h3 style={S.chartTitle}>
//                         <FaChartPie style={{ color: H.red }} />
//                         Status Distribution — {getFormattedMonthYear()}
//                     </h3>
//                     {dashboardData.statusDistribution.length > 0 ? (
//                         <ResponsiveContainer width="100%" height={250}>
//                             <PieChart>
//                                 <Pie
//                                     data={dashboardData.statusDistribution}
//                                     cx="50%" cy="50%"
//                                     innerRadius={60} outerRadius={90}
//                                     paddingAngle={5} dataKey="value"
//                                     label={({ name, percentage }) => `${name} ${percentage}%`}
//                                 >
//                                     {dashboardData.statusDistribution.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={entry.color} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip content={<CustomTooltip />} />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     ) : (
//                         <EmptyState type="pie" message={`No status data available for ${getFormattedMonthYear()}`} />
//                     )}
//                 </div>
//             </div>

//             {/* ── Modules Grid ─────────────────────────────────────────── */}
//             <h3 style={S.sectionTitle}>
//                 <FaCog style={{ color: H.red }} />
//                 Request Modules — {getFormattedMonthYear()}
//             </h3>
//             <div style={S.modulesGrid}>
//                 {dashboardData.modules.map((module, index) => (
//                     <ModuleCard key={index} module={module} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// // ─── Style System ─────────────────────────────────────────────────────────────
// const FONT = "'Open Sans', 'Segoe UI', Arial, sans-serif";

// const S = {
//     container: {
//         padding: "28px 32px",
//         background: H.offWhite,
//         minHeight: "100vh",
//         fontFamily: FONT,
//     },

//     /* Header */
//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "28px",
//         flexWrap: "wrap",
//         gap: "16px",
//         padding: "20px 24px",
//         background: H.white,
//         borderRadius: "12px",
//         boxShadow: "0 2px 8px rgba(0,53,128,0.07)",
//         border: `1px solid ${H.g200}`,
//         borderTop: `4px solid ${H.red}`,   // HDFC signature red top bar
//     },
//     headerLeft: {
//         display: "flex",
//         alignItems: "center",
//         gap: "16px",
//     },
//     headerIcon: {
//         width: "50px",
//         height: "50px",
//         borderRadius: "10px",
//         background: `linear-gradient(135deg, ${H.navy}, ${H.navyDark})`,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         boxShadow: `0 4px 14px rgba(0,53,128,0.3)`,
//         flexShrink: 0,
//     },
//     title: {
//         fontSize: "24px",
//         fontWeight: "800",
//         margin: 0,
//         color: H.navy,
//         letterSpacing: "-0.3px",
//     },
//     subtitle: {
//         fontSize: "13px",
//         margin: "4px 0 0",
//         color: H.g600,
//     },
//     headerRight: {
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//         flexWrap: "wrap",
//     },
//     dropdownGroup: {
//         display: "flex",
//         gap: "10px",
//     },
//     selectDropdown: {
//         padding: "9px 32px 9px 14px",
//         background: H.white,
//         border: `1.5px solid ${H.g200}`,
//         borderRadius: "8px",
//         color: H.navy,
//         fontSize: "13px",
//         fontWeight: "600",
//         cursor: "pointer",
//         outline: "none",
//         appearance: "none",
//         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23003580' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "right 10px center",
//         backgroundSize: "14px",
//         minWidth: "118px",
//         fontFamily: FONT,
//     },
//     refreshBtn: {
//         display: "flex",
//         alignItems: "center",
//         gap: "8px",
//         padding: "9px 18px",
//         background: H.red,
//         border: "none",
//         borderRadius: "8px",
//         color: H.white,
//         fontSize: "13px",
//         fontWeight: "700",
//         cursor: "pointer",
//         transition: "background 0.2s ease",
//         boxShadow: `0 4px 12px rgba(227,24,55,0.3)`,
//         fontFamily: FONT,
//         letterSpacing: "0.2px",
//     },

//     /* Future banner */
//     futureBanner: {
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//         padding: "12px 18px",
//         background: H.navyLight,
//         border: `1px solid ${H.g200}`,
//         borderLeft: `4px solid ${H.navy}`,
//         borderRadius: "8px",
//         marginBottom: "20px",
//         color: H.navy,
//         fontSize: "13.5px",
//         fontWeight: "500",
//     },

//     /* Stats */
//     statsGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
//         gap: "18px",
//         marginBottom: "24px",
//     },
//     statCard: {
//         background: H.white,
//         borderRadius: "10px",
//         padding: "0",
//         boxShadow: "0 4px 12px rgba(0,53,128,0.07)",
//         border: `1px solid ${H.g200}`,
//         transition: "transform 0.2s ease, box-shadow 0.2s ease",
//         cursor: "pointer",
//         overflow: "hidden",
//         position: "relative",
//     },
//     statAccentBar: {
//         height: "4px",
//         width: "100%",
//     },
//     statContent: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "18px 20px",
//     },
//     statLeft: {
//         display: "flex",
//         flexDirection: "column",
//     },
//     statValue: {
//         fontSize: "30px",
//         fontWeight: "800",
//         color: H.navy,
//         lineHeight: 1.2,
//     },
//     statTitle: {
//         fontSize: "13px",
//         color: H.g600,
//         marginTop: "4px",
//         fontWeight: "600",
//     },
//     statSubtitle: {
//         fontSize: "11px",
//         color: H.g400,
//         marginTop: "2px",
//     },
//     statIcon: (color) => ({
//         width: "50px",
//         height: "50px",
//         borderRadius: "10px",
//         background: color,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
//         flexShrink: 0,
//     }),

//     /* Charts */
//     chartsRow: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
//         gap: "18px",
//         marginBottom: "24px",
//     },
//     chartCard: {
//         background: H.white,
//         borderRadius: "10px",
//         padding: "20px 24px",
//         boxShadow: "0 4px 12px rgba(0,53,128,0.07)",
//         border: `1px solid ${H.g200}`,
//     },
//     chartTitle: {
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//         fontSize: "15px",
//         fontWeight: "700",
//         color: H.navy,
//         marginBottom: "18px",
//         margin: "0 0 18px 0",
//     },

//     /* Section heading */
//     sectionTitle: {
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//         fontSize: "17px",
//         fontWeight: "700",
//         color: H.navy,
//         margin: "0 0 18px 0",
//     },

//     /* Modules */
//     modulesGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//         gap: "18px",
//         marginBottom: "0",
//     },
//     moduleCard: {
//         background: H.white,
//         borderRadius: "10px",
//         padding: "0",
//         boxShadow: "0 4px 12px rgba(0,53,128,0.07)",
//         border: `1px solid ${H.g200}`,
//         cursor: "pointer",
//         transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
//         overflow: "hidden",
//     },
//     moduleTopBar: {
//         height: "4px",
//         width: "100%",
//     },
//     moduleHeader: {
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//         padding: "16px 18px 12px",
//     },
//     moduleIcon: (color) => ({
//         width: "40px",
//         height: "40px",
//         borderRadius: "8px",
//         background: color,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexShrink: 0,
//         boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
//     }),
//     moduleTitle: {
//         fontSize: "15px",
//         fontWeight: "700",
//         color: H.navy,
//     },
//     moduleStats: {
//         display: "flex",
//         justifyContent: "space-around",
//         padding: "0 18px 14px",
//         borderBottom: `1px solid ${H.g100}`,
//     },
//     moduleStat: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//     },
//     moduleStatValue: {
//         fontSize: "26px",
//         fontWeight: "800",
//         color: H.navy,
//     },
//     moduleStatLabel: {
//         fontSize: "11px",
//         color: H.g500,
//         fontWeight: "600",
//         textTransform: "uppercase",
//         letterSpacing: "0.5px",
//         marginTop: "2px",
//     },
//     moduleProgress: {
//         padding: "12px 18px 8px",
//     },
//     progressTrack: {
//         height: "5px",
//         background: H.g100,
//         borderRadius: "3px",
//         overflow: "hidden",
//         marginBottom: "6px",
//     },
//     progressFill: (width, color) => ({
//         height: "100%",
//         width: `${width}%`,
//         background: color || H.navy,
//         borderRadius: "3px",
//         transition: "width 0.4s ease",
//     }),
//     progressText: {
//         fontSize: "11px",
//         color: H.g500,
//         fontWeight: "600",
//     },
//     moduleFooter: {
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "10px 18px 16px",
//     },
//     moduleFooterText: {
//         display: "flex",
//         alignItems: "center",
//         gap: "5px",
//         color: H.g600,
//         fontSize: "12px",
//         fontWeight: "600",
//     },

//     /* Tooltip */
//     tooltip: {
//         background: H.white,
//         padding: "10px 14px",
//         borderRadius: "8px",
//         boxShadow: "0 4px 16px rgba(0,53,128,0.12)",
//         border: `1px solid ${H.g200}`,
//         borderTop: `3px solid ${H.red}`,
//     },
//     tooltipLabel: {
//         fontSize: "12px",
//         fontWeight: "700",
//         color: H.navy,
//         margin: "0 0 6px 0",
//         paddingBottom: "6px",
//         borderBottom: `1px solid ${H.g100}`,
//     },

//     /* Empty */
//     emptyState: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "40px 20px",
//         textAlign: "center",
//     },
//     emptyStateText: { color: H.g500, fontSize: "14px", margin: "14px 0 4px" },
//     emptyStateSubtext: { color: H.g400, fontSize: "12px", margin: 0 },

//     /* Loading */
//     loadingContainer: {
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "400px",
//         background: H.offWhite,
//     },
//     loader: {
//         width: "48px",
//         height: "48px",
//         border: `5px solid ${H.g200}`,
//         borderTop: `5px solid ${H.red}`,
//         borderRadius: "50%",
//         animation: "spin 1s linear infinite",
//         marginBottom: "18px",
//     },
//     loadingText: {
//         fontSize: "15px",
//         color: H.g600,
//         fontWeight: "600",
//     },
// };

// // Global keyframes
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes spin {
//         0%   { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//     }
// `;
// document.head.appendChild(style);

// export default Dashboard;






// // import React, { useState, useEffect } from "react";
// // import API from "../../api";
// // import { useSnackbar } from "../../Context/SnackbarContext";
// // import {
// //     FaMoneyCheck,
// //     FaQuestionCircle,
// //     FaArrowUp,
// //     FaExclamationTriangle,
// //     FaChartLine,
// //     FaChartPie,
// //     FaChartBar,
// //     FaClock,
// //     FaCheckCircle,
// //     FaBan,
// //     FaEye,
// //     FaCalendarAlt,
// //     FaUser,
// //     FaSync,
// //     FaDownload,
// //     FaBell,
// //     FaUsers,
// //     FaFileAlt,
// //     FaCheckDouble,
// //     FaHourglassHalf,
// //     FaArrowRight,
// //     FaCog,
// //     FaInfoCircle,
// //     FaBook,
// //     FaCreditCard,
// //     FaShieldAlt,
// //     FaUserCircle
// // } from "react-icons/fa";
// // import { useNavigate } from "react-router-dom";
// // import {
// //     LineChart,
// //     Line,
// //     BarChart,
// //     Bar,
// //     PieChart,
// //     Pie,
// //     Cell,
// //     XAxis,
// //     YAxis,
// //     CartesianGrid,
// //     Tooltip,
// //     Legend,
// //     ResponsiveContainer,
// //     AreaChart,
// //     Area
// // } from 'recharts';

// // const Dashboard = () => {
// //     const navigate = useNavigate();
// //     const { showSnackbar } = useSnackbar();
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [selectedMonth, setSelectedMonth] = useState("feb");
// //     const [selectedYear, setSelectedYear] = useState("2026");
// //     const [timeRange, setTimeRange] = useState("feb-2026");
// //     const [isFutureMonth, setIsFutureMonth] = useState(false);
// //     const [dashboardData, setDashboardData] = useState({
// //         summary: {
// //             totalRequests: 0,
// //             pendingActions: 0,
// //             resolvedToday: 0,
// //             responseRate: 0
// //         },
// //         modules: [
// //             {
// //                 name: "Cheque Leaves",
// //                 total: 0,
// //                 pending: 0,
// //                 approved: 0,
// //                 rejected: 0,
// //                 icon: FaBook,
// //                 color: "#003366",
// //                 link: "/cheque-book", // Correct route from App.jsx
// //                 endpoint: "chequeRequest"
// //             },
// //             {
// //                 name: "Customer Queries",
// //                 total: 0,
// //                 pending: 0,
// //                 approved: 0,
// //                 rejected: 0,
// //                 icon: FaQuestionCircle,
// //                 color: "#FFD700",
// //                 link: "/customer-queries", // Correct route from App.jsx
// //                 endpoint: "queriesResponse"
// //             },
// //             {
// //                 name: "Limit Requests",
// //                 total: 0,
// //                 pending: 0,
// //                 approved: 0,
// //                 rejected: 0,
// //                 icon: FaArrowUp,
// //                 color: "#10B981",
// //                 link: "/increase-limit", // Correct route from App.jsx
// //                 endpoint: "creditLimit"
// //             },
// //             {
// //                 name: "Stolen Cards",
// //                 total: 0,
// //                 pending: 0,
// //                 approved: 0,
// //                 rejected: 0,
// //                 icon: FaShieldAlt,
// //                 color: "#EF4444",
// //                 link: "/stolen-card", // Correct route from App.jsx
// //                 endpoint: "lostCard"
// //             }
// //         ],
// //         weeklyTrend: [],
// //         statusDistribution: []
// //         // Removed recentActivities and topCustomers from initial state
// //     });

// //     const COLORS = {
// //         approved: "#10B981",
// //         pending: "#F97316",
// //         rejected: "#EF4444",
// //         primary: "#003366",
// //         secondary: "#FFD700",
// //         success: "#10B981",
// //         info: "#3B82F6",
// //         warning: "#F59E0B",
// //         green: "#10B981"
// //     };

// //     useEffect(() => {
// //         checkIfFutureDate();
// //         fetchDashboardData();
// //     }, [timeRange]);

// //     const checkIfFutureDate = () => {
// //         const currentDate = new Date();
// //         const currentYear = currentDate.getFullYear();
// //         const currentMonth = currentDate.getMonth();

// //         const selectedMonthNum = getMonthNumber(selectedMonth);
// //         const selectedYearNum = parseInt(selectedYear);

// //         const isFuture = (selectedYearNum > currentYear) ||
// //             (selectedYearNum === currentYear && selectedMonthNum > currentMonth);

// //         setIsFutureMonth(isFuture);

// //         if (isFuture) {
// //             showSnackbar("info", `Showing preview for ${getFormattedMonthYear()} (no actual data available yet)`);
// //         }
// //     };

// //     const handleMonthChange = (e) => {
// //         const month = e.target.value;
// //         setSelectedMonth(month);
// //         setTimeRange(`${month}-${selectedYear}`);
// //     };

// //     const handleYearChange = (e) => {
// //         const year = e.target.value;
// //         setSelectedYear(year);
// //         setTimeRange(`${selectedMonth}-${year}`);
// //     };

// //     // Helper function to convert month name to month number
// //     const getMonthNumber = (monthAbbr) => {
// //         const months = {
// //             'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
// //             'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
// //         };
// //         return months[monthAbbr];
// //     };

// //     // Helper function to get month name from month number
// //     const getMonthName = (monthNumber) => {
// //         const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
// //             'July', 'August', 'September', 'October', 'November', 'December'];
// //         return monthNames[monthNumber];
// //     };

// //     // Filter data by selected month and year
// //     const filterDataByDate = (items, dateField) => {
// //         if (!items || !Array.isArray(items)) return [];

// //         const monthNum = getMonthNumber(selectedMonth);
// //         const year = parseInt(selectedYear);

// //         return items.filter(item => {
// //             const dateStr = item[dateField];
// //             if (!dateStr) return false;

// //             const date = new Date(dateStr);
// //             return date.getMonth() === monthNum && date.getFullYear() === year;
// //         });
// //     };

// //     // Calculate resolved count for the selected month and year
// //     const calculateResolvedForMonth = (items) => {
// //         if (!items || !Array.isArray(items)) return 0;

// //         const monthNum = getMonthNumber(selectedMonth);
// //         const year = parseInt(selectedYear);

// //         return items.filter(item => {
// //             // Check for approved date first, then other date fields
// //             const dateStr = item.approvedDate || item.queryApprovedDate || item.updatedDate;
// //             if (!dateStr) return false;

// //             const date = new Date(dateStr);
// //             return date.getMonth() === monthNum && date.getFullYear() === year;
// //         }).length;
// //     };

// //     // Generate mock data for future months or when no data exists
// //     const generateMockDataForMonth = () => {
// //         const monthNum = getMonthNumber(selectedMonth);
// //         const year = parseInt(selectedYear);

// //         // Generate different patterns based on month
// //         const seed = (monthNum + 1) * (year - 2020);

// //         // Use seed to make data consistent for the same month/year
// //         Math.seed = seed;
// //         const mockRandom = () => {
// //             const x = Math.sin(seed++) * 10000;
// //             return x - Math.floor(x);
// //         };

// //         const baseTotal = Math.floor(mockRandom() * 40) + 30; // 30-70 requests
// //         const pendingPercent = mockRandom() * 0.3 + 0.2; // 20-50% pending
// //         const approvedPercent = mockRandom() * 0.3 + 0.4; // 40-70% approved
// //         const rejectedPercent = 1 - pendingPercent - approvedPercent;

// //         const mockModules = [
// //             {
// //                 ...dashboardData.modules[0],
// //                 total: Math.floor(mockRandom() * 15) + 5,
// //                 pending: 0,
// //                 approved: 0,
// //                 rejected: 0
// //             },
// //             {
// //                 ...dashboardData.modules[1],
// //                 total: Math.floor(mockRandom() * 20) + 10,
// //                 pending: 0,
// //                 approved: 0,
// //                 rejected: 0
// //             },
// //             {
// //                 ...dashboardData.modules[2],
// //                 total: Math.floor(mockRandom() * 10) + 3,
// //                 pending: 0,
// //                 approved: 0,
// //                 rejected: 0
// //             },
// //             {
// //                 ...dashboardData.modules[3],
// //                 total: Math.floor(mockRandom() * 8) + 2,
// //                 pending: 0,
// //                 approved: 0,
// //                 rejected: 0
// //             }
// //         ];

// //         // Calculate totals from modules
// //         const totalRequests = mockModules.reduce((sum, m) => sum + m.total, 0);
// //         const pendingActions = Math.floor(totalRequests * pendingPercent);
// //         const resolvedToday = Math.floor(totalRequests * approvedPercent);
// //         const responseRate = totalRequests > 0 ? Math.round((resolvedToday / totalRequests) * 100) : 0;

// //         // Distribute pending/approved/rejected across modules
// //         mockModules.forEach(module => {
// //             const moduleTotal = module.total;
// //             module.pending = Math.floor(moduleTotal * pendingPercent);
// //             module.approved = Math.floor(moduleTotal * approvedPercent);
// //             module.rejected = moduleTotal - module.pending - module.approved;
// //         });

// //         return {
// //             summary: {
// //                 totalRequests,
// //                 pendingActions,
// //                 resolvedToday,
// //                 responseRate
// //             },
// //             modules: mockModules,
// //             weeklyTrend: generateMockWeeklyData(totalRequests, resolvedToday),
// //             statusDistribution: [
// //                 { name: 'Approved', value: resolvedToday, color: COLORS.approved, percentage: responseRate },
// //                 { name: 'Pending', value: pendingActions, color: COLORS.pending, percentage: Math.round(pendingActions / totalRequests * 100) },
// //                 { name: 'Rejected', value: totalRequests - resolvedToday - pendingActions, color: COLORS.rejected, percentage: Math.round((totalRequests - resolvedToday - pendingActions) / totalRequests * 100) }
// //             ].filter(item => item.value > 0)
// //             // Removed recentActivities and topCustomers from mock data
// //         };
// //     };

// //     const generateMockWeeklyData = (totalRequests, totalResolved) => {
// //         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// //         const requestsPerDay = Math.floor(totalRequests / 7);
// //         const resolvedPerDay = Math.floor(totalResolved / 7);

// //         return days.map((day, index) => ({
// //             day,
// //             requests: index < totalRequests % 7 ? requestsPerDay + 1 : requestsPerDay,
// //             resolved: index < totalResolved % 7 ? resolvedPerDay + 1 : resolvedPerDay
// //         }));
// //     };

// //     const generateEmptyWeeklyData = () => {
// //         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// //         return days.map(day => ({
// //             day,
// //             requests: 0,
// //             resolved: 0
// //         }));
// //     };

// //     // Navigation handlers for stat cards
// //     const handleTotalRequestsClick = () => {
// //         if (dashboardData.summary.totalRequests === 0) {
// //             showSnackbar("info", `No requests available for ${getFormattedMonthYear()}`);
// //             return;
// //         }
// //         navigate('/all-requests', {
// //             state: {
// //                 month: selectedMonth,
// //                 year: selectedYear,
// //                 filterType: 'all'
// //             }
// //         });
// //     };

// //     const handlePendingActionsClick = () => {
// //         if (dashboardData.summary.pendingActions === 0) {
// //             showSnackbar("info", `No pending actions for ${getFormattedMonthYear()}`);
// //             return;
// //         }
// //         navigate('/pending-actions', {
// //             state: {
// //                 month: selectedMonth,
// //                 year: selectedYear,
// //                 filterType: 'pending'
// //             }
// //         });
// //     };

// //     const handleResolvedClick = () => {
// //         if (dashboardData.summary.resolvedToday === 0) {
// //             showSnackbar("info", `No resolved requests for ${getFormattedMonthYear()}`);
// //             return;
// //         }
// //         navigate('/resolved-requests', {
// //             state: {
// //                 month: selectedMonth,
// //                 year: selectedYear,
// //                 filterType: 'resolved'
// //             }
// //         });
// //     };

// //     const handleResponseRateClick = () => {
// //         // Show success (green) snackbar with response rate
// //         showSnackbar(
// //             "success",
// //             `Response rate for ${getFormattedMonthYear()}: ${dashboardData.summary.responseRate}%`
// //         );
// //         // Optional: navigate to detailed response rate page
// //         // navigate('/response-rate', {
// //         //     state: {
// //         //         month: selectedMonth,
// //         //         year: selectedYear
// //         //     }
// //         // });
// //     };

// //     const fetchDashboardData = async () => {
// //         setIsLoading(true);
// //         try {
// //             // Check if it's a future month
// //             if (isFutureMonth) {
// //                 // Generate mock data for future months
// //                 const mockData = generateMockDataForMonth();
// //                 setDashboardData(mockData);
// //                 setIsLoading(false);
// //                 return;
// //             }

// //             // Fetch data from all modules in parallel
// //             const [
// //                 chequeStats,
// //                 queryStats,
// //                 limitStats,
// //                 stolenStats,
// //                 chequeRecent,
// //                 queryRecent,
// //                 limitRecent,
// //                 stolenRecent
// //             ] = await Promise.allSettled([
// //                 API.get("chequeRequest/counts"),
// //                 API.get("queriesResponse/count"),
// //                 API.get("creditLimit/counts"),
// //                 API.get("lostCard/counts"),
// //                 fetchRecentRequests("chequeRequest/adminChequeList", 0, 50),
// //                 fetchRecentRequests("queriesResponse/adminQueriesList", 0, 50),
// //                 fetchRecentRequests("creditLimit/adminCreditLimitList", 0, 50),
// //                 fetchRecentRequests("lostCard/adminLastCardList", 0, 50)
// //             ]);

// //             // Process module stats
// //             const cheque = chequeStats.status === 'fulfilled' ? chequeStats.value?.data?.data || {} : {};
// //             const queries = queryStats.status === 'fulfilled' ? queryStats.value?.data?.data || {} : {};
// //             const limits = limitStats.status === 'fulfilled' ? limitStats.value?.data?.data || {} : {};
// //             const stolen = stolenStats.status === 'fulfilled' ? stolenStats.value?.data?.data || {} : {};

// //             // Get all recent items
// //             const chequeItems = chequeRecent.value || [];
// //             const queryItems = queryRecent.value || [];
// //             const limitItems = limitRecent.value || [];
// //             const stolenItems = stolenRecent.value || [];

// //             // Filter items by selected month and year
// //             const filteredChequeItems = filterDataByDate(chequeItems, 'requestedDate');
// //             const filteredQueryItems = filterDataByDate(queryItems, 'queryRaisedDate');
// //             const filteredLimitItems = filterDataByDate(limitItems, 'requestDate');
// //             const filteredStolenItems = filterDataByDate(stolenItems, 'createdDate');

// //             // Calculate filtered totals
// //             const filteredChequeTotal = filteredChequeItems.length;
// //             const filteredQueryTotal = filteredQueryItems.length;
// //             const filteredLimitTotal = filteredLimitItems.length;
// //             const filteredStolenTotal = filteredStolenItems.length;

// //             // Calculate filtered pending counts
// //             const filteredChequePending = filteredChequeItems.filter(item =>
// //                 item.status?.toLowerCase() === 'pending').length;
// //             const filteredQueryPending = filteredQueryItems.filter(item =>
// //                 item.status?.toLowerCase() === 'pending').length;
// //             const filteredLimitPending = filteredLimitItems.filter(item =>
// //                 item.status?.toLowerCase() === 'pending').length;
// //             const filteredStolenPending = filteredStolenItems.filter(item =>
// //                 item.status?.toLowerCase() === 'pending').length;

// //             // Calculate filtered approved counts
// //             const filteredChequeApproved = filteredChequeItems.filter(item =>
// //                 item.status?.toLowerCase() === 'approved').length;
// //             const filteredQueryApproved = filteredQueryItems.filter(item =>
// //                 item.status?.toLowerCase() === 'approved').length;
// //             const filteredLimitApproved = filteredLimitItems.filter(item =>
// //                 item.status?.toLowerCase() === 'approved').length;
// //             const filteredStolenApproved = filteredStolenItems.filter(item =>
// //                 item.status?.toLowerCase() === 'approved').length;

// //             // Calculate filtered rejected counts
// //             const filteredChequeRejected = filteredChequeItems.filter(item =>
// //                 item.status?.toLowerCase() === 'rejected').length;
// //             const filteredQueryRejected = filteredQueryItems.filter(item =>
// //                 item.status?.toLowerCase() === 'rejected').length;
// //             const filteredLimitRejected = filteredLimitItems.filter(item =>
// //                 item.status?.toLowerCase() === 'rejected').length;
// //             const filteredStolenRejected = filteredStolenItems.filter(item =>
// //                 item.status?.toLowerCase() === 'rejected').length;

// //             // Calculate totals based on filtered data
// //             const totalRequests = filteredChequeTotal + filteredQueryTotal +
// //                 filteredLimitTotal + filteredStolenTotal;

// //             const pendingActions = filteredChequePending + filteredQueryPending +
// //                 filteredLimitPending + filteredStolenPending;

// //             // Calculate resolved count for the selected month (using approved dates)
// //             const resolvedForMonth = calculateResolvedForMonth([
// //                 ...chequeItems,
// //                 ...queryItems,
// //                 ...limitItems,
// //                 ...stolenItems
// //             ]);

// //             const responseRate = totalRequests > 0
// //                 ? Math.round(((totalRequests - pendingActions) / totalRequests) * 100)
// //                 : 0;

// //             // Update modules with filtered data
// //             const updatedModules = [
// //                 {
// //                     ...dashboardData.modules[0],
// //                     total: filteredChequeTotal,
// //                     pending: filteredChequePending,
// //                     approved: filteredChequeApproved,
// //                     rejected: filteredChequeRejected
// //                 },
// //                 {
// //                     ...dashboardData.modules[1],
// //                     total: filteredQueryTotal,
// //                     pending: filteredQueryPending,
// //                     approved: filteredQueryApproved,
// //                     rejected: filteredQueryRejected
// //                 },
// //                 {
// //                     ...dashboardData.modules[2],
// //                     total: filteredLimitTotal,
// //                     pending: filteredLimitPending,
// //                     approved: filteredLimitApproved,
// //                     rejected: filteredLimitRejected
// //                 },
// //                 {
// //                     ...dashboardData.modules[3],
// //                     total: filteredStolenTotal,
// //                     pending: filteredStolenPending,
// //                     approved: filteredStolenApproved,
// //                     rejected: filteredStolenRejected
// //                 }
// //             ];

// //             // Generate weekly trend based on filtered data
// //             const weeklyTrend = totalRequests > 0
// //                 ? generateWeeklyData([
// //                     ...filteredChequeItems,
// //                     ...filteredQueryItems,
// //                     ...filteredLimitItems,
// //                     ...filteredStolenItems
// //                 ])
// //                 : generateEmptyWeeklyData();

// //             // Generate status distribution based on filtered data
// //             const statusDistribution = generateStatusData(updatedModules);

// //             setDashboardData({
// //                 summary: {
// //                     totalRequests,
// //                     pendingActions,
// //                     resolvedToday: resolvedForMonth,
// //                     responseRate
// //                 },
// //                 modules: updatedModules,
// //                 weeklyTrend,
// //                 statusDistribution
// //                 // Removed recentActivities and topCustomers from setDashboardData
// //             });

// //             // Show message if no data for selected month
// //             if (totalRequests === 0) {
// //                 showSnackbar("info", `No data available for ${getFormattedMonthYear()}`);
// //             }

// //         } catch (error) {
// //             console.error("Error fetching dashboard data:", error);
// //             showSnackbar("error", "Failed to load dashboard data");

// //             // Fallback to mock data on error
// //             const mockData = generateMockDataForMonth();
// //             setDashboardData(mockData);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const fetchRecentRequests = async (endpoint, page, size) => {
// //         try {
// //             const payload = {
// //                 status: "",
// //                 page: page,
// //                 size: size
// //             };
// //             const response = await API.post(endpoint, payload);
// //             return response.data?.data?.content || [];
// //         } catch (error) {
// //             console.error(`Error fetching recent from ${endpoint}:`, error);
// //             return [];
// //         }
// //     };

// //     const generateWeeklyData = (filteredItems) => {
// //         const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// //         const dayMap = new Map();

// //         // Initialize all days with 0
// //         days.forEach(day => dayMap.set(day, { requests: 0, resolved: 0 }));

// //         // Count requests per day
// //         filteredItems.forEach(item => {
// //             const dateStr = item.requestedDate || item.queryRaisedDate || item.requestDate || item.createdDate;
// //             if (dateStr) {
// //                 const date = new Date(dateStr);
// //                 const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
// //                 // Convert to our format (Monday = 0, Sunday = 6)
// //                 const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
// //                 const dayName = days[adjustedIndex];

// //                 if (dayName) {
// //                     const current = dayMap.get(dayName);
// //                     dayMap.set(dayName, {
// //                         requests: current.requests + 1,
// //                         resolved: current.resolved + (item.status?.toLowerCase() === 'approved' ? 1 : 0)
// //                     });
// //                 }
// //             }
// //         });

// //         return days.map(day => ({
// //             day,
// //             requests: dayMap.get(day).requests,
// //             resolved: dayMap.get(day).resolved
// //         }));
// //     };

// //     const generateStatusData = (modules) => {
// //         const approved = modules.reduce((sum, m) => sum + (m.approved || 0), 0);
// //         const pending = modules.reduce((sum, m) => sum + (m.pending || 0), 0);
// //         const rejected = modules.reduce((sum, m) => sum + (m.rejected || 0), 0);

// //         const total = approved + pending + rejected;

// //         // Calculate percentages
// //         return [
// //             { name: 'Approved', value: approved, color: COLORS.approved, percentage: total > 0 ? Math.round((approved / total) * 100) : 0 },
// //             { name: 'Pending', value: pending, color: COLORS.pending, percentage: total > 0 ? Math.round((pending / total) * 100) : 0 },
// //             { name: 'Rejected', value: rejected, color: COLORS.rejected, percentage: total > 0 ? Math.round((rejected / total) * 100) : 0 }
// //         ].filter(item => item.value > 0);
// //     };

// //     // StatCard component
// //     const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
// //         <div
// //             style={styles.statCard}
// //             onClick={onClick}
// //             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
// //             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
// //         >
// //             <div style={styles.statContent}>
// //                 <div style={styles.statLeft}>
// //                     <span style={styles.statValue}>{value}</span>
// //                     <span style={styles.statTitle}>{title}</span>
// //                     {subtitle && <span style={styles.statSubtitle}>{subtitle}</span>}
// //                 </div>
// //                 <div style={styles.statIcon(color)}>
// //                     <Icon size={24} color="#FFFFFF" />
// //                 </div>
// //             </div>
// //         </div>
// //     );

// //     // Module Card component with navigation
// //     const ModuleCard = ({ module }) => {
// //         const Icon = module.icon;
// //         const completionRate = module.total > 0
// //             ? Math.round(((module.approved + module.rejected) / module.total) * 100)
// //             : 0;

// //         const handleModuleClick = () => {
// //             // Navigate to the specific module page
// //             navigate(module.link);
// //         };

// //         return (
// //             <div
// //                 style={styles.moduleCard}
// //                 onClick={handleModuleClick}
// //                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
// //                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
// //             >
// //                 <div style={styles.moduleHeader}>
// //                     <div style={styles.moduleIcon(module.color)}>
// //                         <Icon size={20} color="#FFFFFF" />
// //                     </div>
// //                     <span style={styles.moduleTitle}>{module.name}</span>
// //                 </div>

// //                 <div style={styles.moduleStats}>
// //                     <div style={styles.moduleStat}>
// //                         <span style={styles.moduleStatValue}>{module.total}</span>
// //                         <span style={styles.moduleStatLabel}>Total</span>
// //                     </div>
// //                     <div style={styles.moduleStat}>
// //                         <span style={{ ...styles.moduleStatValue, color: COLORS.pending }}>{module.pending}</span>
// //                         <span style={styles.moduleStatLabel}>Pending</span>
// //                     </div>
// //                 </div>

// //                 <div style={styles.moduleProgress}>
// //                     <div style={styles.progressBar}>
// //                         <div style={styles.progressFill(completionRate)}></div>
// //                     </div>
// //                     <span style={styles.progressText}>{completionRate}% Complete</span>
// //                 </div>

// //                 <div style={styles.moduleFooter}>
// //                     <span style={styles.moduleFooterText}>
// //                         <FaCheckCircle color={COLORS.approved} size={10} /> {module.approved} Approved
// //                     </span>
// //                     <span style={styles.moduleFooterText}>
// //                         <FaBan color={COLORS.rejected} size={10} /> {module.rejected} Rejected
// //                     </span>
// //                 </div>
// //             </div>
// //         );
// //     };

// //     const CustomTooltip = ({ active, payload, label }) => {
// //         if (active && payload && payload.length) {
// //             return (
// //                 <div style={styles.tooltip}>
// //                     <p style={styles.tooltipLabel}>{label}</p>
// //                     {payload.map((entry, index) => (
// //                         <p key={index} style={{ color: entry.color, margin: '5px 0' }}>
// //                             {entry.name}: {entry.value}
// //                         </p>
// //                     ))}
// //                 </div>
// //             );
// //         }
// //         return null;
// //     };

// //     const EmptyState = ({ type, message }) => (
// //         <div style={styles.emptyState}>
// //             {type === 'chart' && <FaChartLine size={48} color="#E6EDF5" />}
// //             {type === 'pie' && <FaChartPie size={48} color="#E6EDF5" />}
// //             <p style={styles.emptyStateText}>{message}</p>
// //             {isFutureMonth && (
// //                 <p style={styles.emptyStateSubtext}>This is a preview. Data will appear when available.</p>
// //             )}
// //         </div>
// //     );

// //     // Format the selected month and year for display
// //     const getFormattedMonthYear = () => {
// //         const monthNames = {
// //             'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
// //             'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
// //             'sep': 'September', 'oct': 'October', 'nov': 'November', 'dec': 'December'
// //         };
// //         return `${monthNames[selectedMonth]} ${selectedYear}`;
// //     };

// //     if (isLoading) {
// //         return (
// //             <div style={styles.loadingContainer}>
// //                 <div style={styles.loader}></div>
// //                 <p style={styles.loadingText}>Loading dashboard for {getFormattedMonthYear()}...</p>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div style={styles.container}>
// //             {/* Header with Month/Year Dropdown */}
// //             <div style={styles.header}>
// //                 <div style={styles.headerLeft}>
// //                     <div style={styles.headerIcon}>
// //                         <FaChartLine size={24} color="#FFD700" />
// //                     </div>
// //                     <div>
// //                         <h1 style={styles.title}>Dashboard</h1>
// //                         <p style={styles.subtitle}>
// //                             Welcome back! Here's your request overview for {getFormattedMonthYear()}
// //                         </p>
// //                     </div>
// //                 </div>
// //                 <div style={styles.headerRight}>
// //                     <div style={styles.dateRangeSelector}>
// //                         <div style={styles.dropdownGroup}>
// //                             <select
// //                                 style={styles.selectDropdown}
// //                                 value={selectedMonth}
// //                                 onChange={handleMonthChange}
// //                             >
// //                                 <option value="jan">January</option>
// //                                 <option value="feb">February</option>
// //                                 <option value="mar">March</option>
// //                                 <option value="apr">April</option>
// //                                 <option value="may">May</option>
// //                                 <option value="jun">June</option>
// //                                 <option value="jul">July</option>
// //                                 <option value="aug">August</option>
// //                                 <option value="sep">September</option>
// //                                 <option value="oct">October</option>
// //                                 <option value="nov">November</option>
// //                                 <option value="dec">December</option>
// //                             </select>
// //                             <select
// //                                 style={styles.selectDropdown}
// //                                 value={selectedYear}
// //                                 onChange={handleYearChange}
// //                             >
// //                                 <option value="2024">2024</option>
// //                                 <option value="2025">2025</option>
// //                                 <option value="2026">2026</option>

// //                             </select>
// //                         </div>
// //                     </div>
// //                     <button style={styles.refreshBtn} onClick={fetchDashboardData}>
// //                         <FaSync size={14} />
// //                         Refresh
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Future Month Indicator */}
// //             {isFutureMonth && (
// //                 <div style={styles.futureIndicator}>
// //                     <FaInfoCircle size={16} color="#FFD700" />
// //                     <span>You're viewing a preview for {getFormattedMonthYear()}. Actual data will appear when available.</span>
// //                 </div>
// //             )}

// //             {/* Summary Stats */}
// //             <div style={styles.statsGrid}>
// //                 <StatCard
// //                     title="Total Requests"
// //                     value={dashboardData.summary.totalRequests}
// //                     icon={FaFileAlt}
// //                     color="#003366"
// //                     subtitle={getFormattedMonthYear()}
// //                     onClick={handleTotalRequestsClick}
// //                 />
// //                 <StatCard
// //                     title="Pending Actions"
// //                     value={dashboardData.summary.pendingActions}
// //                     icon={FaHourglassHalf}
// //                     color="#F97316"
// //                     subtitle={`Need attention in ${getFormattedMonthYear()}`}
// //                     onClick={handlePendingActionsClick}
// //                 />
// //                 <StatCard
// //                     title="Resolved"
// //                     value={dashboardData.summary.resolvedToday}
// //                     icon={FaCheckDouble}
// //                     color="#10B981"
// //                     subtitle={`Resolved in ${getFormattedMonthYear()}`}
// //                     onClick={handleResolvedClick}
// //                 />
// //                 <StatCard
// //                     title="Response Rate"
// //                     value={`${dashboardData.summary.responseRate}%`}
// //                     icon={FaChartLine}
// //                     color="#10B981"
// //                     subtitle={`For ${getFormattedMonthYear()}`}
// //                     onClick={handleResponseRateClick}
// //                 />
// //             </div>

// //             {/* Charts Row */}
// //             <div style={styles.chartsRow}>
// //                 {/* Weekly Trend */}
// //                 <div style={styles.chartCard}>
// //                     <h3 style={styles.chartTitle}>
// //                         <FaChartLine style={styles.chartIcon} />
// //                         Weekly Request Trend - {getFormattedMonthYear()}
// //                     </h3>
// //                     {dashboardData.summary.totalRequests > 0 ? (
// //                         <ResponsiveContainer width="100%" height={250}>
// //                             <AreaChart data={dashboardData.weeklyTrend}>
// //                                 <CartesianGrid strokeDasharray="3 3" stroke="#E6EDF5" />
// //                                 <XAxis dataKey="day" stroke="#4A6F8F" />
// //                                 <YAxis stroke="#4A6F8F" />
// //                                 <Tooltip content={<CustomTooltip />} />
// //                                 <Legend />
// //                                 <Area
// //                                     type="monotone"
// //                                     dataKey="requests"
// //                                     stroke="#003366"
// //                                     fill="rgba(0, 51, 102, 0.1)"
// //                                     name="Requests"
// //                                 />
// //                                 <Area
// //                                     type="monotone"
// //                                     dataKey="resolved"
// //                                     stroke="#10B981"
// //                                     fill="rgba(16, 185, 129, 0.1)"
// //                                     name="Resolved"
// //                                 />
// //                             </AreaChart>
// //                         </ResponsiveContainer>
// //                     ) : (
// //                         <EmptyState
// //                             type="chart"
// //                             message={`No request data available for ${getFormattedMonthYear()}`}
// //                         />
// //                     )}
// //                 </div>

// //                 {/* Status Distribution */}
// //                 <div style={styles.chartCard}>
// //                     <h3 style={styles.chartTitle}>
// //                         <FaChartPie style={styles.chartIcon} />
// //                         Status Distribution - {getFormattedMonthYear()}
// //                     </h3>
// //                     {dashboardData.statusDistribution.length > 0 ? (
// //                         <ResponsiveContainer width="100%" height={250}>
// //                             <PieChart>
// //                                 <Pie
// //                                     data={dashboardData.statusDistribution}
// //                                     cx="50%"
// //                                     cy="50%"
// //                                     innerRadius={60}
// //                                     outerRadius={90}
// //                                     paddingAngle={5}
// //                                     dataKey="value"
// //                                     label={({ name, percentage }) => `${name} ${percentage}%`}
// //                                 >
// //                                     {dashboardData.statusDistribution.map((entry, index) => (
// //                                         <Cell key={`cell-${index}`} fill={entry.color} />
// //                                     ))}
// //                                 </Pie>
// //                                 <Tooltip content={<CustomTooltip />} />
// //                             </PieChart>
// //                         </ResponsiveContainer>
// //                     ) : (
// //                         <EmptyState
// //                             type="pie"
// //                             message={`No status data available for ${getFormattedMonthYear()}`}
// //                         />
// //                     )}
// //                 </div>
// //             </div>

// //             {/* Modules Grid */}
// //             <h3 style={styles.sectionTitle}>
// //                 <FaCog style={styles.sectionIcon} />
// //                 Request Modules - {getFormattedMonthYear()}
// //             </h3>
// //             <div style={styles.modulesGrid}>
// //                 {dashboardData.modules.map((module, index) => (
// //                     <ModuleCard key={index} module={module} />
// //                 ))}
// //             </div>

// //             {/* Removed Recent Activities and Top Customers sections */}
// //         </div>
// //     );
// // };

// // // Styles
// // const styles = {
// //     container: {
// //         padding: "30px",
// //         background: "#F5F9FF",
// //         minHeight: "100vh",
// //         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
// //     },
// //     header: {
// //         display: "flex",
// //         justifyContent: "space-between",
// //         alignItems: "center",
// //         marginBottom: "30px",
// //         flexWrap: "wrap",
// //         gap: "20px",
// //     },
// //     headerLeft: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "16px",
// //     },
// //     headerIcon: {
// //         width: "56px",
// //         height: "56px",
// //         borderRadius: "16px",
// //         background: "linear-gradient(135deg, #003366, #002244)",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         boxShadow: "0 8px 16px rgba(0, 51, 102, 0.15)",
// //     },
// //     title: {
// //         fontSize: "28px",
// //         fontWeight: "700",
// //         margin: 0,
// //         color: "#003366",
// //         letterSpacing: "-0.5px",
// //     },
// //     subtitle: {
// //         fontSize: "14px",
// //         margin: "6px 0 0",
// //         color: "#4A6F8F",
// //     },
// //     headerRight: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "15px",
// //         flexWrap: "wrap",
// //     },
// //     dateRangeSelector: {
// //         position: "relative",
// //     },
// //     dropdownGroup: {
// //         display: "flex",
// //         gap: "10px",
// //     },
// //     selectDropdown: {
// //         padding: "10px 32px 10px 16px",
// //         background: "#FFFFFF",
// //         border: "2px solid #E6EDF5",
// //         borderRadius: "12px",
// //         color: "#003366",
// //         fontSize: "14px",
// //         fontWeight: "500",
// //         cursor: "pointer",
// //         outline: "none",
// //         appearance: "none",
// //         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23003366' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
// //         backgroundRepeat: "no-repeat",
// //         backgroundPosition: "right 12px center",
// //         backgroundSize: "16px",
// //         transition: "all 0.2s ease",
// //         minWidth: "120px",
// //         cursor: "pointer",
// //     },
// //     refreshBtn: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "8px",
// //         padding: "10px 20px",
// //         background: "linear-gradient(135deg, #003366, #002244)",
// //         border: "none",
// //         borderRadius: "12px",
// //         color: "#FFFFFF",
// //         fontSize: "14px",
// //         fontWeight: "600",
// //         cursor: "pointer",
// //         transition: "all 0.2s ease",
// //         boxShadow: "0 4px 12px rgba(0, 51, 102, 0.15)",
// //     },
// //     futureIndicator: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "10px",
// //         padding: "12px 20px",
// //         background: "rgba(255, 215, 0, 0.1)",
// //         border: "1px solid #FFD700",
// //         borderRadius: "12px",
// //         marginBottom: "20px",
// //         color: "#003366",
// //         fontSize: "14px",
// //     },
// //     statsGrid: {
// //         display: "grid",
// //         gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
// //         gap: "20px",
// //         marginBottom: "30px",
// //     },
// //     statCard: {
// //         background: "#FFFFFF",
// //         borderRadius: "20px",
// //         padding: "20px",
// //         boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
// //         border: "1px solid rgba(255, 215, 0, 0.15)",
// //         transition: "transform 0.2s ease, boxShadow 0.2s ease",
// //         cursor: "pointer",
// //     },
// //     statContent: {
// //         display: "flex",
// //         justifyContent: "space-between",
// //         alignItems: "center",
// //     },
// //     statLeft: {
// //         display: "flex",
// //         flexDirection: "column",
// //     },
// //     statValue: {
// //         fontSize: "32px",
// //         fontWeight: "700",
// //         color: "#003366",
// //         lineHeight: 1.2,
// //     },
// //     statTitle: {
// //         fontSize: "14px",
// //         color: "#4A6F8F",
// //         marginTop: "4px",
// //     },
// //     statSubtitle: {
// //         fontSize: "12px",
// //         color: "#8DA6C0",
// //         marginTop: "2px",
// //     },
// //     statIcon: (color) => ({
// //         width: "56px",
// //         height: "56px",
// //         borderRadius: "16px",
// //         background: color,
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
// //     }),
// //     chartsRow: {
// //         display: "grid",
// //         gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
// //         gap: "20px",
// //         marginBottom: "30px",
// //     },
// //     chartCard: {
// //         background: "#FFFFFF",
// //         borderRadius: "20px",
// //         padding: "20px",
// //         boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
// //         border: "1px solid rgba(255, 215, 0, 0.1)",
// //     },
// //     chartTitle: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "10px",
// //         fontSize: "16px",
// //         fontWeight: "600",
// //         color: "#003366",
// //         marginBottom: "20px",
// //     },
// //     chartIcon: {
// //         color: "#FFD700",
// //     },
// //     sectionTitle: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "10px",
// //         fontSize: "18px",
// //         fontWeight: "600",
// //         color: "#003366",
// //         margin: "0 0 20px 0",
// //     },
// //     sectionIcon: {
// //         color: "#FFD700",
// //     },
// //     modulesGrid: {
// //         display: "grid",
// //         gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
// //         gap: "20px",
// //         marginBottom: "0", // Changed from "30px" to "0" since bottom section is removed
// //     },
// //     moduleCard: {
// //         background: "#FFFFFF",
// //         borderRadius: "20px",
// //         padding: "20px",
// //         boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
// //         border: "1px solid rgba(255, 215, 0, 0.1)",
// //         cursor: "pointer",
// //         transition: "transform 0.2s ease, boxShadow 0.2s ease",
// //     },
// //     moduleHeader: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "12px",
// //         marginBottom: "15px",
// //     },
// //     moduleIcon: (color) => ({
// //         width: "44px",
// //         height: "44px",
// //         borderRadius: "12px",
// //         background: color,
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //     }),
// //     moduleTitle: {
// //         fontSize: "16px",
// //         fontWeight: "600",
// //         color: "#003366",
// //     },
// //     moduleStats: {
// //         display: "flex",
// //         justifyContent: "space-between",
// //         marginBottom: "15px",
// //     },
// //     moduleStat: {
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //     },
// //     moduleStatValue: {
// //         fontSize: "24px",
// //         fontWeight: "700",
// //         color: "#003366",
// //     },
// //     moduleStatLabel: {
// //         fontSize: "12px",
// //         color: "#6B8BA4",
// //     },
// //     moduleProgress: {
// //         marginBottom: "10px",
// //     },
// //     progressBar: {
// //         height: "6px",
// //         background: "#E6EDF5",
// //         borderRadius: "3px",
// //         overflow: "hidden",
// //         marginBottom: "5px",
// //     },
// //     progressFill: (width) => ({
// //         height: "100%",
// //         width: `${width}%`,
// //         background: "linear-gradient(90deg, #FFD700, #FDB931)",
// //         borderRadius: "3px",
// //         transition: "width 0.3s ease",
// //     }),
// //     progressText: {
// //         fontSize: "11px",
// //         color: "#8DA6C0",
// //     },
// //     moduleFooter: {
// //         display: "flex",
// //         justifyContent: "space-between",
// //         fontSize: "12px",
// //     },
// //     moduleFooterText: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "4px",
// //         color: "#4A6F8F",
// //     },
// //     // Removed bottomSection, recentCard, customersCard, cardTitle, cardIcon, 
// //     // activityList, activityItem, activityIcon, activityContent, activityTop,
// //     // activityCustomer, activityTime, activityBottom, activityModule, 
// //     // activityStatus, activityAccount, customerList, customerHeader, 
// //     // customerRow, customerName, customerRequests, customerValue styles
// //     emptyState: {
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         padding: "40px 20px",
// //         textAlign: "center",
// //     },
// //     emptyStateText: {
// //         color: "#8DA6C0",
// //         fontSize: "14px",
// //         margin: "15px 0 5px",
// //     },
// //     emptyStateSubtext: {
// //         color: "#B0C4DE",
// //         fontSize: "12px",
// //         margin: 0,
// //     },
// //     tooltip: {
// //         background: "#FFFFFF",
// //         padding: "10px 15px",
// //         borderRadius: "10px",
// //         boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
// //         border: "1px solid #E6EDF5",
// //     },
// //     tooltipLabel: {
// //         fontSize: "13px",
// //         fontWeight: "600",
// //         color: "#003366",
// //         margin: "0 0 5px 0",
// //         borderBottom: "1px solid #E6EDF5",
// //         paddingBottom: "5px",
// //     },
// //     loadingContainer: {
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         minHeight: "400px",
// //     },
// //     loader: {
// //         width: "50px",
// //         height: "50px",
// //         border: "5px solid #E6EDF5",
// //         borderTop: "5px solid #FFD700",
// //         borderRadius: "50%",
// //         animation: "spin 1s linear infinite",
// //         marginBottom: "20px",
// //     },
// //     loadingText: {
// //         fontSize: "16px",
// //         color: "#4A6F8F",
// //         fontWeight: "500",
// //     },
// // };

// // // Add global keyframes
// // const style = document.createElement('style');
// // style.textContent = `
// //     @keyframes spin {
// //         0% { transform: rotate(0deg); }
// //         100% { transform: rotate(360deg); }
// //     }
// // `;
// // document.head.appendChild(style);

// // export default Dashboard;