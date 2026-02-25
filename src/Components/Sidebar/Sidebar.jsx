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

// ─── HDFC Design Tokens (identical to Login + Dashboard) ─────────────────────
const H = {
    navy: "#003580",
    navyDark: "#002D6E",
    navyDeep: "#001E4E",
    navyLight: "#E8EEF8",
    red: "#E31837",
    redDark: "#C0122D",
    white: "#FFFFFF",
    g100: "#EEF1F7",
    g200: "#DDE3EF",
    g400: "#B0B8CC",
    g500: "#8C9BB5",
    text: "#1A1F36",
};

const Sidebar = () => {
    const [openServices, setOpenServices] = useState(true);
    const [openAccounts, setOpenAccounts] = useState(false);
    const [activeItem, setActiveItem] = useState("dashboard");
    const navigate = useNavigate();

    // ── All original handlers — 100% untouched ────────────────────────────
    const handleNavigation = (path, item) => {
        setActiveItem(item);
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.clear();
        navigate("/");
    };
    // ─────────────────────────────────────────────────────────────────────

    return (
        <aside style={S.sidebar}>

            {/* HDFC-style subtle grid overlay */}
            <div style={S.gridOverlay} />

            {/* Red top ribbon — HDFC signature */}
            <div style={S.topRibbon} />

            {/* ── LOGO BLOCK ─────────────────────────────────────────── */}
            <div style={S.logoBlock}>
                <div style={S.logoIconWrap}>
                    <FaBuilding size={22} color={H.white} />
                </div>
                <div>
                    <h2 style={S.logoTitle}>
                        <span style={S.logoAccent}>ABC</span> BANK
                    </h2>
                    <p style={S.logoSub}>ADMIN PORTAL</p>
                </div>
            </div>

            {/* Divider */}
            <div style={S.divider} />

            {/* ── MAIN MENU ──────────────────────────────────────────── */}
            <div style={S.navSection}>
                <p style={S.navLabel}>MAIN MENU</p>

                <ul style={S.navList}>

                    {/* Dashboard */}
                    <li
                        style={navItem(activeItem === "dashboard")}
                        onClick={() => handleNavigation("/dashboard", "dashboard")}
                        onMouseEnter={e => { if (activeItem !== "dashboard") applyHover(e); }}
                        onMouseLeave={e => { if (activeItem !== "dashboard") removeHover(e); }}
                    >
                        <FaTachometerAlt style={navIcon(activeItem === "dashboard")} />
                        <span style={navLabel_(activeItem === "dashboard")}>Dashboard</span>
                        {activeItem === "dashboard" && <span style={S.activeDot} />}
                    </li>

                    {/* Services Dropdown */}
                    <li>
                        <div
                            style={{ ...navItem(false), justifyContent: "space-between" }}
                            onClick={() => setOpenServices(!openServices)}
                            onMouseEnter={e => applyHover(e)}
                            onMouseLeave={e => removeHover(e)}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <FaBook style={navIcon(false)} />
                                <span style={navLabel_(false)}>Services</span>
                            </div>
                            {openServices
                                ? <FaChevronUp size={13} color={H.red} />
                                : <FaChevronDown size={13} color={H.g500} />
                            }
                        </div>

                        {openServices && (
                            <div style={S.subMenu}>
                                {[
                                    { icon: FaFileInvoiceDollar, name: "Cheque Leaves", path: "/cheque-book", id: "chequeLeaves" },
                                    { icon: FaExclamationTriangle, name: "Stolen/Lost Card", path: "/stolen-card", id: "stolenCard" },
                                    { icon: FaArrowUp, name: "Increase Card Limit", path: "/increase-limit", id: "increaseLimit" },
                                    { icon: FaQuestionCircle, name: "Customer Queries", path: "/customer-queries", id: "queries" },
                                ].map(item => (
                                    <div
                                        key={item.id}
                                        style={subItem(activeItem === item.id)}
                                        onClick={() => handleNavigation(item.path, item.id)}
                                        onMouseEnter={e => { if (activeItem !== item.id) applySubHover(e); }}
                                        onMouseLeave={e => { if (activeItem !== item.id) removeSubHover(e); }}
                                    >
                                        {/* Active indicator line */}
                                        {activeItem === item.id && <div style={S.subActiveLine} />}
                                        <item.icon size={13} style={{ color: activeItem === item.id ? H.red : H.g400, flexShrink: 0 }} />
                                        <span style={{
                                            fontSize: "13.5px",
                                            fontWeight: activeItem === item.id ? "700" : "400",
                                            color: activeItem === item.id ? H.white : "rgba(255,255,255,0.65)",
                                        }}>
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </li>

                    {/* Customer / Employee */}
                    <li
                        style={navItem(activeItem === "customerAdmin")}
                        onClick={() => handleNavigation("/users", "customerAdmin")}
                        onMouseEnter={e => { if (activeItem !== "customerAdmin") applyHover(e); }}
                        onMouseLeave={e => { if (activeItem !== "customerAdmin") removeHover(e); }}
                    >
                        <FaUsers style={navIcon(activeItem === "customerAdmin")} />
                        <span style={navLabel_(activeItem === "customerAdmin")}>Customer / Employee</span>
                        {activeItem === "customerAdmin" && <span style={S.activeDot} />}
                    </li>

                    {/* Profile */}
                    <li
                        style={navItem(activeItem === "profile")}
                        onClick={() => handleNavigation("/profile", "profile")}
                        onMouseEnter={e => { if (activeItem !== "profile") applyHover(e); }}
                        onMouseLeave={e => { if (activeItem !== "profile") removeHover(e); }}
                    >
                        <FaUser style={navIcon(activeItem === "profile")} />
                        <span style={navLabel_(activeItem === "profile")}>Profile</span>
                        {activeItem === "profile" && <span style={S.activeDot} />}
                    </li>

                </ul>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* ── BOTTOM — Logout ────────────────────────────────────── */}
            <div style={S.bottomSection}>
                <div style={S.divider} />

                <div
                    style={S.logoutBtn}
                    onClick={handleLogout}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = H.red;
                        e.currentTarget.style.borderColor = H.red;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(227,24,55,0.08)";
                        e.currentTarget.style.borderColor = "rgba(227,24,55,0.25)";
                    }}
                >
                    <FaSignOutAlt style={{ color: H.red, fontSize: "17px", flexShrink: 0 }} />
                    <span style={{ color: H.white, fontWeight: "600", fontSize: "14px" }}>Log Out</span>
                </div>

                <p style={S.versionText}>ABC Bank v2.0 &nbsp;•&nbsp; Secure Banking</p>
            </div>
        </aside>
    );
};

// ─── Hover helpers (inline style transitions via JS) ────────────────────────
const applyHover = e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; };
const removeHover = e => { e.currentTarget.style.background = "transparent"; };
const applySubHover = e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; };
const removeSubHover = e => { e.currentTarget.style.background = "transparent"; };

