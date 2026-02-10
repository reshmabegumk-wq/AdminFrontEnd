import React from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreditCard = () => {
  const navigate = useNavigate();

  const data = [
    { id: 1, cardNo: "4567 8912 3456 7890", date: "01-02-2026", status: "Pending" },
    { id: 2, cardNo: "5678 9123 4567 8901", date: "02-02-2026", status: "Pending" },
    { id: 3, cardNo: "6789 1234 5678 9012", date: "03-02-2026", status: "Pending" },
    { id: 4, cardNo: "7890 2345 6789 0123", date: "04-02-2026", status: "Pending" },
    { id: 5, cardNo: "8901 3456 7890 1234", date: "05-02-2026", status: "Pending" },
  ];

  return (
    <div style={{ padding: "40px", background: "#f4f6f9", minHeight: "100vh" }}>
      
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Credit Card Service</h1>
          <p style={{ color: "gray" }}>Manage your credit card requests</p>
        </div>

        <button
          onClick={() => navigate("/services/credit-card-request")}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "15px 25px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          Request New Credit Card
        </button>
      </div>

      {/* Table Section */}
      <div
        style={{
          marginTop: "40px",
          background: "#1f2937",
          borderRadius: "20px",
          padding: "20px"
        }}
      >
        <table style={{ width: "100%", color: "white", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th style={{ padding: "15px" }}>S.No</th>
              <th style={{ padding: "15px" }}>Card No</th>
              <th style={{ padding: "15px" }}>Created Date</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #374151" }}>
                <td style={{ padding: "15px" }}>{item.id}</td>
                <td style={{ padding: "15px" }}>{item.cardNo}</td>
                <td style={{ padding: "15px" }}>{item.date}</td>

                <td style={{ padding: "15px" }}>
                  <span
                    style={{
                      background: "#3f3c2f",
                      color: "#facc15",
                      padding: "6px 15px",
                      borderRadius: "20px"
                    }}
                  >
                    {item.status}
                  </span>
                </td>

                <td style={{ padding: "15px" }}>
                  <FaEye style={{ cursor: "pointer", color: "#60a5fa" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CreditCard;
