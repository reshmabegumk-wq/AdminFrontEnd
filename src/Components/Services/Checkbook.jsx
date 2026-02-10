const Checkbook = () => {
    return (
        <div>
            <h1>Checkbook Service</h1>
            <p style={{ marginBottom: "20px", color: "#6b7280" }}>
                Request new checkbook leaves and track request status
            </p>

            <div style={cardStyle}>
                <div style={rowStyle}>
                    <span>Available Leaves</span>
                    <strong>10</strong>
                </div>

                <div style={rowStyle}>
                    <span>Last Issued Date</span>
                    <strong>15-Jan-2026</strong>
                </div>

                <div style={rowStyle}>
                    <span>Request Status</span>
                    <strong>Approved</strong>
                </div>

                <div style={{ marginTop: "20px" }}>
                    <button>Request New Checkbook</button>
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

export default Checkbook;