// ─── Dynamic style factories ──────────────────────────────────────────────
const navItem = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "3px",
    transition: "background 0.2s ease",
    position: "relative",
    listStyle: "none",
    background: active
        ? "rgba(227,24,55,0.12)"
        : "transparent",
    borderLeft: active
        ? `3px solid ${H.red}`
        : "3px solid transparent",
});

const navIcon = (active) => ({
    color: active ? H.red : "rgba(255,255,255,0.65)",
    fontSize: "17px",
    flexShrink: 0,
    transition: "color 0.2s",
});

const navLabel_ = (active) => ({
    fontSize: "14px",
    fontWeight: active ? "700" : "500",
    color: active ? H.white : "rgba(255,255,255,0.75)",
    fontFamily: "'Open Sans', 'Segoe UI', Arial, sans-serif",
    letterSpacing: "0.1px",
});

const subItem = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    marginBottom: "2px",
    transition: "background 0.2s ease",
    position: "relative",
    background: active ? "rgba(227,24,55,0.1)" : "transparent",
    borderLeft: active ? `2px solid ${H.red}` : "2px solid transparent",
});

// ─── Static Styles ────────────────────────────────────────────────────────
const S = {
    sidebar: {
        minWidth: "268px",
        maxWidth: "268px",
        height: "100vh",
        background: `linear-gradient(180deg, ${H.navy} 0%, ${H.navyDeep} 100%)`,
        color: H.white,
        padding: "0 16px 20px",
        boxShadow: "4px 0 20px rgba(0,53,128,0.2)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
        fontFamily: "'Open Sans', 'Segoe UI', Arial, sans-serif",
    },

    // Grid pattern overlay — matches login page left panel
    gridOverlay: {
        position: "absolute",
        inset: 0,
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        zIndex: 0,
    },

    // HDFC red top ribbon
    topRibbon: {
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        height: "5px",
        background: H.red,
        marginLeft: "-16px",
        marginRight: "-16px",
        marginBottom: "0",
        zIndex: 10,
        flexShrink: 0,
    },

    // Logo block — matches login page logo treatment
    logoBlock: {
        display: "flex",
        alignItems: "center",
        gap: "13px",
        padding: "22px 6px 18px",
        position: "relative",
        zIndex: 2,
        flexShrink: 0,
    },
    logoIconWrap: {
        width: "44px",
        height: "44px",
        borderRadius: "8px",
        background: H.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        flexShrink: 0,
        // Red icon inside white box — exactly like login page logo
        // Override icon color via wrapper background trick
        backgroundImage: `linear-gradient(135deg, ${H.white}, ${H.white})`,
    },
    logoTitle: {
        fontSize: "18px",
        fontWeight: "800",
        margin: 0,
        color: H.white,
        letterSpacing: "0.5px",
        lineHeight: 1.1,
    },
    logoAccent: {
        color: H.red,
    },
    logoSub: {
        fontSize: "9.5px",
        margin: "4px 0 0",
        color: "rgba(255,255,255,0.6)",
        fontWeight: "700",
        letterSpacing: "2px",
        textTransform: "uppercase",
    },

    divider: {
        height: "1px",
        background: "rgba(255,255,255,0.08)",
        margin: "4px 0 16px",
        position: "relative",
        zIndex: 2,
        flexShrink: 0,
    },

    navSection: {
        position: "relative",
        zIndex: 2,
        flexShrink: 0,
    },
    navLabel: {
        fontSize: "10px",
        fontWeight: "700",
        color: H.red,
        marginBottom: "10px",
        paddingLeft: "14px",
        letterSpacing: "1.8px",
        textTransform: "uppercase",
        opacity: 0.9,
    },
    navList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
    },

    activeDot: {
        marginLeft: "auto",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: H.red,
        flexShrink: 0,
    },

    subMenu: {
        paddingLeft: "28px",
        marginBottom: "4px",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        marginLeft: "22px",
    },
    subActiveLine: {
        position: "absolute",
        left: 0,
        top: "20%",
        bottom: "20%",
        width: "2px",
        background: H.red,
        borderRadius: "2px",
    },

    bottomSection: {
        position: "relative",
        zIndex: 2,
        flexShrink: 0,
    },
    logoutBtn: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        background: "rgba(227,24,55,0.08)",
        border: "1px solid rgba(227,24,55,0.25)",
        marginBottom: "14px",
        transition: "background 0.2s ease, border-color 0.2s ease",
    },
    versionText: {
        fontSize: "10.5px",
        color: "rgba(255,255,255,0.35)",
        textAlign: "center",
        letterSpacing: "0.5px",
    },
};

