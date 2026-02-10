const Profile = () => {
    return (
        <div>
            <h1>My Profile</h1>
            <p style={{ marginBottom: "20px", color: "#6b7280" }}>
                View and manage your personal details
            </p>

            <div style={cardStyle}>
                <div style={rowStyle}>
                    <Label text="Customer Name" />
                    <Value text="Reshma Kumar" />
                </div>

                <div style={rowStyle}>
                    <Label text="Account Number" />
                    <Value text="1234567890" />
                </div>

                <div style={rowStyle}>
                    <Label text="Email Address" />
                    <Value text="reshma@gmail.com" />
                </div>

                <div style={rowStyle}>
                    <Label text="Mobile Number" />
                    <Value text="+91 98765 43210" />
                </div>

                <div style={rowStyle}>
                    <Label text="Account Status" />
                    <Value text="Active" />
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "600px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb"
};

const Label = ({ text }) => (
    <span style={{ fontWeight: "600", color: "#374151" }}>{text}</span>
);

const Value = ({ text }) => (
    <span style={{ color: "#111827" }}>{text}</span>
);

export default Profile;
