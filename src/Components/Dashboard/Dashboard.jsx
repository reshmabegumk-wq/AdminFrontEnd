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
                color: "#003366", 
                link: "/cheque-book", // Correct route from App.jsx
                endpoint: "chequeRequest" 
            },
            { 
                name: "Customer Queries", 
                total: 0, 
                pending: 0, 
                approved: 0, 
                rejected: 0, 
                icon: FaQuestionCircle, 
                color: "#FFD700", 
                link: "/customer-queries", // Correct route from App.jsx
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
                link: "/increase-limit", // Correct route from App.jsx
                endpoint: "creditLimit" 
            },
            { 
                name: "Stolen Cards", 
                total: 0, 
                pending: 0, 
                approved: 0, 
                rejected: 0, 
                icon: FaShieldAlt, 
                color: "#EF4444", 
                link: "/stolen-card", // Correct route from App.jsx
                endpoint: "lostCard" 
            }
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
        secondary: "#FFD700",
        success: "#10B981",
        info: "#3B82F6",
        warning: "#F59E0B",
        green: "#10B981"
    };

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

    // Generate mock data for future months or when no data exists
    const generateMockDataForMonth = () => {
        const monthNum = getMonthNumber(selectedMonth);
        const year = parseInt(selectedYear);
        
        // Generate different patterns based on month
        const seed = (monthNum + 1) * (year - 2020);
        
        // Use seed to make data consistent for the same month/year
        Math.seed = seed;
        const mockRandom = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
        
        const baseTotal = Math.floor(mockRandom() * 40) + 30; // 30-70 requests
        const pendingPercent = mockRandom() * 0.3 + 0.2; // 20-50% pending
        const approvedPercent = mockRandom() * 0.3 + 0.4; // 40-70% approved
        const rejectedPercent = 1 - pendingPercent - approvedPercent;
        
        const mockModules = [
            { 
                ...dashboardData.modules[0],
                total: Math.floor(mockRandom() * 15) + 5,
                pending: 0,
                approved: 0,
                rejected: 0
            },
            { 
                ...dashboardData.modules[1],
                total: Math.floor(mockRandom() * 20) + 10,
                pending: 0,
                approved: 0,
                rejected: 0
            },
            { 
                ...dashboardData.modules[2],
                total: Math.floor(mockRandom() * 10) + 3,
                pending: 0,
                approved: 0,
                rejected: 0
            },
            { 
                ...dashboardData.modules[3],
                total: Math.floor(mockRandom() * 8) + 2,
                pending: 0,
                approved: 0,
                rejected: 0
            }
        ];
        
        // Calculate totals from modules
        const totalRequests = mockModules.reduce((sum, m) => sum + m.total, 0);
        const pendingActions = Math.floor(totalRequests * pendingPercent);
        const resolvedToday = Math.floor(totalRequests * approvedPercent);
        const responseRate = totalRequests > 0 ? Math.round((resolvedToday / totalRequests) * 100) : 0;
        
        // Distribute pending/approved/rejected across modules
        mockModules.forEach(module => {
            const moduleTotal = module.total;
            module.pending = Math.floor(moduleTotal * pendingPercent);
            module.approved = Math.floor(moduleTotal * approvedPercent);
            module.rejected = moduleTotal - module.pending - module.approved;
        });
        
        return {
            summary: {
                totalRequests,
                pendingActions,
                resolvedToday,
                responseRate
            },
            modules: mockModules,
            weeklyTrend: generateMockWeeklyData(totalRequests, resolvedToday),
            statusDistribution: [
                { name: 'Approved', value: resolvedToday, color: COLORS.approved, percentage: responseRate },
                { name: 'Pending', value: pendingActions, color: COLORS.pending, percentage: Math.round(pendingActions / totalRequests * 100) },
                { name: 'Rejected', value: totalRequests - resolvedToday - pendingActions, color: COLORS.rejected, percentage: Math.round((totalRequests - resolvedToday - pendingActions) / totalRequests * 100) }
            ].filter(item => item.value > 0),
            recentActivities: generateMockActivities(),
            topCustomers: generateMockCustomers()
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

    const generateMockActivities = () => {
        const activities = [];
        const customers = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emma Brown', 'David Lee'];
        const modules = [
            { name: 'Cheque Leaves', icon: FaBook, color: '#003366' },
            { name: 'Customer Queries', icon: FaQuestionCircle, color: '#FFD700' },
            { name: 'Limit Requests', icon: FaArrowUp, color: '#10B981' },
            { name: 'Stolen Cards', icon: FaShieldAlt, color: '#EF4444' }
        ];
        const statuses = ['Approved', 'Pending', 'Rejected'];
        
        for (let i = 0; i < 8; i++) {
            const module = modules[Math.floor(Math.random() * modules.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const customer = customers[Math.floor(Math.random() * customers.length)];
            
            activities.push({
                id: `mock-${i}`,
                customer,
                module: module.name,
                moduleIcon: module.icon,
                moduleColor: module.color,
                status,
                time: "", // Changed: removed time value completely
                timestamp: new Date().toISOString(),
                description: `${module.name === 'Cheque Leaves' ? '50 leaves' : 
                             module.name === 'Limit Requests' ? '₹50,000' : 
                             module.name === 'Stolen Cards' ? 'Card blocked' : 
                             'Query about account'}`,
                accountNumber: `XXXXXX${Math.floor(Math.random() * 10000)}`
            });
        }
        
        return activities;
    };

    const generateMockCustomers = () => {
        const customers = [
            { name: 'John Smith', requests: 8, value: '₹1,50,000' },
            { name: 'Sarah Johnson', requests: 6, value: '₹75,000' },
            { name: 'Mike Wilson', requests: 5, value: '50 leaves' },
            { name: 'Emma Brown', requests: 4, value: '₹25,000' },
            { name: 'David Lee', requests: 3, value: '₹30,000' }
        ];
        
        return customers.sort((a, b) => b.requests - a.requests);
    };

    const generateEmptyWeeklyData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            day,
            requests: 0,
            resolved: 0
        }));
    };

    // Navigation handlers for stat cards
    const handleTotalRequestsClick = () => {
        if (dashboardData.summary.totalRequests === 0) {
            showSnackbar("info", `No requests available for ${getFormattedMonthYear()}`);
            return;
        }
        navigate('/all-requests', {
            state: {
                month: selectedMonth,
                year: selectedYear,
                filterType: 'all'
            }
        });
    };

    const handlePendingActionsClick = () => {
        if (dashboardData.summary.pendingActions === 0) {
            showSnackbar("info", `No pending actions for ${getFormattedMonthYear()}`);
            return;
        }
        navigate('/pending-actions', {
            state: {
                month: selectedMonth,
                year: selectedYear,
                filterType: 'pending'
            }
        });
    };

    const handleResolvedClick = () => {
        if (dashboardData.summary.resolvedToday === 0) {
            showSnackbar("info", `No resolved requests for ${getFormattedMonthYear()}`);
            return;
        }
        navigate('/resolved-requests', {
            state: {
                month: selectedMonth,
                year: selectedYear,
                filterType: 'resolved'
            }
        });
    };

    const handleResponseRateClick = () => {
        // Show success (green) snackbar with response rate
        showSnackbar(
            "success",
            `Response rate for ${getFormattedMonthYear()}: ${dashboardData.summary.responseRate}%`
        );
        // Optional: navigate to detailed response rate page
        // navigate('/response-rate', {
        //     state: {
        //         month: selectedMonth,
        //         year: selectedYear
        //     }
        // });
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Check if it's a future month
            if (isFutureMonth) {
                // Generate mock data for future months
                const mockData = generateMockDataForMonth();
                setDashboardData(mockData);
                setIsLoading(false);
                return;
            }

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
            const weeklyTrend = totalRequests > 0 
                ? generateWeeklyData([
                    ...filteredChequeItems,
                    ...filteredQueryItems,
                    ...filteredLimitItems,
                    ...filteredStolenItems
                ])
                : generateEmptyWeeklyData();

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

            // Show message if no data for selected month
            if (totalRequests === 0) {
                showSnackbar("info", `No data available for ${getFormattedMonthYear()}`);
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            showSnackbar("error", "Failed to load dashboard data");
            
            // Fallback to mock data on error
            const mockData = generateMockDataForMonth();
            setDashboardData(mockData);
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
            module: "Cheque Leaves",
            moduleIcon: FaBook,
            moduleColor: "#003366",
            status: item.status || "Pending",
            time: "", // Changed: set time to empty string
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
            time: "", // Changed: set time to empty string
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
            time: "", // Changed: set time to empty string
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
            moduleIcon: FaShieldAlt,
            moduleColor: "#EF4444",
            status: item.status || "Pending",
            time: "", // Changed: set time to empty string
            timestamp: item.createdDate,
            description: `Card: ${maskCardNumber(item.lostCardNumber)}`,
            accountNumber: item.accountNumber
        }));
    };

    // This function is no longer used but kept for reference
    const formatTime = (dateString) => {
        return ""; // Return empty string to remove time display
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
            requests: dayMap.get(day).requests,
            resolved: dayMap.get(day).resolved
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

    // StatCard component
    const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => (
        <div 
            style={styles.statCard} 
            onClick={onClick}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
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

    // Module Card component with navigation
    const ModuleCard = ({ module }) => {
        const Icon = module.icon;
        const completionRate = module.total > 0
            ? Math.round(((module.approved + module.rejected) / module.total) * 100)
            : 0;

        const handleModuleClick = () => {
            // Navigate to the specific module page
            navigate(module.link);
        };

        return (
            <div 
                style={styles.moduleCard} 
                onClick={handleModuleClick}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
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
                        {/* Removed the activity.time display completely */}
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

    const EmptyState = ({ type, message }) => (
        <div style={styles.emptyState}>
            {type === 'chart' && <FaChartLine size={48} color="#E6EDF5" />}
            {type === 'pie' && <FaChartPie size={48} color="#E6EDF5" />}
            {type === 'activity' && <FaClock size={48} color="#E6EDF5" />}
            {type === 'customers' && <FaUsers size={48} color="#E6EDF5" />}
            <p style={styles.emptyStateText}>{message}</p>
            {isFutureMonth && (
                <p style={styles.emptyStateSubtext}>This is a preview. Data will appear when available.</p>
            )}
        </div>
    );

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

            {/* Future Month Indicator */}
            {isFutureMonth && (
                <div style={styles.futureIndicator}>
                    <FaInfoCircle size={16} color="#FFD700" />
                    <span>You're viewing a preview for {getFormattedMonthYear()}. Actual data will appear when available.</span>
                </div>
            )}

            {/* Summary Stats */}
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
                    color="#10B981"
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
                    {dashboardData.summary.totalRequests > 0 ? (
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
                    ) : (
                        <EmptyState 
                            type="chart" 
                            message={`No request data available for ${getFormattedMonthYear()}`}
                        />
                    )}
                </div>

                {/* Status Distribution */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                        <FaChartPie style={styles.chartIcon} />
                        Status Distribution - {getFormattedMonthYear()}
                    </h3>
                    {dashboardData.statusDistribution.length > 0 ? (
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
                    ) : (
                        <EmptyState 
                            type="pie" 
                            message={`No status data available for ${getFormattedMonthYear()}`}
                        />
                    )}
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
                            <EmptyState 
                                type="activity" 
                                message={`No recent activities for ${getFormattedMonthYear()}`}
                            />
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
                            <EmptyState 
                                type="customers" 
                                message={`No customer data for ${getFormattedMonthYear()}`}
                            />
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
        cursor: "pointer",
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
    futureIndicator: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px",
        background: "rgba(255, 215, 0, 0.1)",
        border: "1px solid #FFD700",
        borderRadius: "12px",
        marginBottom: "20px",
        color: "#003366",
        fontSize: "14px",
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
        cursor: "pointer",
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
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
    },
    emptyStateText: {
        color: "#8DA6C0",
        fontSize: "14px",
        margin: "15px 0 5px",
    },
    emptyStateSubtext: {
        color: "#B0C4DE",
        fontSize: "12px",
        margin: 0,
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