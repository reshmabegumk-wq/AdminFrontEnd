import { FaUser, FaCreditCard, FaBook, FaBell } from "react-icons/fa";

const Dashboard = () => {
    return (
        <div>
            {/* Page Title */}
            <h1 style={{ marginBottom: "10px" }}>Dashboard</h1>
            <p style={{ color: "#666", marginBottom: "30px" }}>
                Welcome to ABC Bank Self-Service Portal
            </p>

            {/* Summary Cards */}
            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "40px"
                }}
            >
                <Card
                    title="Profile Status"
                    value="Active"
                    icon={<FaUser />}
                    bg="#e3f2fd"
                />
                <Card
                    title="Debit Card"
                    value="Available"
                    icon={<FaCreditCard />}
                    bg="#e8f5e9"
                />
                 <Card
                    title="Credit Card"
                    value="Available"
                    icon={<FaCreditCard />}
                    bg="#e8f5e9"
                />
                <Card
                    title="Checkbook"
                    value="10 Leaves Left"
                    icon={<FaBook />}
                    bg="#fff3e0"
                />
                <Card
                    title="Notifications"
                    value="2 New"
                    icon={<FaBell />}
                    bg="#fce4ec"
                />
            </div>

            {/* Instructions Section */}
            <div
                style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
            >
                <h2 style={{ marginBottom: "15px" }}>How to Use This Dashboard</h2>

                <ul style={{ lineHeight: "1.8", color: "#444" }}>
                    <li>Use the <b>Dashboard</b> menu to view account summary.</li>
                    <li>
                        Go to <b>Services</b> to apply for Debit Card or Checkbook Leaves.
                    </li>
                    <li>
                        Check <b>Profile</b> to update your personal details.
                    </li>
                    <li>
                        Track the status of your service requests anytime.
                    </li>
                </ul>
            </div>
        </div>
    );
};

/* Reusable Card Component */
const Card = ({ title, value, icon, bg }) => {
    return (
        <div
            style={{
                flex: 1,
                background: bg,
                padding: "20px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}
        >
            <div
                style={{
                    fontSize: "28px",
                    color: "#1e3c72"
                }}
            >
                {icon}
            </div>

            <div>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <p style={{ margin: 0, fontWeight: "bold" }}>{value}</p>
            </div>
        </div>
    );
};

export default Dashboard;