export default Sidebar;





// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     FaTachometerAlt,
//     FaUser,
//     FaSignOutAlt,
//     FaBuilding,
//     FaChartLine,
//     FaShieldAlt,
//     FaExchangeAlt,
//     FaUserTie,
//     FaBook,
//     FaChevronDown,
//     FaChevronUp,
//     FaFileInvoiceDollar,
//     FaCreditCard,
//     FaExclamationTriangle,
//     FaQuestionCircle,
//     FaArrowUp,
//     FaUsers
// } from "react-icons/fa";

// const Sidebar = () => {
//     const [openServices, setOpenServices] = useState(true);
//     const [openAccounts, setOpenAccounts] = useState(false);
//     const [activeItem, setActiveItem] = useState("dashboard");
//     const navigate = useNavigate();

//     const handleNavigation = (path, item) => {
//         setActiveItem(item);
//         navigate(path);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.clear();
//         navigate("/");
//     };

//     return (
//         <aside
//             style={{
//                 minWidth: "280px",
//                 height: "100vh",
//                 background: "linear-gradient(180deg, #003366 0%, #002244 100%)",
//                 color: "#fff",
//                 padding: "28px 20px",
//                 boxShadow: "8px 0 25px rgba(0, 51, 102, 0.15)",
//                 display: "flex",
//                 flexDirection: "column",
//                 overflowY: "auto",
//                 overflowX: "hidden"
//             }}
//         >
//             {/* Premium Pattern Overlay */}
//             <div
//                 style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMjAgMjBoMTB2MTBIMjB6TTUwIDUwaDEwdjEwSDUweiIgZmlsbD0icmdiYSgyNTUsMjE1LDAsMC4wMykiLz48L3N2Zz4=')",
//                     opacity: 0.4,
//                     pointerEvents: "none",
//                 }}
//             ></div>

