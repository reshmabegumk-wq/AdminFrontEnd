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
    FaChartLine,
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
    FaHourglassHalf,
    FaBan,
    FaTachometerAlt,
    FaThumbsUp,
    FaThumbsDown,
    FaChartBar,
    FaChartPie
} from "react-icons/fa";
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

const ResponseRate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);
    const [responseData, setResponseData] = useState({
        overall: {
            total: 0,
            responded: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            responseRate: 0,
            approvalRate: 0,
            rejectionRate: 0
        },
        byModule: [],
        daily: [],
        weekly: [],
        byTeam: [],
        trends: []
    });
    const [selectedModule, setSelectedModule] = useState("all");
    const [selectedView, setSelectedView] = useState("overview");
    const [dateRange, setDateRange] = useState("monthly");

    // Get filter state from navigation - this comes from dashboard
    const { month, year } = location.state || {
        month: "feb",
        year: "2026"
    };

    const COLORS = {
        approved: "#10B981",
        pending: "#F97316",
        rejected: "#EF4444",
        primary: "#003366",
        secondary: "#FFD700",
        info: "#3B82F6",
        warning: "#F59E0B",
        success: "#10B981",
        danger: "#DC2626",
        green: "#10B981",
        lightGreen: "#34D399",
        darkGreen: "#059669",
        blue: "#003366",
        gold: "#FFD700"
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

    // Calculate response metrics
    const calculateResponseMetrics = (requests) => {
        const total = requests.length;
        const responded = requests.filter(r => 
            r.status?.toLowerCase() === 'approved' || 
            r.status?.toLowerCase() === 'rejected'
        ).length;
        const pending = requests.filter(r => r.status?.toLowerCase() === 'pending').length;
        const approved = requests.filter(r => r.status?.toLowerCase() === 'approved').length;
        const rejected = requests.filter(r => r.status?.toLowerCase() === 'rejected').length;
        
        const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
        const approvalRate = responded > 0 ? Math.round((approved / responded) * 100) : 0;
        const rejectionRate = responded > 0 ? Math.round((rejected / responded) * 100) : 0;
        
        return {
            total,
            responded,
            pending,
            approved,
            rejected,
            responseRate,
            approvalRate,
            rejectionRate
        };
    };

    // Calculate average response time in hours
    const calculateAvgResponseTime = (requests) => {
        const responded = requests.filter(r => 
            (r.status?.toLowerCase() === 'approved' || r.status?.toLowerCase() === 'rejected') &&
            r.requestedDate && (r.approvedDate || r.updatedDate)
        );
        
        if (responded.length === 0) return 0;
        
        let totalHours = 0;
        responded.forEach(r => {
            const start = new Date(r.requestedDate);
            const end = new Date(r.approvedDate || r.updatedDate);
            const hours = (end - start) / (1000 * 60 * 60);
            totalHours += hours;
        });
        
        return Math.round(totalHours / responded.length);
    };

    // Generate daily response data
    const generateDailyData = (requests) => {
        const daysInMonth = 30;
        const data = [];
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayRequests = requests.filter(r => {
                const date = new Date(r.requestedDate);
                return date.getDate() === i;
            });
            
            const metrics = calculateResponseMetrics(dayRequests);
            
            data.push({
                day: i,
                total: metrics.total,
                responded: metrics.responded,
                responseRate: metrics.responseRate,
                approved: metrics.approved,
                rejected: metrics.rejected,
                pending: metrics.pending
            });
        }
        
        return data;
    };

    // Generate weekly response data
    const generateWeeklyData = (requests) => {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const data = [];
        
        weeks.forEach((week, index) => {
            const startDay = index * 7 + 1;
            const endDay = startDay + 6;
            
            const weekRequests = requests.filter(r => {
                const date = new Date(r.requestedDate);
                const day = date.getDate();
                return day >= startDay && day <= endDay;
            });
            
            const metrics = calculateResponseMetrics(weekRequests);
            const avgTime = calculateAvgResponseTime(weekRequests);
            
            data.push({
                week,
                total: metrics.total,
                responded: metrics.responded,
                responseRate: metrics.responseRate,
                avgResponseTime: avgTime,
                approved: metrics.approved,
                rejected: metrics.rejected,
                pending: metrics.pending
            });
        });
        
        return data;
    };

    // Generate module-wise response data
    const generateModuleData = (cheque, queries, limits, stolen) => {
        return [
            {
                name: "Cheque Books",
                total: cheque.length,
                responded: cheque.filter(r => r.status?.toLowerCase() !== 'pending').length,
                pending: cheque.filter(r => r.status?.toLowerCase() === 'pending').length,
                approved: cheque.filter(r => r.status?.toLowerCase() === 'approved').length,
                rejected: cheque.filter(r => r.status?.toLowerCase() === 'rejected').length,
                responseRate: cheque.length > 0 
                    ? Math.round((cheque.filter(r => r.status?.toLowerCase() !== 'pending').length / cheque.length) * 100) 
                    : 0,
                avgTime: calculateAvgResponseTime(cheque),
                color: "#003366"
            },
            {
                name: "Customer Queries",
                total: queries.length,
                responded: queries.filter(r => r.status?.toLowerCase() !== 'pending').length,
                pending: queries.filter(r => r.status?.toLowerCase() === 'pending').length,
                approved: queries.filter(r => r.status?.toLowerCase() === 'approved').length,
                rejected: queries.filter(r => r.status?.toLowerCase() === 'rejected').length,
                responseRate: queries.length > 0 
                    ? Math.round((queries.filter(r => r.status?.toLowerCase() !== 'pending').length / queries.length) * 100) 
                    : 0,
                avgTime: calculateAvgResponseTime(queries),
                color: "#FFD700"
            },
            {
                name: "Limit Requests",
                total: limits.length,
                responded: limits.filter(r => r.status?.toLowerCase() !== 'pending').length,
                pending: limits.filter(r => r.status?.toLowerCase() === 'pending').length,
                approved: limits.filter(r => r.status?.toLowerCase() === 'approved').length,
                rejected: limits.filter(r => r.status?.toLowerCase() === 'rejected').length,
                responseRate: limits.length > 0 
                    ? Math.round((limits.filter(r => r.status?.toLowerCase() !== 'pending').length / limits.length) * 100) 
                    : 0,
                avgTime: calculateAvgResponseTime(limits),
                color: "#10B981"
            },
            {
                name: "Stolen Cards",
                total: stolen.length,
                responded: stolen.filter(r => r.status?.toLowerCase() !== 'pending').length,
                pending: stolen.filter(r => r.status?.toLowerCase() === 'pending').length,
                approved: stolen.filter(r => r.status?.toLowerCase() === 'approved').length,
                rejected: stolen.filter(r => r.status?.toLowerCase() === 'rejected').length,
                responseRate: stolen.length > 0 
                    ? Math.round((stolen.filter(r => r.status?.toLowerCase() !== 'pending').length / stolen.length) * 100) 
                    : 0,
                avgTime: calculateAvgResponseTime(stolen),
                color: "#EF4444"
            }
        ];
    };

    // Generate team performance data
    const generateTeamData = (allRequests) => {
        const teamMap = new Map();
        
        allRequests.forEach(request => {
            const resolver = request.approvedBy || request.updatedBy || 'Unassigned';
            if (!teamMap.has(resolver)) {
                teamMap.set(resolver, {
                    name: resolver,
                    total: 0,
                    responded: 0,
                    approved: 0,
                    rejected: 0,
                    totalTime: 0
                });
            }
            
            const member = teamMap.get(resolver);
            member.total++;
            
            if (request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'rejected') {
                member.responded++;
                
                if (request.status?.toLowerCase() === 'approved') {
                    member.approved++;
                } else {
                    member.rejected++;
                }
                
                if (request.requestedDate && (request.approvedDate || request.updatedDate)) {
                    const start = new Date(request.requestedDate);
                    const end = new Date(request.approvedDate || request.updatedDate);
                    member.totalTime += (end - start) / (1000 * 60 * 60);
                }
            }
        });
        
        return Array.from(teamMap.values()).map(member => ({
            ...member,
            responseRate: member.total > 0 ? Math.round((member.responded / member.total) * 100) : 0,
            avgTime: member.responded > 0 ? Math.round(member.totalTime / member.responded) : 0
        })).sort((a, b) => b.responseRate - a.responseRate);
    };

    // Fetch all data for response rate calculation
    const fetchResponseData = async () => {
        setIsLoading(true);
        try {
            showSnackbar("info", `Loading response metrics for ${getFormattedMonthYear()}...`);
            
            // Fetch from all modules
            const [chequeRes, queryRes, limitRes, stolenRes] = await Promise.allSettled([
                API.post("chequeRequest/adminChequeList", { status: "", page: 0, size: 100 }),
                API.post("queriesResponse/adminQueriesList", { status: "", page: 0, size: 100 }),
                API.post("creditLimit/adminCreditLimitList", { status: "", page: 0, size: 100 }),
                API.post("lostCard/adminLastCardList", { status: "", page: 0, size: 100 })
            ]);

            // Process all requests
            let allRequests = [];
            let chequeRequests = [];
            let queryRequests = [];
            let limitRequests = [];
            let stolenRequests = [];

            // Cheque requests
            if (chequeRes.status === 'fulfilled' && chequeRes.value?.data?.data?.content) {
                chequeRequests = chequeRes.value.data.data.content.map(item => ({
                    ...item,
                    module: "Cheque Books",
                    requestedDate: item.requestedDate || item.createdDate,
                    resolvedDate: item.approvedDate || item.updatedDate
                }));
                allRequests = [...allRequests, ...chequeRequests];
            }

            // Query requests
            if (queryRes.status === 'fulfilled' && queryRes.value?.data?.data?.content) {
                queryRequests = queryRes.value.data.data.content.map(item => ({
                    ...item,
                    module: "Customer Queries",
                    requestedDate: item.queryRaisedDate,
                    resolvedDate: item.queryApprovedDate
                }));
                allRequests = [...allRequests, ...queryRequests];
            }

            // Limit requests
            if (limitRes.status === 'fulfilled' && limitRes.value?.data?.data?.content) {
                limitRequests = limitRes.value.data.data.content.map(item => ({
                    ...item,
                    module: "Limit Requests",
                    requestedDate: item.requestDate,
                    resolvedDate: item.approvedDate
                }));
                allRequests = [...allRequests, ...limitRequests];
            }

            // Stolen card requests
            if (stolenRes.status === 'fulfilled' && stolenRes.value?.data?.data?.content) {
                stolenRequests = stolenRes.value.data.data.content.map(item => ({
                    ...item,
                    module: "Stolen Cards",
                    requestedDate: item.createdDate,
                    resolvedDate: item.updatedDate
                }));
                allRequests = [...allRequests, ...stolenRequests];
            }

            // Filter by selected month and year
            const monthNum = getMonthNumber(month);
            const yearNum = parseInt(year);

            const filterByDate = (requests) => {
                return requests.filter(r => {
                    if (!r.requestedDate) return false;
                    const date = new Date(r.requestedDate);
                    return date.getMonth() === monthNum && date.getFullYear() === yearNum;
                });
            };

            const filteredCheque = filterByDate(chequeRequests);
            const filteredQueries = filterByDate(queryRequests);
            const filteredLimits = filterByDate(limitRequests);
            const filteredStolen = filterByDate(stolenRequests);
            const filteredAll = [...filteredCheque, ...filteredQueries, ...filteredLimits, ...filteredStolen];

            // Calculate overall metrics
            const overallMetrics = calculateResponseMetrics(filteredAll);
            
            // Generate module data
            const moduleData = generateModuleData(filteredCheque, filteredQueries, filteredLimits, filteredStolen);
            
            // Generate daily and weekly data
            const dailyData = generateDailyData(filteredAll);
            const weeklyData = generateWeeklyData(filteredAll);
            
            // Generate team data
            const teamData = generateTeamData(filteredAll);
            
            // Generate trend data (last 6 months)
            const trendData = [];
            for (let i = 5; i >= 0; i--) {
                const trendMonth = new Date(yearNum, monthNum - i, 1);
                trendData.push({
                    month: trendMonth.toLocaleDateString('en-IN', { month: 'short' }),
                    rate: Math.floor(Math.random() * 30) + 50 // Placeholder - replace with actual historical data
                });
            }

            setResponseData({
                overall: overallMetrics,
                byModule: moduleData,
                daily: dailyData,
                weekly: weeklyData,
                byTeam: teamData,
                trends: trendData
            });

            if (filteredAll.length === 0) {
                showSnackbar("info", `No data found for ${getFormattedMonthYear()}`);
            }

        } catch (error) {
            console.error("Error fetching response data:", error);
            showSnackbar("error", "Failed to load response metrics");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResponseData();
    }, [month, year]);

    const handleExport = () => {
        try {
            const csvData = responseData.byModule.map(module => ({
                'Module': module.name,
                'Total Requests': module.total,
                'Responded': module.responded,
                'Pending': module.pending,
                'Approved': module.approved,
                'Rejected': module.rejected,
                'Response Rate': `${module.responseRate}%`,
                'Avg Response Time': `${module.avgTime}h`
            }));

            const csv = convertToCSV(csvData);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `response-rate-${month}-${year}.csv`;
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={styles.tooltip}>
                    <p style={styles.tooltipLabel}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, margin: '5px 0' }}>
                            {entry.name}: {entry.value}{entry.name.includes('Rate') ? '%' : ''}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p style={styles.loadingText}>Loading response metrics for {getFormattedMonthYear()}...</p>
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
                        <FaChartLine size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Response Rate Analytics</h1>
                        <p style={styles.subtitle}>
                            {getFormattedMonthYear()} • Overall Response Rate: {responseData.overall.responseRate}%
                        </p>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <select
                        style={styles.viewSelect}
                        value={selectedView}
                        onChange={(e) => setSelectedView(e.target.value)}
                    >
                        <option value="overview">Overview</option>
                        <option value="daily">Daily Breakdown</option>
                        <option value="weekly">Weekly Trends</option>
                        <option value="team">Team Performance</option>
                    </select>
                    <button style={styles.exportBtn} onClick={handleExport} disabled={responseData.byModule.length === 0}>
                        <FaDownload size={14} />
                        Export
                    </button>
                    <button style={styles.refreshBtn} onClick={fetchResponseData}>
                        <FaSync size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards - All red changed to green */}
            <div style={styles.metricsGrid}>
                <div style={styles.metricCard}>
                    <div style={styles.metricIcon(COLORS.blue)}>
                        <FaChartLine size={24} color="#FFFFFF" />
                    </div>
                    <div style={styles.metricInfo}>
                        <span style={styles.metricValue}>{responseData.overall.responseRate}%</span>
                        <span style={styles.metricLabel}>Response Rate</span>
                    </div>
                </div>
                <div style={styles.metricCard}>
                    <div style={styles.metricIcon(COLORS.green)}>
                        <FaCheckCircle size={24} color="#FFFFFF" />
                    </div>
                    <div style={styles.metricInfo}>
                        <span style={styles.metricValue}>{responseData.overall.responded}</span>
                        <span style={styles.metricLabel}>Responded</span>
                    </div>
                </div>
                <div style={styles.metricCard}>
                    <div style={styles.metricIcon(COLORS.warning)}>
                        <FaHourglassHalf size={24} color="#FFFFFF" />
                    </div>
                    <div style={styles.metricInfo}>
                        <span style={styles.metricValue}>{responseData.overall.pending}</span>
                        <span style={styles.metricLabel}>Pending</span>
                    </div>
                </div>
                <div style={styles.metricCard}>
                    <div style={styles.metricIcon(COLORS.green)}>
                        <FaClock size={24} color="#FFFFFF" />
                    </div>
                    <div style={styles.metricInfo}>
                        <span style={styles.metricValue}>
                            {Math.round(responseData.byModule.reduce((acc, m) => acc + m.avgTime, 0) / responseData.byModule.length)}h
                        </span>
                        <span style={styles.metricLabel}>Avg Response Time</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div style={styles.chartsRow}>
                {/* Response Rate by Module */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                        <FaChartBar style={styles.chartIcon} />
                        Response Rate by Module
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={responseData.byModule}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6EDF5" />
                            <XAxis dataKey="name" stroke="#4A6F8F" />
                            <YAxis stroke="#4A6F8F" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="responseRate" name="Response Rate %" fill={COLORS.blue} />
                            <Bar dataKey="avgTime" name="Avg Time (hours)" fill={COLORS.green} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution - Changed rejected to green as well? Actually rejected should stay red, but let's make pending orange and approved green */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                        <FaChartPie style={styles.chartIcon} />
                        Response Status Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Approved', value: responseData.overall.approved, color: COLORS.green },
                                    { name: 'Rejected', value: responseData.overall.rejected, color: COLORS.rejected },
                                    { name: 'Pending', value: responseData.overall.pending, color: COLORS.warning }
                                ].filter(item => item.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {[
                                    { name: 'Approved', value: responseData.overall.approved, color: COLORS.green },
                                    { name: 'Rejected', value: responseData.overall.rejected, color: COLORS.rejected },
                                    { name: 'Pending', value: responseData.overall.pending, color: COLORS.warning }
                                ].filter(item => item.value > 0).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Module-wise Breakdown Table */}
            <div style={styles.tableContainer}>
                <h3 style={styles.sectionTitle}>
                    <FaFilter style={styles.sectionIcon} />
                    Module-wise Response Breakdown
                </h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Module</th>
                            <th style={styles.th}>Total Requests</th>
                            <th style={styles.th}>Responded</th>
                            <th style={styles.th}>Pending</th>
                            <th style={styles.th}>Approved</th>
                            <th style={styles.th}>Rejected</th>
                            <th style={styles.th}>Response Rate</th>
                            <th style={styles.th}>Avg Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responseData.byModule.map((module, index) => (
                            <tr key={index} style={styles.tr}>
                                <td style={styles.td}>
                                    <div style={styles.moduleCell}>
                                        <div style={styles.moduleDot(module.color)} />
                                        <span>{module.name}</span>
                                    </div>
                                </td>
                                <td style={styles.td}>{module.total}</td>
                                <td style={styles.td}>{module.responded}</td>
                                <td style={styles.td}>{module.pending}</td>
                                <td style={styles.td}>
                                    <span style={styles.approvedText}>{module.approved}</span>
                                </td>
                                <td style={styles.td}>
                                    <span style={styles.rejectedText}>{module.rejected}</span>
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.progressContainer}>
                                        <div style={styles.progressBar}>
                                            <div style={styles.progressFill(module.responseRate)} />
                                        </div>
                                        <span style={styles.progressText}>{module.responseRate}%</span>
                                    </div>
                                </td>
                                <td style={styles.td}>{module.avgTime}h</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Team Performance Table */}
            {selectedView === 'team' && (
                <div style={styles.tableContainer}>
                    <h3 style={styles.sectionTitle}>
                        <FaUser style={styles.sectionIcon} />
                        Team Performance
                    </h3>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Team Member</th>
                                <th style={styles.th}>Total Assigned</th>
                                <th style={styles.th}>Responded</th>
                                <th style={styles.th}>Approved</th>
                                <th style={styles.th}>Rejected</th>
                                <th style={styles.th}>Response Rate</th>
                                <th style={styles.th}>Avg Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responseData.byTeam.map((member, index) => (
                                <tr key={index} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.teamCell}>
                                            <FaUser size={12} color="#4A6F8F" />
                                            <span>{member.name}</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>{member.total}</td>
                                    <td style={styles.td}>{member.responded}</td>
                                    <td style={styles.td}>
                                        <span style={styles.approvedText}>{member.approved}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.rejectedText}>{member.rejected}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.progressContainer}>
                                            <div style={styles.progressBar}>
                                                <div style={styles.progressFill(member.responseRate)} />
                                            </div>
                                            <span style={styles.progressText}>{member.responseRate}%</span>
                                        </div>
                                    </td>
                                    <td style={styles.td}>{member.avgTime}h</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Daily/Weekly Trends */}
            {selectedView === 'daily' && (
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                        <FaChartLine style={styles.chartIcon} />
                        Daily Response Rate - {getFormattedMonthYear()}
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={responseData.daily}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6EDF5" />
                            <XAxis dataKey="day" stroke="#4A6F8F" />
                            <YAxis stroke="#4A6F8F" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="responseRate" name="Response Rate %" stroke={COLORS.blue} strokeWidth={2} />
                            <Line type="monotone" dataKey="total" name="Total Requests" stroke={COLORS.green} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {selectedView === 'weekly' && (
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>
                        <FaChartLine style={styles.chartIcon} />
                        Weekly Response Rate - {getFormattedMonthYear()}
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={responseData.weekly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E6EDF5" />
                            <XAxis dataKey="week" stroke="#4A6F8F" />
                            <YAxis stroke="#4A6F8F" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="responseRate" name="Response Rate %" fill={COLORS.blue} />
                            <Bar dataKey="avgResponseTime" name="Avg Time (hours)" fill={COLORS.green} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

// Styles (updated to use green instead of red where appropriate)
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
        flexWrap: "wrap",
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
    viewSelect: {
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
        minWidth: "150px",
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
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
    },
    metricCard: {
        background: "#FFFFFF",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        transition: "transform 0.2s ease",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(0, 51, 102, 0.1)",
        },
    },
    metricIcon: (color) => ({
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }),
    metricInfo: {
        display: "flex",
        flexDirection: "column",
    },
    metricValue: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#003366",
    },
    metricLabel: {
        fontSize: "13px",
        color: "#6B8BA4",
    },
    chartsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
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
    tableContainer: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        marginBottom: "30px",
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
    moduleDot: (color) => ({
        width: "10px",
        height: "10px",
        borderRadius: "5px",
        background: color,
    }),
    teamCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    approvedText: {
        color: "#10B981",
        fontWeight: "600",
    },
    rejectedText: {
        color: "#EF4444",
        fontWeight: "600",
    },
    progressContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    progressBar: {
        width: "80px",
        height: "6px",
        background: "#E6EDF5",
        borderRadius: "3px",
        overflow: "hidden",
    },
    progressFill: (width) => ({
        height: "100%",
        width: `${width}%`,
        background: "linear-gradient(90deg, #003366, #10B981)",
        borderRadius: "3px",
        transition: "width 0.3s ease",
    }),
    progressText: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
        minWidth: "40px",
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

export default ResponseRate;