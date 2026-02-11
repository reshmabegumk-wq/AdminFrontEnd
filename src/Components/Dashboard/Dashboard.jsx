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
    FaEllipsisH
} from "react-icons/fa";

// Chart Components (Using Recharts - install with: npm install recharts)
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
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    RadialBarChart,
    RadialBar,
    ScatterChart,
    Scatter,
    ZAxis
} from 'recharts';

const Dashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("month");
    const [selectedAccount, setSelectedAccount] = useState("all");
    const [currentSlide, setCurrentSlide] = useState(0);

    // ============ DUMMY DATA - ACCOUNTS ============
    const accounts = [
        { id: 1, type: "Savings", number: "XXXX XXXX 4582", balance: "₹1,25,750.00", cardStatus: "Active", linkedCards: 2, interest: "3.5%", openDate: "2019-05-15" },
        { id: 2, type: "Current", number: "XXXX XXXX 7891", balance: "₹3,50,200.00", cardStatus: "Active", linkedCards: 1, interest: "0%", openDate: "2020-08-22" },
        { id: 3, type: "Salary", number: "XXXX XXXX 1234", balance: "₹75,500.00", cardStatus: "Active", linkedCards: 1, interest: "4.0%", openDate: "2022-01-10" },
        { id: 4, type: "Fixed Deposit", number: "XXXX XXXX 5678", balance: "₹5,00,000.00", cardStatus: "N/A", linkedCards: 0, interest: "7.2%", openDate: "2021-11-05", maturityDate: "2024-11-05" }
    ];

    // ============ DUMMY DATA - TRANSACTIONS ============
    const recentTransactions = [
        { id: 1, date: "2024-03-15", description: "Amazon.in", category: "Shopping", amount: "₹2,499.00", type: "debit", status: "completed", card: "HDFC Visa Platinum" },
        { id: 2, date: "2024-03-15", description: "Salary Credit", category: "Income", amount: "₹85,000.00", type: "credit", status: "completed", card: "Salary Account" },
        { id: 3, date: "2024-03-14", description: "Starbucks Coffee", category: "Food & Drink", amount: "₹450.00", type: "debit", status: "completed", card: "HDFC Visa Platinum" },
        { id: 4, date: "2024-03-14", description: "Electricity Bill", category: "Utilities", amount: "₹2,800.00", type: "debit", status: "completed", card: "Savings Account" },
        { id: 5, date: "2024-03-13", description: "Zomato Order", category: "Food & Drink", amount: "₹890.00", type: "debit", status: "completed", card: "HDFC Visa Platinum" },
        { id: 6, date: "2024-03-13", description: "Mobile Recharge", category: "Utilities", amount: "₹599.00", type: "debit", status: "completed", card: "Savings Account" },
        { id: 7, date: "2024-03-12", description: "Uber Ride", category: "Transport", amount: "₹350.00", type: "debit", status: "completed", card: "HDFC Visa Platinum" },
        { id: 8, date: "2024-03-12", description: "Netflix Subscription", category: "Entertainment", amount: "₹649.00", type: "debit", status: "completed", card: "HDFC Visa Platinum" },
        { id: 9, date: "2024-03-11", description: "Interest Credit", category: "Income", amount: "₹1,250.00", type: "credit", status: "completed", card: "Savings Account" },
        { id: 10, date: "2024-03-11", description: "EMI Payment", category: "Loan", amount: "₹12,500.00", type: "debit", status: "completed", card: "Current Account" },
        { id: 11, date: "2024-03-10", description: "Swiggy Order", category: "Food & Drink", amount: "₹650.00", type: "debit", status: "completed", card: "HDFC Visa Platinum" },
        { id: 12, date: "2024-03-10", description: "Petrol Pump", category: "Transport", amount: "₹1,200.00", type: "debit", status: "completed", card: "HDFC Visa Platinum" }
    ];

    // ============ DUMMY DATA - MONTHLY SPENDING ============
    const monthlySpending = [
        { month: "Jan", spending: 24500, income: 85000, savings: 60500 },
        { month: "Feb", spending: 28900, income: 85000, savings: 56100 },
        { month: "Mar", spending: 32450, income: 85000, savings: 52550 },
        { month: "Apr", spending: 27800, income: 82000, savings: 54200 },
        { month: "May", spending: 31200, income: 82000, savings: 50800 },
        { month: "Jun", spending: 29500, income: 85000, savings: 55500 },
        { month: "Jul", spending: 35600, income: 85000, savings: 49400 },
        { month: "Aug", spending: 34200, income: 92000, savings: 57800 },
        { month: "Sep", spending: 28900, income: 92000, savings: 63100 },
        { month: "Oct", spending: 31200, income: 92000, savings: 60800 },
        { month: "Nov", spending: 33400, income: 95000, savings: 61600 },
        { month: "Dec", spending: 45800, income: 95000, savings: 49200 }
    ];

    // ============ DUMMY DATA - CATEGORY SPENDING ============
    const categorySpending = [
        { name: "Shopping", value: 18500, color: "#8B5CF6", icon: FaShoppingCart },
        { name: "Food & Drink", value: 12400, color: "#F59E0B", icon: FaUtensils },
        { name: "Transport", value: 6800, color: "#3B82F6", icon: FaCar },
        { name: "Utilities", value: 5400, color: "#10B981", icon: FaHome },
        { name: "Entertainment", value: 4200, color: "#EF4444", icon: FaFilm },
        { name: "Travel", value: 3800, color: "#8B5CF6", icon: FaPlane },
        { name: "Healthcare", value: 2800, color: "#EC4899", icon: FaHeart },
        { name: "Others", value: 3500, color: "#6B8BA4", icon: FaEllipsisH }
    ];

    // ============ DUMMY DATA - INVESTMENTS ============
    const investments = [
        { id: 1, name: "Fixed Deposit", value: "₹5,00,000", returns: "7.2%", type: "FD", maturity: "2024-11-05" },
        { id: 2, name: "Mutual Fund - Equity", value: "₹2,50,000", returns: "12.5%", type: "MF", nav: "₹85.40" },
        { id: 3, name: "Mutual Fund - Debt", value: "₹1,50,000", returns: "8.2%", type: "MF", nav: "₹42.30" },
        { id: 4, name: "PPF", value: "₹3,00,000", returns: "7.1%", type: "PPF", maturity: "2030-08-15" },
        { id: 5, name: "Stocks", value: "₹1,80,000", returns: "15.8%", type: "Equity", quantity: "45" }
    ];

    // ============ DUMMY DATA - CARDS ============
    const cards = [
        { id: 1, type: "Visa Platinum", number: "XXXX XXXX XXXX 4582", holder: "Rajesh Sharma", limit: "₹3,00,000", used: "₹1,25,750", available: "₹1,74,250", status: "active", expiry: "05/28" },
        { id: 2, type: "Mastercard World", number: "XXXX XXXX XXXX 7891", holder: "Rajesh Sharma", limit: "₹5,00,000", used: "₹2,30,500", available: "₹2,69,500", status: "active", expiry: "08/27" },
        { id: 3, type: "RuPay Platinum", number: "XXXX XXXX XXXX 1234", holder: "Rajesh Sharma", limit: "₹1,50,000", used: "₹45,200", available: "₹1,04,800", status: "active", expiry: "12/26" }
    ];

    // ============ DUMMY DATA - LOANS ============
    const loans = [
        { id: 1, type: "Home Loan", amount: "₹45,00,000", emi: "₹38,500", tenure: "20 years", paid: "12 years", remaining: "8 years", status: "active" },
        { id: 2, type: "Car Loan", amount: "₹8,50,000", emi: "₹15,800", tenure: "5 years", paid: "2 years", remaining: "3 years", status: "active" },
        { id: 3, type: "Personal Loan", amount: "₹2,00,000", emi: "₹6,200", tenure: "3 years", paid: "1 year", remaining: "2 years", status: "active" }
    ];

    // ============ DUMMY DATA - SERVICE REQUESTS ============
    const serviceRequests = [
        { id: "SR-2024-001", type: "Cheque Book", date: "2024-03-15", status: "pending", priority: "medium" },
        { id: "SR-2024-002", type: "Limit Increase", date: "2024-03-14", status: "approved", priority: "high" },
        { id: "SR-2024-003", type: "Stolen Card", date: "2024-03-10", status: "resolved", priority: "high" },
        { id: "SR-2024-004", type: "Address Change", date: "2024-03-08", status: "processing", priority: "low" }
    ];

    // ============ DUMMY DATA - GOALS ============
    const goals = [
        { id: 1, name: "Emergency Fund", target: "₹5,00,000", current: "₹3,50,000", progress: 70, deadline: "Dec 2024" },
        { id: 2, name: "Vacation Fund", target: "₹2,00,000", current: "₹85,000", progress: 42, deadline: "Jun 2024" },
        { id: 3, name: "Down Payment", target: "₹15,00,000", current: "₹6,00,000", progress: 40, deadline: "Dec 2025" }
    ];

    // ============ DUMMY DATA - BUDGET ============
    const budget = [
        { category: "Shopping", budget: 20000, spent: 18500, remaining: 1500 },
        { category: "Food", budget: 15000, spent: 12400, remaining: 2600 },
        { category: "Transport", budget: 8000, spent: 6800, remaining: 1200 },
        { category: "Utilities", budget: 6000, spent: 5400, remaining: 600 },
        { category: "Entertainment", budget: 5000, spent: 4200, remaining: 800 }
    ];

    // ============ CHART COLORS ============
    const COLORS = ['#003366', '#FFD700', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#EC4899'];

    // ============ SUMMARY STATS ============
    const summaryStats = {
        totalBalance: "₹10,51,450.00",
        monthlyIncome: "₹85,000",
        monthlySpending: "₹32,450",
        savingsRate: "62%",
        creditScore: "780",
        totalInvestments: "₹13,80,000",
        totalLoans: "₹55,50,000",
        totalCards: 3,
        pendingRequests: 1
    };

    // ============ STATUS BADGE ============
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            active: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", text: "Active" },
            pending: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", text: "Pending" },
            completed: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", text: "Completed" },
            resolved: { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)", text: "Resolved" },
            processing: { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", text: "Processing" },
            approved: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", text: "Approved" }
        };

        const config = statusConfig[status] || statusConfig.active;

        return (
            <span style={{
                padding: "4px 10px",
                background: config.bg,
                color: config.color,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
            }}>
                {config.text}
            </span>
        );
    };

    return (
        <div style={styles.dashboard}>
            {/* Header Section */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>
                        <FaChartLine size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Dashboard Overview</h1>
                        <p style={styles.subtitle}>
                            Welcome back, Rajesh Sharma • Last login: Today 9:30 AM
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

            {/* Summary Cards Row 1 - Financial Overview */}
            <div style={styles.summaryCards}>
                <SummaryCard
                    title="Total Balance"
                    value={summaryStats.totalBalance}
                    change="+2.5%"
                    icon={FaWallet}
                    color="#003366"
                    bg="linear-gradient(135deg, #003366, #002244)"
                />
                <SummaryCard
                    title="Monthly Income"
                    value={summaryStats.monthlyIncome}
                    change="+5.2%"
                    icon={FaArrowUp}
                    color="#10B981"
                    bg="rgba(16, 185, 129, 0.1)"
                />
                <SummaryCard
                    title="Monthly Spending"
                    value={summaryStats.monthlySpending}
                    change="-3.1%"
                    icon={FaArrowDown}
                    color="#EF4444"
                    bg="rgba(239, 68, 68, 0.1)"
                />
                <SummaryCard
                    title="Savings Rate"
                    value={summaryStats.savingsRate}
                    change="+8%"
                    icon={FaPiggyBank}
                    color="#F59E0B"
                    bg="rgba(245, 158, 11, 0.1)"
                />
            </div>

            {/* Summary Cards Row 2 - Banking Overview */}
            <div style={styles.summaryCards}>
                <SummaryCard
                    title="Credit Score"
                    value={summaryStats.creditScore}
                    subtitle="Excellent"
                    icon={FaShieldAlt}
                    color="#8B5CF6"
                    bg="rgba(139, 92, 246, 0.1)"
                />
                <SummaryCard
                    title="Total Investments"
                    value={summaryStats.totalInvestments}
                    subtitle="+12.5% returns"
                    icon={FaChartLine}
                    color="#3B82F6"
                    bg="rgba(59, 130, 246, 0.1)"
                />
                <SummaryCard
                    title="Total Loans"
                    value={summaryStats.totalLoans}
                    subtitle="3 active loans"
                    icon={FaHome}
                    color="#EF4444"
                    bg="rgba(239, 68, 68, 0.1)"
                />
                <SummaryCard
                    title="Active Cards"
                    value={summaryStats.totalCards}
                    subtitle="3 cards"
                    icon={FaCreditCard}
                    color="#FFD700"
                    bg="rgba(255, 215, 0, 0.1)"
                />
            </div>

            {/* Charts Row 1 - Income vs Spending & Category Distribution */}
            <div style={styles.chartsRow}>
                {/* Bar Chart - Income vs Spending */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <div>
                            <h3 style={styles.chartTitle}>Income vs Spending</h3>
                            <p style={styles.chartSubtitle}>Last 12 months</p>
                        </div>
                        <div style={styles.legend}>
                            <span style={styles.legendItem}>
                                <span style={{ ...styles.legendDot, background: "#003366" }}></span>
                                Income
                            </span>
                            <span style={styles.legendItem}>
                                <span style={{ ...styles.legendDot, background: "#FFD700" }}></span>
                                Spending
                            </span>
                        </div>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlySpending} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                                <Bar dataKey="income" fill="#003366" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="spending" fill="#FFD700" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Spending by Category */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <div>
                            <h3 style={styles.chartTitle}>Spending by Category</h3>
                            <p style={styles.chartSubtitle}>This month</p>
                        </div>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categorySpending}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categorySpending.map((entry, index) => (
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
                        <div style={styles.categoryLegend}>
                            {categorySpending.slice(0, 4).map((item, index) => (
                                <div key={index} style={styles.categoryItem}>
                                    <span style={{ ...styles.categoryDot, background: item.color }}></span>
                                    <span style={styles.categoryName}>{item.name}</span>
                                    <span style={styles.categoryValue}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 - Savings Trend & Investment Portfolio */}
            <div style={styles.chartsRow}>
                {/* Area Chart - Savings Trend */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <div>
                            <h3 style={styles.chartTitle}>Savings Trend</h3>
                            <p style={styles.chartSubtitle}>Monthly savings accumulation</p>
                        </div>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlySpending} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                                <Area 
                                    type="monotone" 
                                    dataKey="savings" 
                                    stroke="#10B981" 
                                    fill="rgba(16, 185, 129, 0.1)" 
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radial Bar Chart - Goals Progress */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <div>
                            <h3 style={styles.chartTitle}>Financial Goals</h3>
                            <p style={styles.chartSubtitle}>Progress tracking</p>
                        </div>
                    </div>
                    <div style={styles.goalsContainer}>
                        {goals.map((goal, index) => (
                            <div key={index} style={styles.goalItem}>
                                <div style={styles.goalInfo}>
                                    <span style={styles.goalName}>{goal.name}</span>
                                    <span style={styles.goalTarget}>{goal.target}</span>
                                </div>
                                <div style={styles.progressBarContainer}>
                                    <div 
                                        style={{
                                            ...styles.progressBar,
                                            width: `${goal.progress}%`,
                                            background: COLORS[index % COLORS.length]
                                        }}
                                    ></div>
                                </div>
                                <div style={styles.goalStats}>
                                    <span style={styles.goalCurrent}>{goal.current}</span>
                                    <span style={styles.goalDeadline}>{goal.deadline}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Accounts Overview Section */}
            <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                    <div style={styles.sectionTitleGroup}>
                        <FaLandmark style={{ color: "#FFD700", fontSize: "20px" }} />
                        <h2 style={styles.sectionTitle}>Accounts Overview</h2>
                    </div>
                    <select 
                        style={styles.accountSelector}
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                        <option value="all">All Accounts</option>
                        <option value="savings">Savings</option>
                        <option value="current">Current</option>
                        <option value="fd">Fixed Deposit</option>
                    </select>
                </div>
                <div style={styles.accountsGrid}>
                    {accounts.map((account, index) => (
                        <div key={index} style={styles.accountCard}>
                            <div style={styles.accountHeader}>
                                <div style={styles.accountType}>
                                    <FaBuilding style={{ color: "#FFD700", fontSize: "14px" }} />
                                    <span style={styles.accountTypeText}>{account.type}</span>
                                </div>
                                <span style={styles.accountNumber}>{account.number}</span>
                            </div>
                            <div style={styles.accountBody}>
                                <div style={styles.accountBalance}>
                                    <span style={styles.balanceLabel}>Balance</span>
                                    <span style={styles.balanceValue}>{account.balance}</span>
                                </div>
                                <div style={styles.accountDetails}>
                                    <div style={styles.accountDetail}>
                                        <span style={styles.detailLabel}>Interest Rate</span>
                                        <span style={styles.detailValue}>{account.interest}</span>
                                    </div>
                                    <div style={styles.accountDetail}>
                                        <span style={styles.detailLabel}>Opened</span>
                                        <span style={styles.detailValue}>{account.openDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cards & Loans Row */}
            <div style={styles.splitRow}>
                {/* Credit Cards */}
                <div style={styles.splitCard}>
                    <div style={styles.splitHeader}>
                        <div style={styles.sectionTitleGroup}>
                            <FaCreditCard style={{ color: "#FFD700", fontSize: "20px" }} />
                            <h2 style={styles.sectionTitle}>Credit Cards</h2>
                        </div>
                        <span style={styles.viewAll}>View All</span>
                    </div>
                    <div style={styles.cardsList}>
                        {cards.map((card, index) => (
                            <div key={index} style={styles.cardItem}>
                                <div style={styles.cardHeader}>
                                    <div>
                                        <span style={styles.cardType}>{card.type}</span>
                                        <span style={styles.cardNumber}>{card.number}</span>
                                    </div>
                                    <StatusBadge status={card.status} />
                                </div>
                                <div style={styles.cardLimit}>
                                    <div style={styles.limitInfo}>
                                        <span style={styles.limitLabel}>Limit</span>
                                        <span style={styles.limitValue}>{card.limit}</span>
                                    </div>
                                    <div style={styles.limitInfo}>
                                        <span style={styles.limitLabel}>Used</span>
                                        <span style={styles.limitUsed}>{card.used}</span>
                                    </div>
                                    <div style={styles.limitInfo}>
                                        <span style={styles.limitLabel}>Available</span>
                                        <span style={styles.limitAvailable}>{card.available}</span>
                                    </div>
                                </div>
                                <div style={styles.cardFooter}>
                                    <span style={styles.cardExpiry}>Expires: {card.expiry}</span>
                                    <button style={styles.cardAction}>
                                        <FaEye size={12} />
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Loans */}
                <div style={styles.splitCard}>
                    <div style={styles.splitHeader}>
                        <div style={styles.sectionTitleGroup}>
                            <FaHome style={{ color: "#FFD700", fontSize: "20px" }} />
                            <h2 style={styles.sectionTitle}>Active Loans</h2>
                        </div>
                        <span style={styles.viewAll}>View All</span>
                    </div>
                    <div style={styles.loansList}>
                        {loans.map((loan, index) => (
                            <div key={index} style={styles.loanItem}>
                                <div style={styles.loanHeader}>
                                    <span style={styles.loanType}>{loan.type}</span>
                                    <StatusBadge status={loan.status} />
                                </div>
                                <div style={styles.loanAmount}>
                                    <span style={styles.loanAmountLabel}>Loan Amount</span>
                                    <span style={styles.loanAmountValue}>{loan.amount}</span>
                                </div>
                                <div style={styles.loanDetails}>
                                    <div style={styles.loanDetail}>
                                        <span style={styles.loanDetailLabel}>EMI</span>
                                        <span style={styles.loanDetailValue}>{loan.emi}</span>
                                    </div>
                                    <div style={styles.loanDetail}>
                                        <span style={styles.loanDetailLabel}>Tenure</span>
                                        <span style={styles.loanDetailValue}>{loan.tenure}</span>
                                    </div>
                                    <div style={styles.loanDetail}>
                                        <span style={styles.loanDetailLabel}>Remaining</span>
                                        <span style={styles.loanDetailValue}>{loan.remaining}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Investments Section */}
            <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                    <div style={styles.sectionTitleGroup}>
                        <FaChartLine style={{ color: "#FFD700", fontSize: "20px" }} />
                        <h2 style={styles.sectionTitle}>Investment Portfolio</h2>
                    </div>
                    <span style={styles.totalValue}>Total: {summaryStats.totalInvestments}</span>
                </div>
                <div style={styles.investmentsGrid}>
                    {investments.map((investment, index) => (
                        <div key={index} style={styles.investmentCard}>
                            <div style={styles.investmentIcon}>
                                {investment.type === "FD" && <FaPiggyBank color="#003366" />}
                                {investment.type === "MF" && <FaChartLine color="#003366" />}
                                {investment.type === "PPF" && <FaShieldAlt color="#003366" />}
                                {investment.type === "Equity" && <FaArrowUp color="#003366" />}
                            </div>
                            <div style={styles.investmentInfo}>
                                <span style={styles.investmentName}>{investment.name}</span>
                                <span style={styles.investmentValue}>{investment.value}</span>
                                <span style={styles.investmentReturns}>Returns: {investment.returns}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Budget vs Actual */}
            <div style={styles.sectionCard}>
                <div style={styles.sectionHeader}>
                    <div style={styles.sectionTitleGroup}>
                        <FaWallet style={{ color: "#FFD700", fontSize: "20px" }} />
                        <h2 style={styles.sectionTitle}>Budget vs Actual</h2>
                    </div>
                    <span style={styles.monthLabel}>March 2024</span>
                </div>
                <div style={styles.budgetContainer}>
                    {budget.map((item, index) => (
                        <div key={index} style={styles.budgetItem}>
                            <div style={styles.budgetCategory}>
                                <span style={styles.categoryName}>{item.category}</span>
                                <span style={styles.budgetAmount}>₹{item.budget.toLocaleString()}</span>
                            </div>
                            <div style={styles.budgetProgressContainer}>
                                <div 
                                    style={{
                                        ...styles.budgetProgress,
                                        width: `${(item.spent / item.budget) * 100}%`,
                                        background: (item.spent / item.budget) > 0.9 ? '#EF4444' : '#10B981'
                                    }}
                                ></div>
                            </div>
                            <div style={styles.budgetStats}>
                                <span style={styles.spentAmount}>Spent: ₹{item.spent.toLocaleString()}</span>
                                <span style={styles.remainingAmount}>Remaining: ₹{item.remaining.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Transactions & Service Requests Row */}
            <div style={styles.splitRow}>
                {/* Recent Transactions */}
                <div style={styles.splitCard}>
                    <div style={styles.splitHeader}>
                        <div style={styles.sectionTitleGroup}>
                            <FaExchangeAlt style={{ color: "#FFD700", fontSize: "20px" }} />
                            <h2 style={styles.sectionTitle}>Recent Transactions</h2>
                        </div>
                        <span style={styles.viewAll}>View All</span>
                    </div>
                    <div style={styles.transactionsList}>
                        {recentTransactions.slice(0, 6).map((transaction, index) => (
                            <div key={index} style={styles.transactionItem}>
                                <div style={styles.transactionIcon}>
                                    {transaction.type === 'credit' ? (
                                        <FaArrowUp style={{ color: '#10B981', transform: 'rotate(45deg)' }} />
                                    ) : (
                                        <FaArrowDown style={{ color: '#EF4444', transform: 'rotate(-45deg)' }} />
                                    )}
                                </div>
                                <div style={styles.transactionInfo}>
                                    <span style={styles.transactionDescription}>{transaction.description}</span>
                                    <span style={styles.transactionCategory}>{transaction.category}</span>
                                </div>
                                <div style={styles.transactionAmount}>
                                    <span style={{
                                        ...styles.amount,
                                        color: transaction.type === 'credit' ? '#10B981' : '#EF4444'
                                    }}>
                                        {transaction.type === 'credit' ? '+' : '-'} {transaction.amount}
                                    </span>
                                    <span style={styles.transactionDate}>{transaction.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Requests */}
                <div style={styles.splitCard}>
                    <div style={styles.splitHeader}>
                        <div style={styles.sectionTitleGroup}>
                            <FaFileInvoiceDollar style={{ color: "#FFD700", fontSize: "20px" }} />
                            <h2 style={styles.sectionTitle}>Service Requests</h2>
                        </div>
                        <span style={styles.viewAll}>View All</span>
                    </div>
                    <div style={styles.requestsList}>
                        {serviceRequests.map((request, index) => (
                            <div key={index} style={styles.requestItem}>
                                <div style={styles.requestHeader}>
                                    <span style={styles.requestId}>{request.id}</span>
                                    <StatusBadge status={request.status} />
                                </div>
                                <div style={styles.requestInfo}>
                                    <span style={styles.requestType}>{request.type}</span>
                                    <span style={styles.requestDate}>
                                        <FaCalendarAlt style={{ marginRight: "6px", color: "#FFD700", fontSize: "10px" }} />
                                        {request.date}
                                    </span>
                                </div>
                                <div style={styles.requestPriority}>
                                    <span style={styles.priorityLabel}>Priority:</span>
                                    <span style={{
                                        ...styles.priorityValue,
                                        color: request.priority === 'high' ? '#EF4444' : 
                                               request.priority === 'medium' ? '#F59E0B' : '#10B981'
                                    }}>
                                        {request.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActions}>
                <button style={styles.quickActionBtn}>
                    <FaCreditCard size={16} />
                    Apply for Card
                </button>
                <button style={styles.quickActionBtn}>
                    <FaBook size={16} />
                    Request Cheque Book
                </button>
                <button style={styles.quickActionBtn}>
                    <FaArrowUp size={16} />
                    Increase Limit
                </button>
                <button style={styles.quickActionBtn}>
                    <FaFileInvoiceDollar size={16} />
                    Statement Download
                </button>
                <button style={styles.quickActionBtn}>
                    <FaBell size={16} />
                    Manage Alerts
                </button>
            </div>

            {/* Footer - Last Updated */}
            <div style={styles.footer}>
                <p style={styles.footerText}>
                    Last updated: Today, 10:30 AM • Data refreshes every 5 minutes
                </p>
            </div>
        </div>
    );
};

// ============ REUSABLE COMPONENTS ============

// Summary Card Component
const SummaryCard = ({ title, value, subtitle, change, icon: Icon, color, bg }) => {
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
                {subtitle && <span style={styles.summarySubtitle}>{subtitle}</span>}
            </div>
        </div>
    );
};

// ============ STYLES ============
const styles = {
    dashboard: {
        padding: "30px",
        background: "#F5F9FF",
        minHeight: "200vh",
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
    downloadBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: "#FFFFFF",
        border: "2px solid #FFD700",
        borderRadius: "12px",
        color: "#003366",
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
        fontSize: "20px",
        fontWeight: "700",
        color: "#003366",
    },
    summaryChange: {
        fontSize: "12px",
        fontWeight: "600",
    },
    summarySubtitle: {
        fontSize: "11px",
        color: "#6B8BA4",
        marginTop: "4px",
        display: "block",
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
    categoryLegend: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
        marginTop: "20px",
        padding: "0 20px",
    },
    categoryItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    categoryDot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
    },
    categoryName: {
        fontSize: "12px",
        color: "#4A6F8F",
        flex: 1,
    },
    categoryValue: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#003366",
    },
    goalsContainer: {
        padding: "10px 0",
    },
    goalItem: {
        marginBottom: "20px",
    },
    goalInfo: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
    },
    goalName: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    },
    goalTarget: {
        fontSize: "13px",
        color: "#4A6F8F",
    },
    progressBarContainer: {
        width: "100%",
        height: "8px",
        background: "#E6EDF5",
        borderRadius: "4px",
        marginBottom: "6px",
    },
    progressBar: {
        height: "100%",
        borderRadius: "4px",
        transition: "width 0.3s ease",
    },
    goalStats: {
        display: "flex",
        justifyContent: "space-between",
    },
    goalCurrent: {
        fontSize: "12px",
        color: "#10B981",
        fontWeight: "600",
    },
    goalDeadline: {
        fontSize: "12px",
        color: "#6B8BA4",
    },
    sectionCard: {
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(0, 51, 102, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        marginBottom: "20px",
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    sectionTitleGroup: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    sectionTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#003366",
        margin: 0,
    },
    accountSelector: {
        padding: "8px 16px",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        fontSize: "13px",
        color: "#003366",
        fontWeight: "500",
        background: "#FFFFFF",
        cursor: "pointer",
        outline: "none",
    },
    accountsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
    },
    accountCard: {
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "16px",
        border: "1px solid #E6EDF5",
    },
    accountHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    accountType: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    accountTypeText: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    },
    accountNumber: {
        fontSize: "12px",
        color: "#4A6F8F",
        fontFamily: "monospace",
    },
    accountBody: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    accountBalance: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    balanceLabel: {
        fontSize: "11px",
        color: "#6B8BA4",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    balanceValue: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#003366",
    },
    accountDetails: {
        display: "flex",
        justifyContent: "space-between",
    },
    accountDetail: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    detailLabel: {
        fontSize: "10px",
        color: "#8DA6C0",
    },
    detailValue: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#003366",
    },
    splitRow: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        marginBottom: "20px",
    },
    splitCard: {
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(0, 51, 102, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
    },
    splitHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    viewAll: {
        fontSize: "13px",
        color: "#FFD700",
        fontWeight: "600",
        cursor: "pointer",
    },
    cardsList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    cardItem: {
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "16px",
        border: "1px solid #E6EDF5",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    cardType: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
        display: "block",
        marginBottom: "4px",
    },
    cardNumber: {
        fontSize: "12px",
        color: "#4A6F8F",
        fontFamily: "monospace",
    },
    cardLimit: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
        marginBottom: "12px",
    },
    limitInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    limitLabel: {
        fontSize: "10px",
        color: "#8DA6C0",
    },
    limitValue: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
    },
    limitUsed: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#EF4444",
    },
    limitAvailable: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#10B981",
    },
    cardFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardExpiry: {
        fontSize: "11px",
        color: "#6B8BA4",
    },
    cardAction: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 12px",
        background: "transparent",
        border: "1px solid #FFD700",
        borderRadius: "8px",
        color: "#003366",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "pointer",
    },
    loansList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    loanItem: {
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "16px",
        border: "1px solid #E6EDF5",
    },
    loanHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    loanType: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    },
    loanAmount: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    loanAmountLabel: {
        fontSize: "12px",
        color: "#6B8BA4",
    },
    loanAmountValue: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#003366",
    },
    loanDetails: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "12px",
    },
    loanDetail: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    loanDetailLabel: {
        fontSize: "10px",
        color: "#8DA6C0",
    },
    loanDetailValue: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#003366",
    },
    investmentsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "16px",
    },
    investmentCard: {
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "16px",
        border: "1px solid #E6EDF5",
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    investmentIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "rgba(255, 215, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    investmentInfo: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    investmentName: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
    },
    investmentValue: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#003366",
    },
    investmentReturns: {
        fontSize: "11px",
        color: "#10B981",
        fontWeight: "600",
    },
    totalValue: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#003366",
    },
    budgetContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    budgetItem: {
        padding: "12px",
        background: "#F8FBFF",
        borderRadius: "12px",
    },
    budgetCategory: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
    },
    budgetAmount: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
    },
    budgetProgressContainer: {
        width: "100%",
        height: "6px",
        background: "#E6EDF5",
        borderRadius: "3px",
        marginBottom: "6px",
    },
    budgetProgress: {
        height: "100%",
        borderRadius: "3px",
        transition: "width 0.3s ease",
    },
    budgetStats: {
        display: "flex",
        justifyContent: "space-between",
    },
    spentAmount: {
        fontSize: "11px",
        color: "#EF4444",
    },
    remainingAmount: {
        fontSize: "11px",
        color: "#10B981",
    },
    transactionsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    transactionItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        background: "#F8FBFF",
        borderRadius: "12px",
    },
    transactionIcon: {
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #E6EDF5",
    },
    transactionInfo: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    transactionDescription: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
    },
    transactionCategory: {
        fontSize: "11px",
        color: "#6B8BA4",
    },
    transactionAmount: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "2px",
    },
    amount: {
        fontSize: "13px",
        fontWeight: "700",
    },
    transactionDate: {
        fontSize: "10px",
        color: "#8DA6C0",
    },
    requestsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    requestItem: {
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "16px",
    },
    requestHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
    },
    requestId: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#003366",
        fontFamily: "monospace",
    },
    requestInfo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
    },
    requestType: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    },
    requestDate: {
        fontSize: "11px",
        color: "#6B8BA4",
        display: "flex",
        alignItems: "center",
    },
    requestPriority: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    priorityLabel: {
        fontSize: "11px",
        color: "#6B8BA4",
    },
    priorityValue: {
        fontSize: "11px",
        fontWeight: "600",
        textTransform: "capitalize",
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
    },
    footer: {
        textAlign: "center",
        padding: "20px 0",
    },
    footerText: {
        fontSize: "12px",
        color: "#8DA6C0",
        margin: 0,
    },
    monthLabel: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    }
};

export default Dashboard;