import React, { useState } from "react";
import {
    FaUser,
    FaCreditCard,
    FaBook,
    FaBell,
    FaArrowUp,
    FaArrowDown,
    FaWallet,
    FaExchangeAlt,
    FaFileInvoiceDollar,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaUsers,
    FaBuilding,
    FaChartLine,
    FaChartPie,
    FaRupeeSign,
    FaCalendarAlt,
    FaEye,
    FaDownload,
    FaPrint,
    FaChevronRight,
    FaChevronLeft,
    FaShieldAlt,
    FaMobileAlt,
    FaLaptop,
    FaGlobe,
    FaLandmark,
    FaPiggyBank,
    FaHome,
    FaCar,
    FaShoppingCart,
    FaUtensils,
    FaFilm,
    FaPlane,
    FaHeart,
    FaEllipsisH,
    FaClipboardList,
    FaHourglassHalf,
    FaCheckDouble,
    FaBan
} from "react-icons/fa";

// Chart Components
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Dashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("month");

    // ============ REQUEST COUNTS DATA ============
    const requestCounts = {
        total: 284,
        pending: 89,
        approved: 156,
        rejected: 39,
        pendingChange: "+12%",
        approvedChange: "+8%",
        rejectedChange: "-5%"
    };

    // ============ REQUEST STATUS DATA FOR CHARTS ============
    const requestStatusData = [
        { name: "Approved", value: requestCounts.approved, color: "#10B981" },
        { name: "Pending", value: requestCounts.pending, color: "#F59E0B" },
        { name: "Rejected", value: requestCounts.rejected, color: "#EF4444" }
    ];

    // ============ MONTHLY REQUEST TRENDS ============
    const monthlyRequestTrends = [
        { month: "Jan", total: 210, pending: 65, approved: 120, rejected: 25 },
        { month: "Feb", total: 235, pending: 72, approved: 135, rejected: 28 },
        { month: "Mar", total: 248, pending: 78, approved: 142, rejected: 28 },
        { month: "Apr", total: 260, pending: 82, approved: 148, rejected: 30 },
        { month: "May", total: 275, pending: 86, approved: 155, rejected: 34 },
        { month: "Jun", total: 284, pending: 89, approved: 156, rejected: 39 }
    ];

    // ============ CHART COLORS ============
    const COLORS = {
        approved: "#10B981",
        pending: "#F59E0B",
        rejected: "#EF4444",
        total: "#003366"
    };

    return (
        <div style={styles.dashboard}>
            {/* Header Section */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>
                        <FaClipboardList size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Request Dashboard</h1>
                        <p style={styles.subtitle}>
                            Track and manage all service requests • Last updated: Today 10:30 AM
                        </p>
                    </div>
                </div>
                <div style={styles.headerRight}>
                    <div style={styles.periodSelector}>
                        <button
                            style={{
                                ...styles.periodBtn,
                                background: selectedPeriod === "week" ? "linear-gradient(135deg, #003366, #002244)" : "transparent",
                                color: selectedPeriod === "week" ? "#FFFFFF" : "#003366",
                                border: selectedPeriod === "week" ? "2px solid #FFD700" : "2px solid #E6EDF5"
                            }}
                            onClick={() => setSelectedPeriod("week")}
                        >
                            Week
                        </button>
                        <button
                            style={{
                                ...styles.periodBtn,
                                background: selectedPeriod === "month" ? "linear-gradient(135deg, #003366, #002244)" : "transparent",
                                color: selectedPeriod === "month" ? "#FFFFFF" : "#003366",
                                border: selectedPeriod === "month" ? "2px solid #FFD700" : "2px solid #E6EDF5"
                            }}
                            onClick={() => setSelectedPeriod("month")}
                        >
                            Month
                        </button>
                        <button
                            style={{
                                ...styles.periodBtn,
                                background: selectedPeriod === "year" ? "linear-gradient(135deg, #003366, #002244)" : "transparent",
                                color: selectedPeriod === "year" ? "#FFFFFF" : "#003366",
                                border: selectedPeriod === "year" ? "2px solid #FFD700" : "2px solid #E6EDF5"
                            }}
                            onClick={() => setSelectedPeriod("year")}
                        >
                            Year
                        </button>
                    </div>
                </div>
            </div>

            {/* Four Request Status Cards */}
            <div style={styles.summaryCards}>
                <RequestCard
                    title="Total Requests"
                    value={requestCounts.total}
                    icon={FaClipboardList}
                    color="#003366"
                    bg="linear-gradient(135deg, #003366, #002244)"
                />
                <RequestCard
                    title="Pending"
                    value={requestCounts.pending}
                    change={requestCounts.pendingChange}
                    icon={FaHourglassHalf}
                    color="#F59E0B"
                    bg="rgba(245, 158, 11, 0.1)"
                />
                <RequestCard
                    title="Approved"
                    value={requestCounts.approved}
                    change={requestCounts.approvedChange}
                    icon={FaCheckCircle}
                    color="#10B981"
                    bg="rgba(16, 185, 129, 0.1)"
                />
                <RequestCard
                    title="Rejected"
                    value={requestCounts.rejected}
                    change={requestCounts.rejectedChange}
                    icon={FaTimesCircle}
                    color="#EF4444"
                    bg="rgba(239, 68, 68, 0.1)"
                />
            </div>

            {/* Two Charts Row */}
            <div style={styles.chartsRow}>
                {/* Bar Chart - Monthly Request Trends */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <div>
                            <h3 style={styles.chartTitle}>Monthly Request Trends</h3>
                            <p style={styles.chartSubtitle}>Last 6 months</p>
                        </div>
                        <div style={styles.legend}>
                            <span style={styles.legendItem}>
                                <span style={{ ...styles.legendDot, background: COLORS.total }}></span>
                                Total
                            </span>
                            <span style={styles.legendItem}>
                                <span style={{ ...styles.legendDot, background: COLORS.approved }}></span>
                                Approved
                            </span>
                            <span style={styles.legendItem}>
                                <span style={{ ...styles.legendDot, background: COLORS.pending }}></span>
                                Pending
                            </span>
                            <span style={styles.legendItem}>
                                <span style={{ ...styles.legendDot, background: COLORS.rejected }}></span>
                                Rejected
                            </span>
                        </div>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyRequestTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E6EDF5" />
                                <XAxis dataKey="month" tick={{ fill: '#4A6F8F' }} />
                                <YAxis tick={{ fill: '#4A6F8F' }} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#FFFFFF',
                                        border: '1px solid #FFD700',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,51,102,0.1)'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="total" fill={COLORS.total} radius={[6, 6, 0, 0]} />
                                <Bar dataKey="approved" fill={COLORS.approved} radius={[6, 6, 0, 0]} />
                                <Bar dataKey="pending" fill={COLORS.pending} radius={[6, 6, 0, 0]} />
                                <Bar dataKey="rejected" fill={COLORS.rejected} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Request Distribution - FIXED ALIGNMENT */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <div>
                            <h3 style={styles.chartTitle}>Request Distribution</h3>
                            <p style={styles.chartSubtitle}>Current status breakdown</p>
                        </div>
                    </div>
                    <div style={styles.pieChartContainer}>
                        <div style={styles.pieWrapper}>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={requestStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        innerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {requestStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: '#FFFFFF',
                                            border: '1px solid #FFD700',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0,51,102,0.1)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={styles.pieLegend}>
                            {requestStatusData.map((item, index) => (
                                <div key={index} style={styles.pieLegendItem}>
                                    <span style={{ ...styles.pieLegendDot, background: item.color }}></span>
                                    <span style={styles.pieLegendName}>{item.name}</span>
                                    <span style={styles.pieLegendValue}>{item.value}</span>
                                    <span style={styles.pieLegendPercent}>
                                        ({((item.value / requestCounts.total) * 100).toFixed(1)}%)
                                    </span>
                                </div>
                            ))}
                            <div style={{...styles.pieLegendItem, marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #E6EDF5'}}>
                                <span style={{ ...styles.pieLegendDot, background: COLORS.total }}></span>
                                <span style={styles.pieLegendName}>Total</span>
                                <span style={styles.pieLegendValue}>{requestCounts.total}</span>
                                <span style={styles.pieLegendPercent}>(100%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Stats Row */}
            <div style={styles.summaryStatsRow}>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Approval Rate</span>
                    <span style={styles.statValue}>{((requestCounts.approved / requestCounts.total) * 100).toFixed(1)}%</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Pending Rate</span>
                    <span style={styles.statValue}>{((requestCounts.pending / requestCounts.total) * 100).toFixed(1)}%</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Rejection Rate</span>
                    <span style={styles.statValue}>{((requestCounts.rejected / requestCounts.total) * 100).toFixed(1)}%</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statLabel}>Avg. Processing Time</span>
                    <span style={styles.statValue}>3.2 days</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActions}>
                <button style={styles.quickActionBtn}>
                    <FaFileInvoiceDollar size={16} />
                    New Request
                </button>
                <button style={styles.quickActionBtn}>
                    <FaHourglassHalf size={16} />
                    View Pending
                </button>
                <button style={styles.quickActionBtn}>
                    <FaCheckCircle size={16} />
                    View Approved
                </button>
                <button style={styles.quickActionBtn}>
                    <FaDownload size={16} />
                    Export Report
                </button>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <p style={styles.footerText}>
                    Last updated: Today, 10:30 AM • Data refreshes every 5 minutes
                </p>
            </div>
        </div>
    );
};

// ============ REUSABLE COMPONENTS ============

// Request Card Component
const RequestCard = ({ title, value, change, icon: Icon, color, bg }) => {
    const isPositive = change?.includes('+');
    
    return (
        <div style={styles.summaryCard}>
            <div style={{ ...styles.summaryIcon, background: bg }}>
                <Icon style={{ color: color }} size={20} />
            </div>
            <div style={styles.summaryContent}>
                <span style={styles.summaryTitle}>{title}</span>
                <div style={styles.summaryValueRow}>
                    <span style={styles.summaryValue}>{value}</span>
                    {change && (
                        <span style={{
                            ...styles.summaryChange,
                            color: isPositive ? '#10B981' : '#EF4444'
                        }}>
                            {change}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============ STYLES ============
const styles = {
    dashboard: {
        padding: "30px",
        background: "#F5F9FF",
        minHeight: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
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
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    periodSelector: {
        display: "flex",
        gap: "8px",
        background: "#FFFFFF",
        padding: "4px",
        borderRadius: "14px",
        border: "1px solid #E6EDF5",
    },
    periodBtn: {
        padding: "8px 16px",
        borderRadius: "12px",
        border: "2px solid transparent",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    summaryCards: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "20px",
    },
    summaryCard: {
        background: "#FFFFFF",
        padding: "20px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        transition: "all 0.2s ease",
    },
    summaryIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    summaryContent: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: "13px",
        color: "#4A6F8F",
        fontWeight: "500",
    },
    summaryValueRow: {
        display: "flex",
        alignItems: "baseline",
        gap: "8px",
        marginTop: "4px",
    },
    summaryValue: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#003366",
    },
    summaryChange: {
        fontSize: "12px",
        fontWeight: "600",
    },
    chartsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        marginBottom: "20px",
    },
    chartCard: {
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(0, 51, 102, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
    },
    chartHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    chartTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#003366",
        margin: 0,
    },
    chartSubtitle: {
        fontSize: "12px",
        color: "#4A6F8F",
        margin: "4px 0 0",
    },
    legend: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
    },
    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        color: "#4A6F8F",
    },
    legendDot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
    },
    chartContainer: {
        width: "100%",
        height: "300px",
    },
    // Fixed styles for pie chart
    pieChartContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "20px",
        height: "300px",
    },
    pieWrapper: {
        flex: "1",
        height: "250px",
        minWidth: "250px",
    },
    pieLegend: {
        flex: "0.8",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "0 10px",
    },
    pieLegendItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
    },
    pieLegendDot: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
    },
    pieLegendName: {
        flex: "1",
        color: "#4A6F8F",
    },
    pieLegendValue: {
        fontWeight: "600",
        color: "#003366",
        marginRight: "4px",
    },
    pieLegendPercent: {
        color: "#8DA6C0",
        fontSize: "11px",
    },
    summaryStatsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "20px",
        background: "#FFFFFF",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
    },
    statItem: {
        textAlign: "center",
        padding: "0 10px",
        borderRight: "1px solid #E6EDF5",
    },
    statLabel: {
        display: "block",
        fontSize: "12px",
        color: "#4A6F8F",
        marginBottom: "4px",
    },
    statValue: {
        display: "block",
        fontSize: "20px",
        fontWeight: "700",
        color: "#003366",
    },
    quickActions: {
        display: "flex",
        gap: "16px",
        marginBottom: "30px",
    },
    quickActionBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        borderRadius: "14px",
        color: "#003366",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        flex: 1,
        justifyContent: "center",
    },
    footer: {
        textAlign: "center",
        padding: "20px 0",
    },
    footerText: {
        fontSize: "12px",
        color: "#8DA6C0",
        margin: 0,
    }
};

export default Dashboard;