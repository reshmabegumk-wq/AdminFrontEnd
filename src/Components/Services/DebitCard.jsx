import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DebitCard = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    const debitRequests = [
        { id: 1, accountNo: "123456789012", createdDate: "01-02-2026", status: "Pending" },
        { id: 2, accountNo: "234567890123", createdDate: "02-02-2026", status: "Pending" },
        { id: 3, accountNo: "345678901234", createdDate: "03-02-2026", status: "Pending" },
        { id: 4, accountNo: "456789012345", createdDate: "04-02-2026", status: "Pending" },
        { id: 5, accountNo: "567890123456", createdDate: "05-02-2026", status: "Pending" }
    ];

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = debitRequests.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(debitRequests.length / recordsPerPage);

    return (
        <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <h1>Debit Card Service</h1>
                    <p style={{ color: "#9ca3af" }}>Manage your debit card requests</p>
                </div>

                <button
                    style={requestButton}
                    onClick={() => navigate("/services/debit-card-request")}
                >
                    Request New Debit Card
                </button>
            </div>

            <div style={tableContainer}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Account No</th>
                            <th>Created Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((item, index) => (
                            <tr key={item.id} style={rowStyle}>
                                <td style={cellStyle}>{indexOfFirstRecord + index + 1}</td>
                                <td style={cellStyle}>{item.accountNo}</td>
                                <td style={cellStyle}>{item.createdDate}</td>
                                <td style={cellStyle}>
                                    <span style={statusBadge}>{item.status}</span>
                                </td>
                                <td style={cellStyle}>
                                    <FaEye style={{ color: "#60a5fa", cursor: "pointer" }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const requestButton = {
    background: "#2563eb",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

const tableContainer = {
    background: "#1f2937",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "20px"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    color: "#e5e7eb"
};

const rowStyle = {
    borderBottom: "1px solid #374151"
};

const statusBadge = {
    background: "#f59e0b20",
    color: "#fbbf24",
    padding: "6px 12px",
    borderRadius: "20px"
};

const cellStyle = {
    padding: "14px 18px",
    textAlign: "left"
};

export default DebitCard;
