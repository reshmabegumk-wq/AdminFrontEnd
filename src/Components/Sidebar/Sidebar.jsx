import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUser,
    FaSignOutAlt,
    FaBuilding,
    FaChartLine,
    FaShieldAlt,
    FaExchangeAlt,
    FaUserTie,
    FaBook,
    FaChevronDown,
    FaChevronUp,
    FaFileInvoiceDollar,
    FaCreditCard,
    FaExclamationTriangle,
    FaQuestionCircle,
    FaArrowUp,
    FaUsers
} from "react-icons/fa";

const Sidebar = () => {
    const [openServices, setOpenServices] = useState(true);
    const [openAccounts, setOpenAccounts] = useState(false);
    const [activeItem, setActiveItem] = useState("dashboard");
    const navigate = useNavigate();

    const handleNavigation = (path, item) => {
        setActiveItem(item);
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <aside
            style={{
                minWidth: "280px",
                minHeight: "100vh",
                background: "linear-gradient(180deg, #003366 0%, #002244 100%)",
                color: "#fff",
                padding: "28px 20px",
                boxShadow: "8px 0 25px rgba(0, 51, 102, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden"
            }}
        >
            {/* Premium Pattern Overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMjAgMjBoMTB2MTBIMjB6TTUwIDUwaDEwdjEwSDUweiIgZmlsbD0icmdiYSgyNTUsMjE1LDAsMC4wMykiLz48L3N2Zz4=')",
                    opacity: 0.4,
                    pointerEvents: "none",
                }}
            ></div>

            {/* TOP SECTION */}
            <div style={{ position: "relative", zIndex: 2 }}>
                {/* Premium Bank Logo with Gold Accent */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "35px",
                        padding: "0 5px"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "14px",
                                background: "linear-gradient(135deg, #FFD700, #FBBF24)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 8px 16px rgba(255, 215, 0, 0.25)"
                            }}
                        >
                            <FaBuilding size={24} color="#003366" />
                        </div>
                        <div>
                            <h2
                                style={{
                                    fontSize: "24px",
                                    fontWeight: "800",
                                    margin: 0,
                                    color: "#FFFFFF",
                                    letterSpacing: "-0.5px"
                                }}
                            >
                                <span style={{ color: "#FFD700" }}>ABC</span> Bank
                            </h2>
                            <p
                                style={{
                                    fontSize: "11px",
                                    margin: "4px 0 0",
                                    color: "#E6F0FF",
                                    opacity: 0.8,
                                    fontWeight: "500",
                                    letterSpacing: "1px"
                                }}
                            >
                                ADMIN DASHBOARD
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div style={{ marginBottom: "25px" }}>
                    <p
                        style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#FFD700",
                            marginBottom: "15px",
                            paddingLeft: "12px",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase"
                        }}
                    >
                        MAIN MENU
                    </p>

                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {/* Dashboard */}
                        <li
                            style={{
                                ...menuItemStyle,
                                background: activeItem === "dashboard"
                                    ? "linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)"
                                    : "transparent",
                                borderLeft: activeItem === "dashboard"
                                    ? "4px solid #FFD700"
                                    : "4px solid transparent",
                            }}
                            onClick={() => handleNavigation("/dashboard", "dashboard")}
                        >
                            <FaTachometerAlt
                                style={{
                                    color: activeItem === "dashboard" ? "#FFD700" : "#E6F0FF",
                                    fontSize: "18px"
                                }}
                            />
                            <span style={{
                                fontWeight: activeItem === "dashboard" ? "600" : "500",
                                color: activeItem === "dashboard" ? "#FFFFFF" : "#E6F0FF"
                            }}>
                                Dashboard
                            </span>
                            {activeItem === "dashboard" && (
                                <span style={{
                                    marginLeft: "auto",
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: "#FFD700"
                                }}></span>
                            )}
                        </li>

                        {/* Services Section with Dropdown */}
                        <li>
                            <div
                                style={{
                                    ...menuItemStyle,
                                    justifyContent: "space-between"
                                }}
                                onClick={() => setOpenServices(!openServices)}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <FaBook style={{ color: "#E6F0FF", fontSize: "18px" }} />
                                    <span style={{ color: "#E6F0FF", fontWeight: "500" }}>Services</span>
                                </div>
                                {openServices ? (
                                    <FaChevronUp size={14} color="#FFD700" />
                                ) : (
                                    <FaChevronDown size={14} color="#E6F0FF" />
                                )}
                            </div>

                            {openServices && (
                                <div style={{ paddingLeft: "32px", marginBottom: "8px" }}>
                                    {[
                                        {
                                            icon: FaFileInvoiceDollar,
                                            name: "Cheque Book",
                                            path: "/cheque-book",
                                            id: "chequeBook"
                                        },
                                        {
                                            icon: FaExclamationTriangle,
                                            name: "Report Stolen Card",
                                            path: "/stolen-card",
                                            id: "stolenCard"
                                        },
                                        {
                                            icon: FaArrowUp,
                                            name: "Increase Card Limit",
                                            path: "/increase-limit",
                                            id: "increaseLimit"
                                        },
                                        {
                                            icon: FaQuestionCircle,
                                            name: "Customer Queries",
                                            path: "/customer-queries",
                                            id: "queries"
                                        },
                                    ]
                                        .map((item) => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    ...subMenuItemStyle,
                                                    background: activeItem === item.id
                                                        ? "rgba(255,215,0,0.1)"
                                                        : "transparent",
                                                    borderRadius: "10px",
                                                    marginBottom: "4px"
                                                }}
                                                onClick={() => handleNavigation(item.path, item.id)}
                                            >
                                                <item.icon
                                                    size={14}
                                                    style={{
                                                        color: activeItem === item.id ? "#FFD700" : "#B8D1E5"
                                                    }}
                                                />
                                                <span style={{
                                                    fontSize: "14px",
                                                    color: activeItem === item.id ? "#FFFFFF" : "#B8D1E5",
                                                    fontWeight: activeItem === item.id ? "600" : "400"
                                                }}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </li>

                        {/* Customer / Admin */}
                        <li
                            style={{
                                ...menuItemStyle,
                                background: activeItem === "customerAdmin"
                                    ? "linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)"
                                    : "transparent",
                                borderLeft: activeItem === "customerAdmin"
                                    ? "4px solid #FFD700"
                                    : "4px solid transparent",
                            }}
                            onClick={() => handleNavigation("/users", "customerAdmin")}
                        >
                            <FaUsers
                                style={{
                                    color: activeItem === "customerAdmin" ? "#FFD700" : "#E6F0FF",
                                    fontSize: "18px"
                                }}
                            />
                            <span
                                style={{
                                    fontWeight: activeItem === "customerAdmin" ? "600" : "500",
                                    color: activeItem === "customerAdmin" ? "#FFFFFF" : "#E6F0FF"
                                }}
                            >
                                Customer / Admin
                            </span>

                            {activeItem === "customerAdmin" && (
                                <span
                                    style={{
                                        marginLeft: "auto",
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        background: "#FFD700"
                                    }}
                                ></span>
                            )}
                        </li>


                        {/* Profile */}
                        <li
                            style={{
                                ...menuItemStyle,
                                background: activeItem === "profile"
                                    ? "linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)"
                                    : "transparent",
                                borderLeft: activeItem === "profile"
                                    ? "4px solid #FFD700"
                                    : "4px solid transparent",
                            }}
                            onClick={() => handleNavigation("/profile", "profile")}
                        >
                            <FaUser
                                style={{
                                    color: activeItem === "profile" ? "#FFD700" : "#E6F0FF",
                                    fontSize: "18px"
                                }}
                            />
                            <span style={{
                                fontWeight: activeItem === "profile" ? "600" : "500",
                                color: activeItem === "profile" ? "#FFFFFF" : "#E6F0FF"
                            }}>
                                Profile
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* BOTTOM SECTION - User Profile & Logout */}
            <div style={{ position: "relative", zIndex: 2 }}>
                {/* Admin Profile Card */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "16px",
                        marginBottom: "12px",
                        border: "1px solid rgba(255,215,0,0.15)"
                    }}
                >
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #FFD700, #FBBF24)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <FaUserTie size={24} color="#003366" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: "#FFFFFF", fontWeight: "600", fontSize: "15px" }}>
                            Admin User
                        </p>
                        <p style={{ margin: "4px 0 0", color: "#FFD700", fontSize: "12px", fontWeight: "500" }}>
                            Employee
                        </p>
                    </div>
                </div>

                {/* Logout Button */}
                <div
                    style={{
                        ...menuItemStyle,
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255,215,0,0.1)",
                        marginBottom: 0,
                        borderRadius: "14px"
                    }}
                    onClick={handleLogout}
                >
                    <FaSignOutAlt style={{ color: "#FFD700", fontSize: "18px" }} />
                    <span style={{ color: "#FFFFFF", fontWeight: "500" }}>Log Out</span>
                </div>

                {/* Version Info */}
                <p
                    style={{
                        fontSize: "11px",
                        color: "#B8D1E5",
                        textAlign: "center",
                        marginTop: "20px",
                        opacity: 0.6,
                        letterSpacing: "0.5px"
                    }}
                >
                    ABC Bank v2.0 • Secure Banking
                </p>
            </div>
        </aside>
    );
};

/* ================== STYLES ================== */
const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "4px",
    transition: "all 0.3s ease",
    position: "relative"
};

const subMenuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "10px",
    transition: "all 0.2s ease"
};

export default Sidebar;