//             {/* TOP SECTION */}
//             <div style={{ position: "relative", zIndex: 2 }}>
//                 {/* Premium Bank Logo with Gold Accent */}
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         marginBottom: "35px",
//                         padding: "0 5px"
//                     }}
//                 >
//                     <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                         <div
//                             style={{
//                                 width: "48px",
//                                 height: "48px",
//                                 borderRadius: "14px",
//                                 background: "linear-gradient(135deg, #FFD700, #FBBF24)",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 boxShadow: "0 8px 16px rgba(255, 215, 0, 0.25)"
//                             }}
//                         >
//                             <FaBuilding size={24} color="#003366" />
//                         </div>
//                         <div>
//                             <h2
//                                 style={{
//                                     fontSize: "24px",
//                                     fontWeight: "800",
//                                     margin: 0,
//                                     color: "#FFFFFF",
//                                     letterSpacing: "-0.5px"
//                                 }}
//                             >
//                                 <span style={{ color: "#FFD700" }}>ABC</span> Bank
//                             </h2>
//                             <p
//                                 style={{
//                                     fontSize: "11px",
//                                     margin: "4px 0 0",
//                                     color: "#E6F0FF",
//                                     opacity: 0.8,
//                                     fontWeight: "500",
//                                     letterSpacing: "1px"
//                                 }}
//                             >
//                                 ADMIN DASHBOARD
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Navigation */}
//                 <div style={{ marginBottom: "25px" }}>
//                     <p
//                         style={{
//                             fontSize: "12px",
//                             fontWeight: "600",
//                             color: "#FFD700",
//                             marginBottom: "15px",
//                             paddingLeft: "12px",
//                             letterSpacing: "1.5px",
//                             textTransform: "uppercase"
//                         }}
//                     >
//                         MAIN MENU
//                     </p>

//                     <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//                         {/* Dashboard */}
//                         <li
//                             style={{
//                                 ...menuItemStyle,
//                                 background: activeItem === "dashboard"
//                                     ? "linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)"
//                                     : "transparent",
//                                 borderLeft: activeItem === "dashboard"
//                                     ? "4px solid #FFD700"
//                                     : "4px solid transparent",
//                             }}
//                             onClick={() => handleNavigation("/dashboard", "dashboard")}
//                         >
//                             <FaTachometerAlt
//                                 style={{
//                                     color: activeItem === "dashboard" ? "#FFD700" : "#E6F0FF",
//                                     fontSize: "18px"
//                                 }}
//                             />
//                             <span style={{
//                                 fontWeight: activeItem === "dashboard" ? "600" : "500",
//                                 color: activeItem === "dashboard" ? "#FFFFFF" : "#E6F0FF"
//                             }}>
//                                 Dashboard
//                             </span>
//                             {activeItem === "dashboard" && (
//                                 <span style={{
//                                     marginLeft: "auto",
//                                     width: "6px",
//                                     height: "6px",
//                                     borderRadius: "50%",
//                                     background: "#FFD700"
//                                 }}></span>
//                             )}
//                         </li>

