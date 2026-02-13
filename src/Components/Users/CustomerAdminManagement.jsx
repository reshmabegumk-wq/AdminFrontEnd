import React, { useState } from "react";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";
import {
    FaUsers,
    FaUserTie,
    FaUser,
    FaSearch,
    FaFilter,
    FaEye,
    FaEdit,
    FaTrash,
    FaPlus,
    FaChevronLeft,
    FaChevronRight,
    FaEnvelope,
    FaPhone,
    FaBuilding,
    FaShieldAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaCalendarAlt,
    FaIdCard,
    FaMapMarkerAlt,
    FaCity,
    FaMapPin,
    FaAddressCard,
    FaBriefcase,
    FaRupeeSign,
    FaUserPlus,
    FaRegCreditCard,
} from "react-icons/fa";

const CustomerAdminManagement = () => {
    const [activeTab, setActiveTab] = useState("customer");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showOverview, setShowOverview] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { showSnackbar } = useSnackbar();
    const itemsPerPage = 8;

    // ============ SAMPLE DATA ============
    // Customer Data
    const customerData = [
        {
            id: "CUST-2024-001",
            name: "Rajesh Sharma",
            email: "rajesh.s@email.com",
            phone: "+91 98765 43210",
            accountType: "Savings",
            accountNumber: "XXXX XXXX 4582",
            customerSince: "2019-05-15",
            status: "active",
            kycStatus: "verified",
            tier: "Platinum",
            address: "Andheri East, Mumbai",
            occupation: "Software Engineer",
            annualIncome: "₹12,00,000",
            lastLogin: "2024-03-15 09:30 AM",
            totalAccounts: 3,
            totalCards: 2,
            totalLoans: 1
        },
        {
            id: "CUST-2024-002",
            name: "Priya Patel",
            email: "priya.p@email.com",
            phone: "+91 87654 32109",
            accountType: "Current",
            accountNumber: "XXXX XXXX 7891",
            customerSince: "2020-08-22",
            status: "active",
            kycStatus: "verified",
            tier: "Gold",
            address: "Banjara Hills, Hyderabad",
            occupation: "Business Owner",
            annualIncome: "₹25,00,000",
            lastLogin: "2024-03-14 02:15 PM",
            totalAccounts: 2,
            totalCards: 3,
            totalLoans: 2
        },
        {
            id: "CUST-2024-003",
            name: "Amit Kumar",
            email: "amit.k@email.com",
            phone: "+91 76543 21098",
            accountType: "Savings",
            accountNumber: "XXXX XXXX 1234",
            customerSince: "2021-11-10",
            status: "inactive",
            kycStatus: "pending",
            tier: "Silver",
            address: "Connaught Place, Delhi",
            occupation: "Doctor",
            annualIncome: "₹18,00,000",
            lastLogin: "2024-03-10 11:45 AM",
            totalAccounts: 1,
            totalCards: 1,
            totalLoans: 0
        },
        {
            id: "CUST-2024-004",
            name: "Sneha Reddy",
            email: "sneha.r@email.com",
            phone: "+91 65432 10987",
            accountType: "Current",
            accountNumber: "XXXX XXXX 5678",
            customerSince: "2022-02-18",
            status: "active",
            kycStatus: "verified",
            tier: "Platinum",
            address: "Jubilee Hills, Hyderabad",
            occupation: "Chartered Accountant",
            annualIncome: "₹22,00,000",
            lastLogin: "2024-03-15 10:20 AM",
            totalAccounts: 2,
            totalCards: 2,
            totalLoans: 1
        },
        {
            id: "CUST-2024-005",
            name: "Vikram Singh",
            email: "vikram.s@email.com",
            phone: "+91 54321 09876",
            accountType: "Savings",
            accountNumber: "XXXX XXXX 9012",
            customerSince: "2018-07-30",
            status: "active",
            kycStatus: "verified",
            tier: "Diamond",
            address: "Civil Lines, Jaipur",
            occupation: "Civil Servant",
            annualIncome: "₹15,00,000",
            lastLogin: "2024-03-13 04:50 PM",
            totalAccounts: 4,
            totalCards: 3,
            totalLoans: 1
        },
        {
            id: "CUST-2024-006",
            name: "Anjali Nair",
            email: "anjali.n@email.com",
            phone: "+91 43210 98765",
            accountType: "Savings",
            accountNumber: "XXXX XXXX 3456",
            customerSince: "2023-01-05",
            status: "suspended",
            kycStatus: "rejected",
            tier: "Basic",
            address: "Chembur, Mumbai",
            occupation: "Teacher",
            annualIncome: "₹7,50,000",
            lastLogin: "2024-03-05 09:15 AM",
            totalAccounts: 1,
            totalCards: 1,
            totalLoans: 0
        },
        {
            id: "CUST-2024-007",
            name: "Suresh Iyer",
            email: "suresh.i@email.com",
            phone: "+91 32109 87654",
            accountType: "Current",
            accountNumber: "XXXX XXXX 7890",
            customerSince: "2020-09-12",
            status: "active",
            kycStatus: "verified",
            tier: "Gold",
            address: "T Nagar, Chennai",
            occupation: "Lawyer",
            annualIncome: "₹20,00,000",
            lastLogin: "2024-03-14 11:30 AM",
            totalAccounts: 2,
            totalCards: 2,
            totalLoans: 1
        },
        {
            id: "CUST-2024-008",
            name: "Neha Gupta",
            email: "neha.g@email.com",
            phone: "+91 21098 76543",
            accountType: "Savings",
            accountNumber: "XXXX XXXX 2345",
            customerSince: "2022-06-20",
            status: "inactive",
            kycStatus: "pending",
            tier: "Silver",
            address: "Salt Lake, Kolkata",
            occupation: "Architect",
            annualIncome: "₹14,00,000",
            lastLogin: "2024-03-08 03:45 PM",
            totalAccounts: 1,
            totalCards: 1,
            totalLoans: 0
        }
    ];

    // Admin/Employee Data
    const adminData = [
        {
            id: "ADMIN-2024-001",
            name: "Arun Prakash",
            email: "arun.p@abcbank.com",
            phone: "+91 99887 66554",
            role: "Branch Manager",
            department: "Retail Banking",
            branch: "Andheri East, Mumbai",
            employeeId: "EMP-2021-458",
            joiningDate: "2021-04-10",
            status: "active",
            accessLevel: "Level 3",
            lastLogin: "2024-03-15 08:45 AM",
            reportsTo: "Regional Head",
            teamSize: 12,
            permissions: ["approve_loans", "approve_limits", "manage_customers"]
        },
        {
            id: "ADMIN-2024-002",
            name: "Kavitha Krishnan",
            email: "kavitha.k@abcbank.com",
            phone: "+91 88776 55443",
            role: "Credit Officer",
            department: "Credit Cards",
            branch: "Banjara Hills, Hyderabad",
            employeeId: "EMP-2022-789",
            joiningDate: "2022-02-15",
            status: "active",
            accessLevel: "Level 2",
            lastLogin: "2024-03-15 09:30 AM",
            reportsTo: "Branch Manager",
            teamSize: 5,
            permissions: ["process_limits", "review_applications"]
        },
        {
            id: "ADMIN-2024-003",
            name: "Deepak Malhotra",
            email: "deepak.m@abcbank.com",
            phone: "+91 77665 44332",
            role: "Customer Service Rep",
            department: "Customer Support",
            branch: "Connaught Place, Delhi",
            employeeId: "EMP-2023-123",
            joiningDate: "2023-01-20",
            status: "active",
            accessLevel: "Level 1",
            lastLogin: "2024-03-15 10:15 AM",
            reportsTo: "Customer Service Manager",
            teamSize: 0,
            permissions: ["view_customers", "respond_queries"]
        },
        {
            id: "ADMIN-2024-004",
            name: "Meera Nambiar",
            email: "meera.n@abcbank.com",
            phone: "+91 66554 33221",
            role: "Risk Analyst",
            department: "Risk Management",
            branch: "Jubilee Hills, Hyderabad",
            employeeId: "EMP-2021-567",
            joiningDate: "2021-11-05",
            status: "active",
            accessLevel: "Level 3",
            lastLogin: "2024-03-14 02:20 PM",
            reportsTo: "Chief Risk Officer",
            teamSize: 4,
            permissions: ["fraud_analysis", "risk_assessment", "audit_logs"]
        },
        {
            id: "ADMIN-2024-005",
            name: "Rahul Verma",
            email: "rahul.v@abcbank.com",
            phone: "+91 55443 33221",
            role: "System Admin",
            department: "IT",
            branch: "Civil Lines, Jaipur",
            employeeId: "EMP-2020-234",
            joiningDate: "2020-08-12",
            status: "inactive",
            accessLevel: "Level 4",
            lastLogin: "2024-03-10 11:30 AM",
            reportsTo: "IT Head",
            teamSize: 6,
            permissions: ["system_config", "user_management", "security_settings"]
        },
        {
            id: "ADMIN-2024-006",
            name: "Shweta Desai",
            email: "shweta.d@abcbank.com",
            phone: "+91 44332 22110",
            role: "Loan Officer",
            department: "Loans",
            branch: "Chembur, Mumbai",
            employeeId: "EMP-2022-890",
            joiningDate: "2022-05-18",
            status: "active",
            accessLevel: "Level 2",
            lastLogin: "2024-03-14 03:45 PM",
            reportsTo: "Branch Manager",
            teamSize: 3,
            permissions: ["approve_loans", "review_applications"]
        }
    ];

    // Get current data based on active tab
    const currentData = activeTab === "customer" ? customerData : adminData;

    // Filter data based on search and status
    const filteredData = currentData.filter(item => {
        const matchesSearch = activeTab === "customer"
            ? item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone.includes(searchTerm)
            : item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // ============ BADGE COMPONENTS ============

    // Status Badge
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            active: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Active" },
            inactive: { color: "#6B8BA4", bg: "rgba(107, 139, 164, 0.1)", icon: FaClock, text: "Inactive" },
            suspended: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaTimesCircle, text: "Suspended" },
            pending: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", icon: FaClock, text: "Pending" }
        };

        const config = statusConfig[status] || statusConfig.inactive;
        const Icon = config.icon;

        return (
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                background: config.bg,
                color: config.color,
                borderRadius: "30px",
                fontSize: "12px",
                fontWeight: "600"
            }}>
                <Icon size={12} />
                {config.text}
            </div>
        );
    };

    // KYC Badge
    const KYCBadge = ({ status }) => {
        const kycConfig = {
            verified: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "KYC Verified" },
            pending: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", icon: FaClock, text: "KYC Pending" },
            rejected: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", icon: FaTimesCircle, text: "KYC Rejected" }
        };

        const config = kycConfig[status] || kycConfig.pending;
        const Icon = config.icon;

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
                <Icon size={10} />
                {config.text}
            </span>
        );
    };

    // Tier Badge
    const TierBadge = ({ tier }) => {
        const tierConfig = {
            Diamond: { color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.1)", text: "💎 Diamond" },
            Platinum: { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", text: "⭐ Platinum" },
            Gold: { color: "#FFD700", bg: "rgba(255, 215, 0, 0.1)", text: "🥇 Gold" },
            Silver: { color: "#94A3B8", bg: "rgba(148, 163, 184, 0.1)", text: "🥈 Silver" },
            Basic: { color: "#6B8BA4", bg: "rgba(107, 139, 164, 0.1)", text: "📘 Basic" }
        };

        const config = tierConfig[tier] || tierConfig.Basic;

        return (
            <span style={{
                padding: "4px 10px",
                background: config.bg,
                color: config.color,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600"
            }}>
                {config.text}
            </span>
        );
    };

    // Role Badge (for Admin)
    const RoleBadge = ({ role }) => {
        let color, bg;

        if (role.includes("Manager")) {
            color = "#8B5CF6";
            bg = "rgba(139, 92, 246, 0.1)";
        } else if (role.includes("Officer") || role.includes("Analyst")) {
            color = "#3B82F6";
            bg = "rgba(59, 130, 246, 0.1)";
        } else if (role.includes("Admin")) {
            color = "#EF4444";
            bg = "rgba(239, 68, 68, 0.1)";
        } else {
            color = "#10B981";
            bg = "rgba(16, 185, 129, 0.1)";
        }

        return (
            <span style={{
                padding: "4px 10px",
                background: bg,
                color: color,
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600"
            }}>
                {role}
            </span>
        );
    };

    // ============ MODAL COMPONENTS ============

    // View Details Modal
    const UserOverviewModal = ({ user, onClose, type }) => {
        if (!user) return null;

        return (
            <div style={styles.modalOverlay} onClick={onClose}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div style={styles.modalHeader}>
                        <div style={styles.modalTitleGroup}>
                            <div style={styles.modalIcon}>
                                {type === "customer" ? (
                                    <FaUser size={20} color="#FFD700" />
                                ) : (
                                    <FaUserTie size={20} color="#FFD700" />
                                )}
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>
                                    {type === "customer" ? "Customer Details" : "Admin Details"}
                                </h3>
                                <p style={styles.modalSubtitle}>ID: {user.id}</p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    {/* Modal Body */}
                    <div style={styles.modalBody}>
                        {/* Status Bar */}
                        <div style={styles.statusBar}>
                            <StatusBadge status={user.status} />
                            {type === "customer" && <KYCBadge status={user.kycStatus} />}
                            {type === "customer" && <TierBadge tier={user.tier} />}
                            {type === "admin" && <RoleBadge role={user.role} />}
                        </div>

                        {/* Personal Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaUser style={styles.sectionIcon} />
                                Personal Information
                            </h4>
                            <div style={styles.infoGrid}>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Full Name</span>
                                    <span style={styles.infoValue}>{user.name}</span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Email Address</span>
                                    <span style={styles.infoValue}>
                                        <FaEnvelope style={{ marginRight: "6px", color: "#FFD700" }} />
                                        {user.email}
                                    </span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Phone Number</span>
                                    <span style={styles.infoValue}>
                                        <FaPhone style={{ marginRight: "6px", color: "#FFD700" }} />
                                        {user.phone}
                                    </span>
                                </div>
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Address</span>
                                    <span style={styles.infoValue}>
                                        <FaMapMarkerAlt style={{ marginRight: "6px", color: "#FFD700" }} />
                                        {user.address || user.branch}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Account/Bank Information */}
                        <div style={styles.infoSection}>
                            <h4 style={styles.sectionTitle}>
                                <FaBuilding style={styles.sectionIcon} />
                                {type === "customer" ? "Account Information" : "Employment Information"}
                            </h4>
                            <div style={styles.infoGrid}>
                                {type === "customer" ? (
                                    <>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Account Number</span>
                                            <span style={styles.infoValue}>{user.accountNumber}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Account Type</span>
                                            <span style={styles.infoValue}>{user.accountType}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Customer Since</span>
                                            <span style={styles.infoValue}>{user.customerSince}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Occupation</span>
                                            <span style={styles.infoValue}>{user.occupation}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Annual Income</span>
                                            <span style={styles.infoValue}>{user.annualIncome}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Last Login</span>
                                            <span style={styles.infoValue}>{user.lastLogin}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Employee ID</span>
                                            <span style={styles.infoValue}>{user.employeeId}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Role</span>
                                            <span style={styles.infoValue}>{user.role}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Department</span>
                                            <span style={styles.infoValue}>{user.department}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Joining Date</span>
                                            <span style={styles.infoValue}>{user.joiningDate}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Access Level</span>
                                            <span style={styles.infoValue}>{user.accessLevel}</span>
                                        </div>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Reports To</span>
                                            <span style={styles.infoValue}>{user.reportsTo}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={styles.modalActions}>
                            <button style={styles.editBtn}>
                                <FaEdit size={14} />
                                Edit {type === "customer" ? "Customer" : "Admin"}
                            </button>
                            <button style={styles.primaryBtn}>
                                {type === "customer" ? (
                                    <>
                                        <FaRegCreditCard size={14} />
                                        Manage Accounts
                                    </>
                                ) : (
                                    <>
                                        <FaShieldAlt size={14} />
                                        Manage Permissions
                                    </>
                                )}
                            </button>
                            <button style={styles.printBtn}>
                                <FaEye size={14} />
                                Activity Log
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const CreateUserModal = ({ type: initialType, onClose, showSnackbar }) => {
        const [userType, setUserType] = useState(initialType || "customer");
        const [formData, setFormData] = useState({
            // Personal Information
            firstName: "",
            lastName: "",
            mobileNumber: "",
            email: "",
            dateOfBirth: "",

            // Address Information
            address: "",
            city: "",
            state: "",
            country: "India",
            pincode: "",

            // Identity Documents
            pancard: "",
            aadhar: "",

            // Account Information
            roleId: "",
            accountTypeId: "",
            initialBalance: "",
            branchName: "",
            branchCode: "",

            // Admin specific
            department: "",
            employeeId: "",
            joiningDate: ""
        });

        const [errors, setErrors] = useState({});
        const [touched, setTouched] = useState({});
        const [isSubmitting, setIsSubmitting] = useState(false);

        const validateForm = () => {
            const newErrors = {};

            // Mark all fields as touched to show validation errors
            const allFields = [
                'firstName', 'lastName', 'mobileNumber', 'email',
                ...(userType === "customer" ? ['dateOfBirth', 'address', 'city', 'state', 'pincode', 'pancard', 'aadhar', 'accountTypeId', 'initialBalance', 'branchName', 'branchCode'] : []),
                ...(userType === "admin" ? ['department', 'employeeId', 'joiningDate', 'branchName'] : []),
                'roleId'
            ];
            
            setTouched(prev => {
                const newTouched = { ...prev };
                allFields.forEach(field => {
                    newTouched[field] = true;
                });
                return newTouched;
            });

            // Personal Information
            if (!formData.firstName.trim()) {
                newErrors.firstName = "First name is required";
            } else if (formData.firstName.length < 2) {
                newErrors.firstName = "First name must be at least 2 characters";
            }

            if (!formData.lastName.trim()) {
                newErrors.lastName = "Last name is required";
            }

            if (!formData.mobileNumber) {
                newErrors.mobileNumber = "Mobile number is required";
            } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
                newErrors.mobileNumber = "Enter a valid 10-digit Indian mobile number";
            }

            if (!formData.email) {
                newErrors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "Enter a valid email address";
            }

            if (userType === "customer") {
                if (!formData.dateOfBirth) {
                    newErrors.dateOfBirth = "Date of birth is required";
                } else {
                    const dob = new Date(formData.dateOfBirth);
                    const today = new Date();
                    const age = today.getFullYear() - dob.getFullYear();
                    if (age < 18) {
                        newErrors.dateOfBirth = "Customer must be at least 18 years old";
                    }
                }

                // Address Information
                if (!formData.address.trim()) {
                    newErrors.address = "Address is required";
                }
                if (!formData.city.trim()) {
                    newErrors.city = "City is required";
                }
                if (!formData.state.trim()) {
                    newErrors.state = "State is required";
                }
                if (!formData.pincode) {
                    newErrors.pincode = "Pincode is required";
                } else if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
                    newErrors.pincode = "Enter a valid 6-digit pincode";
                }

                // Identity Documents
                if (!formData.pancard) {
                    newErrors.pancard = "PAN card is required";
                } else if (!/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(formData.pancard)) {
                    newErrors.pancard = "Enter a valid PAN card number";
                }

                if (!formData.aadhar) {
                    newErrors.aadhar = "Aadhar number is required";
                } else if (!/^\d{12}$/.test(formData.aadhar)) {
                    newErrors.aadhar = "Enter a valid 12-digit Aadhar number";
                }

                // Account Information
                if (!formData.accountTypeId) {
                    newErrors.accountTypeId = "Account type is required";
                }
                if (!formData.initialBalance) {
                    newErrors.initialBalance = "Initial balance is required";
                } else if (parseFloat(formData.initialBalance) < 500) {
                    newErrors.initialBalance = "Minimum initial balance is ₹500";
                }
                if (!formData.branchName.trim()) {
                    newErrors.branchName = "Branch name is required";
                }
                if (!formData.branchCode.trim()) {
                    newErrors.branchCode = "Branch code is required";
                }
                if (!formData.roleId) {
                    newErrors.roleId = "Role is required";
                }
            } else {
                // Admin validation
                if (!formData.department) {
                    newErrors.department = "Department is required";
                }
                if (!formData.employeeId) {
                    newErrors.employeeId = "Employee ID is required";
                }
                if (!formData.joiningDate) {
                    newErrors.joiningDate = "Joining date is required";
                }
                if (!formData.branchName.trim()) {
                    newErrors.branchName = "Branch location is required";
                }
                if (!formData.roleId) {
                    newErrors.roleId = "Role is required";
                }
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            // Clear error for this field
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: "" }));
            }
        };

        const handleBlur = (e) => {
            const { name } = e.target;
            setTouched(prev => ({ ...prev, [name]: true }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (validateForm()) {
                setIsSubmitting(true);
                try {
                    // Format data for API
                    const submitData = {
                        ...formData,
                        roleId: parseInt(formData.roleId),
                        accountTypeId: userType === "customer" ? parseInt(formData.accountTypeId) : null,
                        initialBalance: userType === "customer" ? parseFloat(formData.initialBalance) : null,
                        dateOfBirth: userType === "customer" ? formData.dateOfBirth : null,
                        // Only include customer-specific fields if it's a customer
                        ...(userType === "customer" && {
                            pancard: formData.pancard,
                            aadhar: formData.aadhar,
                            address: formData.address,
                            city: formData.city,
                            state: formData.state,
                            country: formData.country,
                            pincode: formData.pincode
                        }),
                        // Only include admin-specific fields if it's an admin
                        ...(userType === "admin" && {
                            department: formData.department,
                            employeeId: formData.employeeId,
                            joiningDate: formData.joiningDate
                        })
                    };

                    const response = await API.post("users/save", submitData);
                    console.log("response");
                    
                    
                    // Show success message
                    showSnackbar("success", `${userType === 'customer' ? 'Customer' : 'Admin'} created successfully!`);
                    
                    // Close modal
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                    
                } catch (error) {
                    console.error('Error creating user:', error);
                    showSnackbar("error", error.response?.data?.message || `Failed to create ${userType}. Please try again.`);
                } finally {
                    setIsSubmitting(false);
                }
            }
        };

        return (
            <div style={styles.modalOverlay} onClick={onClose}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div style={styles.modalHeader}>
                        <div style={styles.modalTitleGroup}>
                            <div style={styles.modalIcon}>
                                <FaUserPlus size={24} color="#FFD700" />
                            </div>
                            <div>
                                <h3 style={styles.modalTitle}>
                                    Create New {userType === "customer" ? "Customer" : "Administrator"}
                                </h3>
                                <p style={styles.modalSubtitle}>
                                    Fill in all the required details to create a new {userType}
                                </p>
                            </div>
                        </div>
                        <button style={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={styles.modalBody}>
                            {/* User Type Selection */}
                            <div style={styles.userTypeSection}>
                                <label style={styles.sectionLabel}>Select User Type</label>
                                <div style={styles.userTypeToggle}>
                                    <button
                                        type="button"
                                        style={{
                                            ...styles.userTypeBtn,
                                            ...(userType === "customer" ? styles.userTypeBtnActive : {})
                                        }}
                                        onClick={() => setUserType("customer")}
                                    >
                                        <FaUser size={14} />
                                        Customer
                                    </button>
                                    <button
                                        type="button"
                                        style={{
                                            ...styles.userTypeBtn,
                                            ...(userType === "admin" ? styles.userTypeBtnActive : {})
                                        }}
                                        onClick={() => setUserType("admin")}
                                    >
                                        <FaShieldAlt size={14} />
                                        Admin
                                    </button>
                                </div>
                            </div>

                            {/* Personal Information Section */}
                            <div style={styles.formSection}>
                                <div style={styles.sectionHeader}>
                                    <FaUser size={16} color="#4361ee" />
                                    <h4 style={styles.sectionTitle}>Personal Information</h4>
                                </div>
                                <div style={styles.infoGrid}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            First Name <span style={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{
                                                ...styles.formInput,
                                                ...(touched.firstName && errors.firstName ? styles.inputError : {})
                                            }}
                                            placeholder="Enter first name"
                                        />
                                        {touched.firstName && errors.firstName && (
                                            <span style={styles.errorText}>{errors.firstName}</span>
                                        )}
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            Last Name <span style={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{
                                                ...styles.formInput,
                                                ...(touched.lastName && errors.lastName ? styles.inputError : {})
                                            }}
                                            placeholder="Enter last name"
                                        />
                                        {touched.lastName && errors.lastName && (
                                            <span style={styles.errorText}>{errors.lastName}</span>
                                        )}
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            Mobile Number <span style={styles.required}>*</span>
                                        </label>
                                        <div style={styles.inputWithIcon}>
                                            <FaPhone style={styles.inputIcon} size={14} color="#94a3b8" />
                                            <input
                                                type="tel"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                style={{
                                                    ...styles.formInputWithIcon,
                                                    ...(touched.mobileNumber && errors.mobileNumber ? styles.inputError : {})
                                                }}
                                                placeholder="9876543210"
                                                maxLength="10"
                                            />
                                        </div>
                                        {touched.mobileNumber && errors.mobileNumber && (
                                            <span style={styles.errorText}>{errors.mobileNumber}</span>
                                        )}
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            Email Address <span style={styles.required}>*</span>
                                        </label>
                                        <div style={styles.inputWithIcon}>
                                            <FaEnvelope style={styles.inputIcon} size={14} color="#94a3b8" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                style={{
                                                    ...styles.formInputWithIcon,
                                                    ...(touched.email && errors.email ? styles.inputError : {})
                                                }}
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                        {touched.email && errors.email && (
                                            <span style={styles.errorText}>{errors.email}</span>
                                        )}
                                    </div>

                                    {userType === "customer" && (
                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>
                                                Date of Birth <span style={styles.required}>*</span>
                                            </label>
                                            <div style={styles.inputWithIcon}>
                                                <FaCalendarAlt style={styles.inputIcon} size={14} color="#94a3b8" />
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    style={{
                                                        ...styles.formInputWithIcon,
                                                        ...(touched.dateOfBirth && errors.dateOfBirth ? styles.inputError : {})
                                                    }}
                                                />
                                            </div>
                                            {touched.dateOfBirth && errors.dateOfBirth && (
                                                <span style={styles.errorText}>{errors.dateOfBirth}</span>
                                            )}
                                        </div>
                                    )}

                                    {userType === "admin" && (
                                        <>
                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    Employee ID <span style={styles.required}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="employeeId"
                                                    value={formData.employeeId}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    style={{
                                                        ...styles.formInput,
                                                        ...(touched.employeeId && errors.employeeId ? styles.inputError : {})
                                                    }}
                                                    placeholder="EMP001234"
                                                />
                                                {touched.employeeId && errors.employeeId && (
                                                    <span style={styles.errorText}>{errors.employeeId}</span>
                                                )}
                                            </div>
                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    Joining Date <span style={styles.required}>*</span>
                                                </label>
                                                <div style={styles.inputWithIcon}>
                                                    <FaCalendarAlt style={styles.inputIcon} size={14} color="#94a3b8" />
                                                    <input
                                                        type="date"
                                                        name="joiningDate"
                                                        value={formData.joiningDate}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        style={{
                                                            ...styles.formInputWithIcon,
                                                            ...(touched.joiningDate && errors.joiningDate ? styles.inputError : {})
                                                        }}
                                                    />
                                                </div>
                                                {touched.joiningDate && errors.joiningDate && (
                                                    <span style={styles.errorText}>{errors.joiningDate}</span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Customer Only Sections */}
                            {userType === "customer" && (
                                <>
                                    {/* Address Section */}
                                    <div style={styles.formSection}>
                                        <div style={styles.sectionHeader}>
                                            <FaMapMarkerAlt size={16} color="#4361ee" />
                                            <h4 style={styles.sectionTitle}>Address Information</h4>
                                        </div>
                                        <div style={styles.infoGrid}>
                                            <div style={{ ...styles.formGroup, gridColumn: "span 2" }}>
                                                <label style={styles.formLabel}>
                                                    Address <span style={styles.required}>*</span>
                                                </label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    style={{
                                                        ...styles.formTextarea,
                                                        ...(touched.address && errors.address ? styles.inputError : {})
                                                    }}
                                                    placeholder="Enter complete address"
                                                    rows="2"
                                                />
                                                {touched.address && errors.address && (
                                                    <span style={styles.errorText}>{errors.address}</span>
                                                )}
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    City <span style={styles.required}>*</span>
                                                </label>
                                                <div style={styles.inputWithIcon}>
                                                    <FaCity style={styles.inputIcon} size={14} color="#94a3b8" />
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        style={{
                                                            ...styles.formInputWithIcon,
                                                            ...(touched.city && errors.city ? styles.inputError : {})
                                                        }}
                                                        placeholder="Chennai"
                                                    />
                                                </div>
                                                {touched.city && errors.city && (
                                                    <span style={styles.errorText}>{errors.city}</span>
                                                )}
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    State <span style={styles.required}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    style={{
                                                        ...styles.formInput,
                                                        ...(touched.state && errors.state ? styles.inputError : {})
                                                    }}
                                                    placeholder="Tamil Nadu"
                                                />
                                                {touched.state && errors.state && (
                                                    <span style={styles.errorText}>{errors.state}</span>
                                                )}
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    Country <span style={styles.required}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    style={styles.formInput}
                                                    placeholder="India"
                                                    readOnly
                                                />
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    Pincode <span style={styles.required}>*</span>
                                                </label>
                                                <div style={styles.inputWithIcon}>
                                                    <FaMapPin style={styles.inputIcon} size={14} color="#94a3b8" />
                                                    <input
                                                        type="text"
                                                        name="pincode"
                                                        value={formData.pincode}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        style={{
                                                            ...styles.formInputWithIcon,
                                                            ...(touched.pincode && errors.pincode ? styles.inputError : {})
                                                        }}
                                                        placeholder="600040"
                                                        maxLength="6"
                                                    />
                                                </div>
                                                {touched.pincode && errors.pincode && (
                                                    <span style={styles.errorText}>{errors.pincode}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Identity Documents Section */}
                                    <div style={styles.formSection}>
                                        <div style={styles.sectionHeader}>
                                            <FaIdCard size={16} color="#4361ee" />
                                            <h4 style={styles.sectionTitle}>Identity Documents</h4>
                                        </div>
                                        <div style={styles.infoGrid}>
                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    PAN Card <span style={styles.required}>*</span>
                                                </label>
                                                <div style={styles.inputWithIcon}>
                                                    <FaIdCard style={styles.inputIcon} size={14} color="#94a3b8" />
                                                    <input
                                                        type="text"
                                                        name="pancard"
                                                        value={formData.pancard}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        style={{
                                                            ...styles.formInputWithIcon,
                                                            ...(touched.pancard && errors.pancard ? styles.inputError : {})
                                                        }}
                                                        placeholder="ABCDE1234F"
                                                        maxLength="10"
                                                    />
                                                </div>
                                                {touched.pancard && errors.pancard && (
                                                    <span style={styles.errorText}>{errors.pancard}</span>
                                                )}
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    Aadhar Number <span style={styles.required}>*</span>
                                                </label>
                                                <div style={styles.inputWithIcon}>
                                                    <FaAddressCard style={styles.inputIcon} size={14} color="#94a3b8" />
                                                    <input
                                                        type="text"
                                                        name="aadhar"
                                                        value={formData.aadhar}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        style={{
                                                            ...styles.formInputWithIcon,
                                                            ...(touched.aadhar && errors.aadhar ? styles.inputError : {})
                                                        }}
                                                        placeholder="123456789876"
                                                        maxLength="12"
                                                    />
                                                </div>
                                                {touched.aadhar && errors.aadhar && (
                                                    <span style={styles.errorText}>{errors.aadhar}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Account/Branch Information Section */}
                            <div style={styles.formSection}>
                                <div style={styles.sectionHeader}>
                                    <FaBuilding size={16} color="#4361ee" />
                                    <h4 style={styles.sectionTitle}>
                                        {userType === "customer" ? "Account Information" : "Branch Information"}
                                    </h4>
                                </div>
                                <div style={styles.infoGrid}>
                                    {userType === "customer" && (
                                        <>
                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    Account Type <span style={styles.required}>*</span>
                                                </label>
                                                <select
                                                    name="accountTypeId"
                                                    value={formData.accountTypeId}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    style={{
                                                        ...styles.formSelect,
                                                        ...(touched.accountTypeId && errors.accountTypeId ? styles.inputError : {})
                                                    }}
                                                >
                                                    <option value="">Select account type</option>
                                                    <option value="1">Savings Account</option>
                                                    <option value="2">Current Account</option>
                                                    <option value="3">Salary Account</option>
                                                    <option value="4">Fixed Deposit</option>
                                                </select>
                                                {touched.accountTypeId && errors.accountTypeId && (
                                                    <span style={styles.errorText}>{errors.accountTypeId}</span>
                                                )}
                                            </div>

                                            <div style={styles.formGroup}>
                                                <label style={styles.formLabel}>
                                                    Initial Balance <span style={styles.required}>*</span>
                                                </label>
                                                <div style={styles.inputWithIcon}>
                                                    {/* <FaIndianRupeeSign style={styles.inputIcon} size={14} color="#94a3b8" /> */}
                                                    <input
                                                        type="number"
                                                        name="initialBalance"
                                                        value={formData.initialBalance}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        style={{
                                                            ...styles.formInputWithIcon,
                                                            ...(touched.initialBalance && errors.initialBalance ? styles.inputError : {})
                                                        }}
                                                        placeholder="5000"
                                                        min="500"
                                                        step="100"
                                                    />
                                                </div>
                                                {touched.initialBalance && errors.initialBalance && (
                                                    <span style={styles.errorText}>{errors.initialBalance}</span>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            {userType === "customer" ? "Branch Name" : "Branch Location"} <span style={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="branchName"
                                            value={formData.branchName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{
                                                ...styles.formInput,
                                                ...(touched.branchName && errors.branchName ? styles.inputError : {})
                                            }}
                                            placeholder={userType === "customer" ? "Chennai Main Branch" : "Enter branch location"}
                                        />
                                        {touched.branchName && errors.branchName && (
                                            <span style={styles.errorText}>{errors.branchName}</span>
                                        )}
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            {userType === "customer" ? "Branch Code" : "Department"} <span style={styles.required}>*</span>
                                        </label>
                                        {userType === "customer" ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="branchCode"
                                                    value={formData.branchCode}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    style={{
                                                        ...styles.formInput,
                                                        ...(touched.branchCode && errors.branchCode ? styles.inputError : {})
                                                    }}
                                                    placeholder="CHN001"
                                                />
                                                {touched.branchCode && errors.branchCode && (
                                                    <span style={styles.errorText}>{errors.branchCode}</span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <select
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    style={{
                                                        ...styles.formSelect,
                                                        ...(touched.department && errors.department ? styles.inputError : {})
                                                    }}
                                                >
                                                    <option value="">Select department</option>
                                                    <option value="retail">Retail Banking</option>
                                                    <option value="credit">Credit Cards</option>
                                                    <option value="loans">Loans</option>
                                                    <option value="it">IT</option>
                                                    <option value="risk">Risk Management</option>
                                                    <option value="operations">Operations</option>
                                                    <option value="compliance">Compliance</option>
                                                </select>
                                                {touched.department && errors.department && (
                                                    <span style={styles.errorText}>{errors.department}</span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.formLabel}>
                                            Role <span style={styles.required}>*</span>
                                        </label>
                                        <select
                                            name="roleId"
                                            value={formData.roleId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{
                                                ...styles.formSelect,
                                                ...(touched.roleId && errors.roleId ? styles.inputError : {})
                                            }}
                                        >
                                            <option value="">Select role</option>
                                            {userType === "customer" ? (
                                                <>
                                                    <option value="2">Customer</option>
                                                    <option value="3">Premium Customer</option>
                                                    <option value="4">Business Customer</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="5">Teller</option>
                                                    <option value="6">Customer Service</option>
                                                    <option value="7">Branch Manager</option>
                                                    <option value="8">Admin</option>
                                                    <option value="9">Super Admin</option>
                                                </>
                                            )}
                                        </select>
                                        {touched.roleId && errors.roleId && (
                                            <span style={styles.errorText}>{errors.roleId}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div style={styles.modalActions}>
                                <button 
                                    type="submit" 
                                    style={{
                                        ...styles.approveBtn,
                                        opacity: isSubmitting ? 0.7 : 1,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid #ffffff',
                                                borderTop: '2px solid transparent',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                                marginRight: '8px'
                                            }}></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheckCircle size={16} />
                                            Create {userType === "customer" ? "Customer" : "Admin"}
                                        </>
                                    )}
                                </button>
                                <button type="button" style={styles.rejectBtn} onClick={onClose}>
                                    <FaTimesCircle size={16} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // ============ MAIN RENDER ============
    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.headerIcon}>
                        <FaUsers size={24} color="#FFD700" />
                    </div>
                    <div>
                        <h1 style={styles.title}>Customer & Admin Management</h1>
                        <p style={styles.subtitle}>Manage customers, administrators, and their permissions</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>{customerData.length}</span>
                        <span style={styles.statLabel}>Total Customers</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>{adminData.length}</span>
                        <span style={styles.statLabel}>Total Admins</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statValue}>
                            {customerData.filter(c => c.status === "active").length}
                        </span>
                        <span style={styles.statLabel}>Active Users</span>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div style={styles.tabsContainer}>
                <div style={styles.tabsWrapper}>
                    {/* Customer Tab */}
                    <div
                        style={{
                            ...styles.tab,
                            background: activeTab === "customer"
                                ? "linear-gradient(135deg, #003366, #002244)"
                                : "transparent",
                            border: activeTab === "customer"
                                ? "2px solid #FFD700"
                                : "2px solid #E6EDF5",
                            color: activeTab === "customer" ? "#FFFFFF" : "#003366"
                        }}
                        onClick={() => {
                            setActiveTab("customer");
                            setCurrentPage(1);
                            setSearchTerm("");
                            setStatusFilter("all");
                        }}
                    >
                        <FaUser size={16} style={{ marginRight: "8px" }} />
                        Customers
                        {activeTab === "customer" && (
                            <span style={styles.tabCount}>{customerData.length}</span>
                        )}
                    </div>

                    {/* Admin Tab */}
                    <div
                        style={{
                            ...styles.tab,
                            background: activeTab === "admin"
                                ? "linear-gradient(135deg, #003366, #002244)"
                                : "transparent",
                            border: activeTab === "admin"
                                ? "2px solid #FFD700"
                                : "2px solid #E6EDF5",
                            color: activeTab === "admin" ? "#FFFFFF" : "#003366"
                        }}
                        onClick={() => {
                            setActiveTab("admin");
                            setCurrentPage(1);
                            setSearchTerm("");
                            setStatusFilter("all");
                        }}
                    >
                        <FaUserTie size={16} style={{ marginRight: "8px" }} />
                        Administrators
                        {activeTab === "admin" && (
                            <span style={styles.tabCount}>{adminData.length}</span>
                        )}
                    </div>
                </div>

                {/* Create Button - Top Right */}
                <button
                    style={styles.createBtn}
                    onClick={() => setShowCreateModal(true)}
                >
                    <FaPlus size={14} />
                    Create {activeTab === "customer" ? "Customer" : "Admin"}
                </button>
            </div>

            {/* Filters Section */}
            <div style={styles.filtersContainer}>
                <div style={styles.searchBox}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={activeTab === "customer"
                            ? "Search by ID, name, email or phone..."
                            : "Search by ID, name, email or role..."
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                <div style={styles.filterGroup}>
                    <FaFilter style={styles.filterIcon} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                        {activeTab === "customer" && <option value="pending">Pending</option>}
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={styles.tableHead}>
                        <tr>
                            {activeTab === "customer" ? (
                                // Customer Table Headers
                                <>
                                    <th style={styles.tableHeader}>Customer ID</th>
                                    <th style={styles.tableHeader}>Customer Name</th>
                                    <th style={styles.tableHeader}>Contact</th>
                                    <th style={styles.tableHeader}>Account Type</th>
                                    <th style={styles.tableHeader}>Customer Since</th>
                                    <th style={styles.tableHeader}>Tier</th>
                                    <th style={styles.tableHeader}>KYC Status</th>
                                    <th style={styles.tableHeader}>Status</th>
                                    <th style={styles.tableHeader}>Actions</th>
                                </>
                            ) : (
                                // Admin Table Headers
                                <>
                                    <th style={styles.tableHeader}>Admin ID</th>
                                    <th style={styles.tableHeader}>Name</th>
                                    <th style={styles.tableHeader}>Role</th>
                                    <th style={styles.tableHeader}>Department</th>
                                    <th style={styles.tableHeader}>Branch</th>
                                    <th style={styles.tableHeader}>Employee ID</th>
                                    <th style={styles.tableHeader}>Access Level</th>
                                    <th style={styles.tableHeader}>Status</th>
                                    <th style={styles.tableHeader}>Actions</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item) => (
                            <tr key={item.id} style={styles.tableRow}>
                                {activeTab === "customer" ? (
                                    // Customer Table Rows
                                    <>
                                        <td style={styles.tableCell}>
                                            <span style={styles.requestId}>{item.id}</span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={styles.accountHolder}>{item.name}</span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                <span style={{ fontSize: "12px", color: "#4A6F8F" }}>
                                                    <FaEnvelope style={{ marginRight: "6px", color: "#FFD700", fontSize: "10px" }} />
                                                    {item.email}
                                                </span>
                                                <span style={{ fontSize: "12px", color: "#4A6F8F" }}>
                                                    <FaPhone style={{ marginRight: "6px", color: "#FFD700", fontSize: "10px" }} />
                                                    {item.phone}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={styles.deliveryMethod}>{item.accountType}</span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={styles.dateCell}>
                                                <FaCalendarAlt style={styles.dateIcon} />
                                                {item.customerSince}
                                            </div>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <TierBadge tier={item.tier} />
                                        </td>
                                        <td style={styles.tableCell}>
                                            <KYCBadge status={item.kycStatus} />
                                        </td>
                                        <td style={styles.tableCell}>
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                <button
                                                    style={styles.iconBtn}
                                                    onClick={() => {
                                                        setSelectedUser(item);
                                                        setShowOverview(true);
                                                    }}
                                                    title="View Details"
                                                >
                                                    <FaEye style={{ color: "#003366", fontSize: "14px" }} />
                                                </button>
                                                <button
                                                    style={styles.iconBtn}
                                                    title="Edit"
                                                >
                                                    <FaEdit style={{ color: "#F59E0B", fontSize: "14px" }} />
                                                </button>
                                                <button
                                                    style={styles.iconBtn}
                                                    title="Delete"
                                                >
                                                    <FaTrash style={{ color: "#EF4444", fontSize: "14px" }} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    // Admin Table Rows
                                    <>
                                        <td style={styles.tableCell}>
                                            <span style={styles.requestId}>{item.id}</span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={styles.accountHolder}>{item.name}</span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <RoleBadge role={item.role} />
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={{ color: "#4A6F8F" }}>{item.department}</span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={{ color: "#4A6F8F" }}>{item.branch}</span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={{ fontFamily: "monospace", color: "#003366" }}>
                                                {item.employeeId}
                                            </span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <span style={{
                                                padding: "4px 10px",
                                                background: "rgba(59, 130, 246, 0.1)",
                                                color: "#3B82F6",
                                                borderRadius: "20px",
                                                fontSize: "11px",
                                                fontWeight: "600"
                                            }}>
                                                {item.accessLevel}
                                            </span>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                <button
                                                    style={styles.iconBtn}
                                                    onClick={() => {
                                                        setSelectedUser(item);
                                                        setShowOverview(true);
                                                    }}
                                                    title="View Details"
                                                >
                                                    <FaEye style={{ color: "#003366", fontSize: "14px" }} />
                                                </button>
                                                <button
                                                    style={styles.iconBtn}
                                                    title="Edit"
                                                >
                                                    <FaEdit style={{ color: "#F59E0B", fontSize: "14px" }} />
                                                </button>
                                                <button
                                                    style={styles.iconBtn}
                                                    title="Delete"
                                                >
                                                    <FaTrash style={{ color: "#EF4444", fontSize: "14px" }} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* No Data Message */}
                {paginatedData.length === 0 && (
                    <div style={styles.noData}>
                        <FaUsers size={48} style={styles.noDataIcon} />
                        <p style={styles.noDataText}>No {activeTab === "customer" ? "customers" : "admins"} found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
                <div style={styles.pagination}>
                    <button
                        style={{
                            ...styles.pageBtn,
                            opacity: currentPage === 1 ? 0.5 : 1,
                            cursor: currentPage === 1 ? "not-allowed" : "pointer"
                        }}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft style={{ color: "#003366", fontSize: "12px" }} />
                    </button>
                    <span style={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        style={{
                            ...styles.pageBtn,
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                        }}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight style={{ color: "#003366", fontSize: "12px" }} />
                    </button>
                </div>
            )}

            {/* Modals */}
            {showOverview && selectedUser && (
                <UserOverviewModal
                    user={selectedUser}
                    type={activeTab}
                    onClose={() => {
                        setShowOverview(false);
                        setSelectedUser(null);
                    }}
                />
            )}

            {showCreateModal && (
                <CreateUserModal
                    type={activeTab}
                    onClose={() => setShowCreateModal(false)}
                    showSnackbar={showSnackbar}
                />
            )}
        </div>
    );
};

// Add global animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .info-grid {
            grid-template-columns: 1fr !important;
        }
        
        .modal-content {
            max-width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            max-height: 100vh !important;
        }
        
        .modal-actions {
            flex-direction: column !important;
        }
        
        .user-type-toggle {
            flex-direction: column !important;
        }
    }
`;
document.head.appendChild(styleSheet);

// ============ STYLES - EXACT MATCH WITH YOUR DESIGN SYSTEM ============
const styles = {
    container: {
        padding: "30px",
        background: "#F5F9FF",
        minHeight: "100vh",
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
    statsContainer: {
        display: "flex",
        gap: "16px",
    },
    statCard: {
        background: "#FFFFFF",
        padding: "12px 24px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.15)",
    },
    statValue: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#003366",
    },
    statLabel: {
        fontSize: "12px",
        color: "#4A6F8F",
        marginTop: "4px",
    },
    // Tabs Styles
    tabsContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },
    tabsWrapper: {
        display: "flex",
        gap: "12px",
    },
    tab: {
        display: "flex",
        alignItems: "center",
        padding: "12px 24px",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "15px",
        transition: "all 0.2s ease",
        position: "relative",
    },
    tabCount: {
        marginLeft: "10px",
        padding: "2px 8px",
        background: "rgba(255, 215, 0, 0.2)",
        borderRadius: "30px",
        fontSize: "12px",
        color: "#FFD700",
    },
    createBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        background: "linear-gradient(135deg, #003366, #002244)",
        border: "2px solid #FFD700",
        borderRadius: "14px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.15)",
    },
    filtersContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        gap: "20px",
    },
    searchBox: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "2px solid #E6EDF5",
        transition: "all 0.2s ease",
    },
    searchIcon: {
        color: "#6B8BA4",
        fontSize: "16px",
    },
    searchInput: {
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: "14px",
        color: "#003366",
    },
    filterGroup: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        background: "#FFFFFF",
        borderRadius: "16px",
        border: "2px solid #E6EDF5",
        minWidth: "200px",
    },
    filterIcon: {
        color: "#FFD700",
        fontSize: "14px",
    },
    filterSelect: {
        flex: 1,
        border: "none",
        outline: "none",
        fontSize: "14px",
        color: "#003366",
        fontWeight: "500",
        background: "transparent",
        cursor: "pointer",
    },
    tableContainer: {
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(0, 51, 102, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        overflow: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableHead: {
        background: "#F8FBFF",
    },
    tableHeader: {
        padding: "16px",
        textAlign: "left",
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
        borderBottom: "2px solid #FFD700",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    tableRow: {
        borderBottom: "1px solid #E6EDF5",
        transition: "background 0.2s ease",
    },
    tableCell: {
        padding: "16px",
        fontSize: "14px",
        color: "#1E293B",
    },
    requestId: {
        fontWeight: "600",
        color: "#003366",
        fontFamily: "monospace",
    },
    accountHolder: {
        fontWeight: "600",
        color: "#1E293B",
    },
    dateCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#4A6F8F",
    },
    dateIcon: {
        color: "#FFD700",
        fontSize: "12px",
    },
    deliveryMethod: {
        padding: "4px 10px",
        background: "#F0F7FF",
        borderRadius: "20px",
        fontSize: "12px",
        color: "#0052A5",
        fontWeight: "500",
    },
    iconBtn: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        border: "1px solid #E6EDF5",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        color: "inherit", // This ensures it doesn't override icon colors
        padding: 0, // Remove default button padding
    },
    noData: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        textAlign: "center",
    },
    noDataIcon: {
        color: "#FFD700",
        opacity: 0.5,
        marginBottom: "16px",
    },
    noDataText: {
        fontSize: "16px",
        color: "#4A6F8F",
        margin: 0,
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginTop: "24px",
    },
    pageBtn: {
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#003366",
        transition: "all 0.2s ease",
    },
    pageInfo: {
        fontSize: "14px",
        color: "#4A6F8F",
        fontWeight: "500",
    },
    // Modal Styles - Exact match with your design system
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 51, 102, 0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modalContent: {
        width: "90%",
        maxWidth: "800px",
        maxHeight: "90vh",
        overflow: "auto",
        background: "#FFFFFF",
        borderRadius: "32px",
        boxShadow: "0 25px 50px rgba(0, 51, 102, 0.25)",
        border: "1px solid rgba(255, 215, 0, 0.2)",
    },
    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "24px 32px",
        borderBottom: "1px solid #E6EDF5",
        background: "linear-gradient(135deg, #F8FBFF, #FFFFFF)",
    },
    modalTitleGroup: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    modalIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #003366, #002244)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalTitle: {
        fontSize: "20px",
        fontWeight: "700",
        margin: 0,
        color: "#003366",
    },
    modalSubtitle: {
        fontSize: "13px",
        margin: "4px 0 0",
        color: "#4A6F8F",
        fontFamily: "monospace",
    },
    closeBtn: {
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        border: "2px solid #E6EDF5",
        background: "#FFFFFF",
        fontSize: "24px",
        fontWeight: "500",
        color: "#4A6F8F",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
    },
    modalBody: {
        padding: "32px",
    },
    statusBar: {
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        paddingBottom: "24px",
        borderBottom: "1px solid #E6EDF5",
    },
    infoSection: {
        marginBottom: "28px",
    },
    sectionTitle: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#003366",
        marginBottom: "16px",
    },
    sectionIcon: {
        color: "#FFD700",
        fontSize: "16px",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
        background: "#F8FBFF",
        padding: "20px",
        borderRadius: "16px",
    },
    infoRow: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    infoLabel: {
        fontSize: "12px",
        color: "#6B8BA4",
        fontWeight: "500",
    },
    infoValue: {
        fontSize: "15px",
        color: "#003366",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
    },
    modalActions: {
        display: "flex",
        gap: "12px",
        marginTop: "32px",
        paddingTop: "24px",
        borderTop: "1px solid #E6EDF5",
    },
    approveBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "linear-gradient(135deg, #10B981, #059669)",
        border: "none",
        borderRadius: "14px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    rejectBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "#FFFFFF",
        border: "2px solid #EF4444",
        borderRadius: "14px",
        color: "#EF4444",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    editBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "#FFFFFF",
        border: "2px solid #3B82F6",
        borderRadius: "14px",
        color: "#3B82F6",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    primaryBtn: {
        flex: 1,
        padding: "14px 20px",
        background: "linear-gradient(135deg, #003366, #002244)",
        border: "none",
        borderRadius: "14px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    printBtn: {
        padding: "14px 20px",
        background: "#FFFFFF",
        border: "2px solid #E6EDF5",
        borderRadius: "14px",
        color: "#4A6F8F",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    // Form Styles
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    formLabel: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#003366",
    },
    formInput: {
        padding: "12px 16px",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#003366",
        outline: "none",
        transition: "all 0.2s ease",
    },
    formSelect: {
        padding: "12px 16px",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#003366",
        outline: "none",
        transition: "all 0.2s ease",
        background: "#FFFFFF",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
    },
    modalContent: {
        width: "100%",
        maxWidth: "900px",
        maxHeight: "90vh",
        overflowY: "auto",
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        animation: "slideIn 0.3s ease",
    },
    modalHeader: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "24px",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        background: "#ffffff",
        zIndex: 10,
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
    },
    modalTitleGroup: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    modalIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #f59e0b20, #f9731620)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 4px 0",
    },
    modalSubtitle: {
        fontSize: "14px",
        color: "#64748b",
        margin: 0,
    },
    closeBtn: {
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        fontSize: "24px",
        color: "#64748b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    modalBody: {
        padding: "24px",
    },
    userTypeSection: {
        marginBottom: "24px",
        padding: "20px",
        background: "#f8fafc",
        borderRadius: "16px",
    },
    sectionLabel: {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#0f172a",
        marginBottom: "12px",
    },
    userTypeToggle: {
        display: "flex",
        gap: "12px",
    },
    userTypeBtn: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 20px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        fontSize: "15px",
        fontWeight: "600",
        color: "#475569",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    userTypeBtnActive: {
        background: "#4361ee",
        color: "#ffffff",
        borderColor: "#4361ee",
    },
    formSection: {
        marginBottom: "32px",
        padding: "20px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid #e2e8f0",
    },
    sectionTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#0f172a",
        margin: 0,
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    formLabel: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#1e293b",
    },
    required: {
        color: "#ef4444",
    },
    formInput: {
        width: "100%",
        padding: "12px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#0f172a",
        transition: "all 0.2s",
        outline: "none",
        ":focus": {
            borderColor: "#4361ee",
            boxShadow: "0 0 0 3px #4361ee20",
        },
    },
    formInputWithIcon: {
        width: "100%",
        padding: "12px 16px 12px 40px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#0f172a",
        transition: "all 0.2s",
        outline: "none",
    },
    inputWithIcon: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    inputIcon: {
        position: "absolute",
        left: "16px",
        color: "#94a3b8",
    },
    formSelect: {
        width: "100%",
        padding: "12px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#0f172a",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        outline: "none",
    },
    formTextarea: {
        width: "100%",
        padding: "12px 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#0f172a",
        resize: "vertical",
        fontFamily: "inherit",
        outline: "none",
    },
    inputError: {
        borderColor: "#ef4444",
        backgroundColor: "#fef2f2",
    },
    errorText: {
        fontSize: "12px",
        color: "#ef4444",
        marginTop: "4px",
    },
    modalActions: {
        display: "flex",
        gap: "12px",
        marginTop: "32px",
        paddingTop: "24px",
        borderTop: "1px solid #e2e8f0",
    },
    approveBtn: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "14px 24px",
        background: "linear-gradient(135deg, #10b981, #059669)",
        border: "none",
        borderRadius: "14px",
        color: "#ffffff",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    rejectBtn: {
        flex: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "14px 24px",
        background: "#f1f5f9",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        color: "#475569",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
};

export default CustomerAdminManagement;