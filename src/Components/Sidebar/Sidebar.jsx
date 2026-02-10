import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaCreditCard,
    FaUser,
    FaChevronDown,
    FaChevronUp,
    FaBook,
    FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {
    const [openServices, setOpenServices] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <aside
            style={{
                width: "260px",
                minHeight: "100vh",
                background: "linear-gradient(180deg, #1e3c72, #2a5298)",
                color: "#fff",
                padding: "20px",
                boxShadow: "4px 0 10px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}
        >
            {/* TOP SECTION */}
            <div>

                {/* Logo */}
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                        fontSize: "22px",
                        fontWeight: "bold"
                    }}
                >
                    ABC Bank
                </h2>

                <ul style={{ listStyle: "none", padding: 0 }}>

                    {/* Dashboard */}
                    <li
                        style={menuItemStyle}
                        onClick={() => navigate("/dashboard")}
                    >
                        <FaTachometerAlt />
                        <span>Dashboard</span>
                    </li>

                    {/* Services */}
                    <li
                        style={menuItemStyle}
                        onClick={() => setOpenServices(!openServices)}
                    >
                        <FaCreditCard />
                        <span style={{ flexGrow: 1 }}>Services</span>
                        {openServices ? <FaChevronUp /> : <FaChevronDown />}
                    </li>

                    {openServices && (
                        <ul style={{ listStyle: "none", paddingLeft: "35px" }}>

                            <li
                                style={subMenuItemStyle}
                                onClick={() => navigate("/services/debit-card")}
                            >
                                <FaCreditCard />
                                <span>Debit Card Service</span>
                            </li>

                            <li
                                style={subMenuItemStyle}
                                onClick={() => navigate("/services/credit-card")}
                            >
                                <FaCreditCard />
                                <span>Credit Card Service</span>
                            </li>

                            <li
                                style={subMenuItemStyle}
                                onClick={() => navigate("/services/checkbook")}
                            >
                                <FaBook />
                                <span>Checkbook Leaves</span>
                            </li>

                        </ul>
                    )}

                    {/* Profile */}
                    <li
                        style={menuItemStyle}
                        onClick={() => navigate("/profile")}
                    >
                        <FaUser />
                        <span>Profile</span>
                    </li>

                </ul>
            </div>


            {/* BOTTOM LOGOUT SECTION */}
            <div
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.2)",
                    paddingTop: "15px"
                }}
            >
                <div
                    style={{
                        ...menuItemStyle,
                        color: "#ffcccb"
                    }}
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    <span>Log Out</span>
                </div>
            </div>

        </aside>
    );
};


/* ================== STYLES ================== */

const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "8px",
    transition: "background 0.3s"
};

const subMenuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "6px"
};

export default Sidebar;