//                         {/* Services Section with Dropdown */}
//                         <li>
//                             <div
//                                 style={{
//                                     ...menuItemStyle,
//                                     justifyContent: "space-between"
//                                 }}
//                                 onClick={() => setOpenServices(!openServices)}
//                             >
//                                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                                     <FaBook style={{ color: "#E6F0FF", fontSize: "18px" }} />
//                                     <span style={{ color: "#E6F0FF", fontWeight: "500" }}>Services</span>
//                                 </div>
//                                 {openServices ? (
//                                     <FaChevronUp size={14} color="#FFD700" />
//                                 ) : (
//                                     <FaChevronDown size={14} color="#E6F0FF" />
//                                 )}
//                             </div>

//                             {openServices && (
//                                 <div style={{ paddingLeft: "32px", marginBottom: "8px" }}>
//                                     {[
//                                         {
//                                             icon: FaFileInvoiceDollar,
//                                             name: "Cheque Leaves",
//                                             path: "/cheque-book",
//                                             id: "chequeLeaves"
//                                         },
//                                         {
//                                             icon: FaExclamationTriangle,
//                                             name: "Stolen/Lost Card",
//                                             path: "/stolen-card",
//                                             id: "stolenCard"
//                                         },
//                                         {
//                                             icon: FaArrowUp,
//                                             name: "Increase Card Limit",
//                                             path: "/increase-limit",
//                                             id: "increaseLimit"
//                                         },
//                                         {
//                                             icon: FaQuestionCircle,
//                                             name: "Customer Queries",
//                                             path: "/customer-queries",
//                                             id: "queries"
//                                         },
//                                     ]
//                                         .map((item) => (
//                                             <div
//                                                 key={item.id}
//                                                 style={{
//                                                     ...subMenuItemStyle,
//                                                     background: activeItem === item.id
//                                                         ? "rgba(255,215,0,0.1)"
//                                                         : "transparent",
//                                                     borderRadius: "10px",
//                                                     marginBottom: "4px"
//                                                 }}
//                                                 onClick={() => handleNavigation(item.path, item.id)}
//                                             >
//                                                 <item.icon
//                                                     size={14}
//                                                     style={{
//                                                         color: activeItem === item.id ? "#FFD700" : "#B8D1E5"
//                                                     }}
//                                                 />
//                                                 <span style={{
//                                                     fontSize: "14px",
//                                                     color: activeItem === item.id ? "#FFFFFF" : "#B8D1E5",
//                                                     fontWeight: activeItem === item.id ? "600" : "400"
//                                                 }}>
//                                                     {item.name}
//                                                 </span>
//                                             </div>
//                                         ))}
//                                 </div>
//                             )}
//                         </li>

//                         {/* Customer / Admin */}
//                         <li
//                             style={{
//                                 ...menuItemStyle,
//                                 background: activeItem === "customerAdmin"
//                                     ? "linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)"
//                                     : "transparent",
//                                 borderLeft: activeItem === "customerAdmin"
//                                     ? "4px solid #FFD700"
//                                     : "4px solid transparent",
//                             }}
//                             onClick={() => handleNavigation("/users", "customerAdmin")}
//                         >
//                             <FaUsers
//                                 style={{
//                                     color: activeItem === "customerAdmin" ? "#FFD700" : "#E6F0FF",
//                                     fontSize: "18px"
//                                 }}
//                             />
//                             <span
//                                 style={{
//                                     fontWeight: activeItem === "customerAdmin" ? "600" : "500",
//                                     color: activeItem === "customerAdmin" ? "#FFFFFF" : "#E6F0FF"
//                                 }}
//                             >
//                                 Customer / Employee
//                             </span>

//                             {activeItem === "customerAdmin" && (
//                                 <span
//                                     style={{
//                                         marginLeft: "auto",
//                                         width: "6px",
//                                         height: "6px",
//                                         borderRadius: "50%",
//                                         background: "#FFD700"
//                                     }}
//                                 ></span>
//                             )}
//                         </li>


//                         {/* Profile */}
//                         <li
//                             style={{
//                                 ...menuItemStyle,
//                                 background: activeItem === "profile"
//                                     ? "linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)"
//                                     : "transparent",
//                                 borderLeft: activeItem === "profile"
//                                     ? "4px solid #FFD700"
//                                     : "4px solid transparent",
//                             }}
//                             onClick={() => handleNavigation("/profile", "profile")}
//                         >
//                             <FaUser
//                                 style={{
//                                     color: activeItem === "profile" ? "#FFD700" : "#E6F0FF",
//                                     fontSize: "18px"
//                                 }}
//                             />
//                             <span style={{
//                                 fontWeight: activeItem === "profile" ? "600" : "500",
//                                 color: activeItem === "profile" ? "#FFFFFF" : "#E6F0FF"
//                             }}>
//                                 Profile
//                             </span>
//                         </li>
//                     </ul>
//                 </div>
//             </div>

//             {/* BOTTOM SECTION - User Profile & Logout */}
//             <div style={{ position: "relative", zIndex: 2 }}>
//                 {/* Admin Profile Card */}
//                 {/* <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                         padding: "16px",
//                         background: "rgba(255, 255, 255, 0.03)",
//                         borderRadius: "16px",
//                         marginBottom: "12px",
//                         border: "1px solid rgba(255,215,0,0.15)"
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: "48px",
//                             height: "48px",
//                             borderRadius: "14px",
//                             background: "linear-gradient(135deg, #FFD700, #FBBF24)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center"
//                         }}
//                     >
//                         <FaUserTie size={24} color="#003366" />
//                     </div>
//                     <div style={{ flex: 1 }}>
//                         <p style={{ margin: 0, color: "#FFFFFF", fontWeight: "600", fontSize: "15px" }}>
//                             Admin User
//                         </p>
//                         <p style={{ margin: "4px 0 0", color: "#FFD700", fontSize: "12px", fontWeight: "500" }}>
//                             Employee
//                         </p>
//                     </div>
//                 </div> */}

//                 {/* Logout Button */}
//                 <div
//                     style={{
//                         ...menuItemStyle,
//                         background: "rgba(255, 255, 255, 0.02)",
//                         border: "1px solid rgba(255,215,0,0.1)",
//                         marginBottom: 0,
//                         borderRadius: "14px"
//                     }}
//                     onClick={handleLogout}
//                 >
//                     <FaSignOutAlt style={{ color: "#FFD700", fontSize: "18px" }} />
//                     <span style={{ color: "#FFFFFF", fontWeight: "500" }}>Log Out</span>
//                 </div>

//                 {/* Version Info */}
//                 <p
//                     style={{
//                         fontSize: "11px",
//                         color: "#B8D1E5",
//                         textAlign: "center",
//                         marginTop: "20px",
//                         opacity: 0.6,
//                         letterSpacing: "0.5px"
//                     }}
//                 >
//                     ABC Bank v2.0 • Secure Banking
//                 </p>
//             </div>
//         </aside>
//     );
// };

// /* ================== STYLES ================== */
// const menuItemStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     padding: "12px 16px",
//     borderRadius: "12px",
//     cursor: "pointer",
//     marginBottom: "4px",
//     transition: "all 0.3s ease",
//     position: "relative"
// };

// const subMenuItemStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     padding: "10px 16px",
//     fontSize: "14px",
//     cursor: "pointer",
//     borderRadius: "10px",
//     transition: "all 0.2s ease"
// };

// export default Sidebar;
