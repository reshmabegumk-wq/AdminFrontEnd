import React, { useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaIdCard,
    FaCreditCard,
    FaShieldAlt,
    FaBuilding,
    FaBriefcase,
    FaRupeeSign,
    FaGlobe,
    FaEdit,
    FaCamera,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaArrowLeft,
    FaSave,
    FaBan,
    FaKey,
    FaMobile,
    FaLock,
    FaUnlock,
    FaBell,
    FaMoon,
    FaSun,
    FaDownload,
    FaPrint,
    FaChevronRight,
    FaChevronLeft,
    FaUserTie,
    FaChartLine,
    FaFileInvoiceDollar,
    FaHistory
} from "react-icons/fa";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // ============ PROFILE DATA ============
    const [profileData, setProfileData] = useState({
        // Personal Information
        customerName: "Rajesh Sharma",
        email: "rajesh.sharma@email.com",
        mobile: "+91 98765 43210",
        alternateMobile: "+91 87654 32109",
        dateOfBirth: "1985-05-15",
        gender: "Male",
        maritalStatus: "Married",
        anniversary: "2010-12-10",
        
        // Account Information
        customerId: "CUST-2024-001",
        accountNumber: "XXXX XXXX 4582",
        accountType: "Savings",
        branch: "Andheri East, Mumbai",
        ifscCode: "ABC0001234",
        swiftCode: "ABCXINBB",
        customerSince: "2019-05-15",
        
        // Contact Information
        address: "Flat No. 402, Sunshine Apartments, Andheri East",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400069",
        country: "India",
        
        // Employment Information
        occupation: "Software Engineer",
        employmentType: "Salaried",
        annualIncome: "₹12,00,000",
        employerName: "Tech Solutions Pvt Ltd",
        employerAddress: "BKC, Mumbai",
        yearsOfExperience: "8 years",
        
        // KYC Information
        panNumber: "ABCDE1234F",
        aadharNumber: "XXXX-XXXX-1234",
        passportNumber: "Z1234567",
        drivingLicense: "MH01-20210012345",
        kycStatus: "verified",
        
        // Preferences
        language: "English",
        notificationPreference: "Email & SMS",
        twoFactorAuth: true,
        transactionAlerts: true,
        marketingEmails: false,
        theme: "light",
        
        // Nominee Information
        nomineeName: "Priya Sharma",
        nomineeRelationship: "Spouse",
        nomineePercentage: "100%",
        
        // Cards & Accounts
        totalCards: 3,
        activeCards: 2,
        totalAccounts: 4,
        creditScore: 780,
        
        // Security
        lastLogin: "2024-03-15 09:30 AM",
        lastPasswordChange: "2024-02-01",
        loginAttempts: 0,
        accountLocked: false
    });

    // ============ PROFILE STATS ============
    const profileStats = [
        { label: "Account Age", value: "5 years", icon: FaCalendarAlt },
        { label: "Credit Score", value: "780", subtitle: "Excellent", icon: FaShieldAlt },
        { label: "Active Cards", value: "3", icon: FaCreditCard },
        { label: "Service Requests", value: "2", subtitle: "Pending", icon: FaFileInvoiceDollar }
    ];

    // ============ RECENT ACTIVITIES ============
    const recentActivities = [
        { id: 1, action: "Password Changed", date: "2024-03-15", time: "09:30 AM", status: "completed" },
        { id: 2, action: "Profile Updated", date: "2024-03-10", time: "02:15 PM", status: "completed" },
        { id: 3, action: "New Card Activated", date: "2024-03-05", time: "11:45 AM", status: "completed" },
        { id: 4, action: "Address Change Request", date: "2024-02-28", time: "10:30 AM", status: "pending" }
    ];

    // ============ HANDLE EDIT TOGGLE ============
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsEditing(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data here if needed
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // ============ STATUS BADGE ============
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            verified: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Verified" },
            pending: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", icon: FaClock, text: "Pending" },
            completed: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", icon: FaCheckCircle, text: "Completed" },
            active: { color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", text: "Active" }
        };

        const config = statusConfig[status] || statusConfig.active;

        return (
            <span style={{
                padding: "4px 12px",
                background: config.bg,
                color: config.color,
                borderRadius: "30px",
                fontSize: "12px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
            }}>
                {config.icon && <config.icon size={12} />}
                {config.text}
            </span>
        );
    };

    // ============ TOAST NOTIFICATION ============
    const SuccessToast = () => (
        <div style={styles.toast}>
            <FaCheckCircle style={{ color: "#10B981" }} />
            <span style={{ color: "#003366", fontWeight: "500" }}>Profile updated successfully!</span>
        </div>
    );

    // ============ PASSWORD CHANGE MODAL ============
    const PasswordChangeModal = ({ onClose }) => (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <div style={styles.modalTitleGroup}>
                        <div style={styles.modalIcon}>
                            <FaKey size={20} color="#FFD700" />
                        </div>
                        <div>
                            <h3 style={styles.modalTitle}>Change Password</h3>
                            <p style={styles.modalSubtitle}>Update your account password</p>
                        </div>
                    </div>
                    <button style={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div style={styles.modalBody}>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Current Password</label>
                        <input 
                            type="password" 
                            style={styles.formInput} 
                            placeholder="Enter current password"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>New Password</label>
                        <input 
                            type="password" 
                            style={styles.formInput} 
                            placeholder="Enter new password"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Confirm New Password</label>
                        <input 
                            type="password" 
                            style={styles.formInput} 
                            placeholder="Confirm new password"
                        />
                    </div>
                    <div style={styles.passwordRequirements}>
                        <p style={styles.requirementsTitle}>Password Requirements:</p>
                        <ul style={styles.requirementsList}>
                            <li>✓ Minimum 8 characters</li>
                            <li>✓ At least one uppercase letter</li>
                            <li>✓ At least one number</li>
                            <li>✓ At least one special character</li>
                        </ul>
                    </div>
                    <div style={styles.modalActions}>
                        <button style={styles.approveBtn}>
                            <FaCheckCircle size={14} />
                            Update Password
                        </button>
                        <button style={styles.rejectBtn} onClick={onClose}>
                            <FaTimesCircle size={14} />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // ============ PROFILE HEADER ============
    const ProfileHeader = () => (
        <div style={styles.profileHeader}>
            <div style={styles.profileHeaderLeft}>
                <div style={styles.profileAvatarContainer}>
                    <div style={styles.profileAvatar}>
                        <FaUserTie size={40} color="#FFD700" />
                    </div>
                    <button style={styles.cameraBtn}>
                        <FaCamera size={14} color="#FFFFFF" />
                    </button>
                </div>
                <div style={styles.profileTitleContainer}>
                    <div style={styles.profileNameRow}>
                        <h2 style={styles.profileName}>{profileData.customerName}</h2>
                        <StatusBadge status={profileData.kycStatus} />
                    </div>
                    <p style={styles.profileSubtitle}>
                        <FaIdCard style={{ marginRight: "8px", color: "#FFD700", fontSize: "12px" }} />
                        Customer ID: {profileData.customerId}
                    </p>
                    <p style={styles.profileSubtitle}>
                        <FaCalendarAlt style={{ marginRight: "8px", color: "#FFD700", fontSize: "12px" }} />
                        Member since {profileData.customerSince}
                    </p>
                </div>
            </div>
            <div style={styles.profileHeaderRight}>
                <button 
                    style={isEditing ? styles.saveBtn : styles.editBtn}
                    onClick={isEditing ? handleSave : handleEdit}
                >
                    {isEditing ? (
                        <>
                            <FaSave size={14} />
                            Save Changes
                        </>
                    ) : (
                        <>
                            <FaEdit size={14} />
                            Edit Profile
                        </>
                    )}
                </button>
                {isEditing && (
                    <button 
                        style={styles.cancelBtn}
                        onClick={handleCancel}
                    >
                        <FaBan size={14} style={{fontSize:"14px"}}/>
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );

    // ============ PROFILE STATS CARD ============
    const ProfileStats = () => (
        <div style={styles.profileStatsContainer}>
            {profileStats.map((stat, index) => (
                <div key={index} style={styles.profileStatCard}>
                    <div style={styles.statIcon}>
                        <stat.icon style={{ color: "#FFD700" }} size={20} />
                    </div>
                    <div style={styles.statInfo}>
                        <span style={styles.statLabel}>{stat.label}</span>
                        <span style={styles.statValue}>{stat.value}</span>
                        {stat.subtitle && (
                            <span style={styles.statSubtitle}>{stat.subtitle}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    // ============ TABS ============
    const Tabs = () => (
        <div style={styles.tabsContainer}>
            <button
                style={{
                    ...styles.tab,
                    background: activeTab === "personal" ? "linear-gradient(135deg, #003366, #002244)" : "transparent",
                    borderColor: activeTab === "personal" ? "#FFD700" : "#E6EDF5",
                    color: activeTab === "personal" ? "#FFFFFF" : "#003366"
                }}
                onClick={() => setActiveTab("personal")}
            >
                <FaUser size={14} style={{ marginRight: "8px" }} />
                Personal Info
            </button>
            <button
                style={{
                    ...styles.tab,
                    background: activeTab === "account" ? "linear-gradient(135deg, #003366, #002244)" : "transparent",
                    borderColor: activeTab === "account" ? "#FFD700" : "#E6EDF5",
                    color: activeTab === "account" ? "#FFFFFF" : "#003366"
                }}
                onClick={() => setActiveTab("account")}
            >
                <FaBuilding size={14} style={{ marginRight: "8px" }} />
                Account Details
            </button>
            <button
                style={{
                    ...styles.tab,
                    background: activeTab === "kyc" ? "linear-gradient(135deg, #003366, #002244)" : "transparent",
                    borderColor: activeTab === "kyc" ? "#FFD700" : "#E6EDF5",
                    color: activeTab === "kyc" ? "#FFFFFF" : "#003366"
                }}
                onClick={() => setActiveTab("kyc")}
            >
                <FaShieldAlt size={14} style={{ marginRight: "8px" }} />
                KYC & Security
            </button>
            <button
                style={{
                    ...styles.tab,
                    background: activeTab === "preferences" ? "linear-gradient(135deg, #003366, #002244)" : "transparent",
                    borderColor: activeTab === "preferences" ? "#FFD700" : "#E6EDF5",
                    color: activeTab === "preferences" ? "#FFFFFF" : "#003366"
                }}
                onClick={() => setActiveTab("preferences")}
            >
                <FaBell size={14} style={{ marginRight: "8px" }} />
                Preferences
            </button>
            <button
                style={{
                    ...styles.tab,
                    background: activeTab === "activity" ? "linear-gradient(135deg, #003366, #002244)" : "transparent",
                    borderColor: activeTab === "activity" ? "#FFD700" : "#E6EDF5",
                    color: activeTab === "activity" ? "#FFFFFF" : "#003366"
                }}
                onClick={() => setActiveTab("activity")}
            >
                <FaHistory size={14} style={{ marginRight: "8px" }} />
                Activity Log
            </button>
        </div>
    );

    // ============ PERSONAL INFORMATION TAB ============
    const PersonalInfoTab = () => (
        <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Personal Information</h3>
            </div>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Full Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="customerName"
                            value={profileData.customerName}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaUser style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.customerName}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Email Address</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaEnvelope style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.email}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Mobile Number</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="mobile"
                            value={profileData.mobile}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaPhone style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.mobile}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Alternate Mobile</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="alternateMobile"
                            value={profileData.alternateMobile}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaMobile style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.alternateMobile}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Date of Birth</label>
                    {isEditing ? (
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={profileData.dateOfBirth}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaCalendarAlt style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.dateOfBirth}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Gender</label>
                    {isEditing ? (
                        <select
                            name="gender"
                            value={profileData.gender}
                            onChange={handleChange}
                            style={styles.formSelect}
                        >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    ) : (
                        <div style={styles.valueDisplay}>
                            <span style={styles.fieldValue}>{profileData.gender}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Marital Status</label>
                    {isEditing ? (
                        <select
                            name="maritalStatus"
                            value={profileData.maritalStatus}
                            onChange={handleChange}
                            style={styles.formSelect}
                        >
                            <option>Single</option>
                            <option>Married</option>
                            <option>Divorced</option>
                            <option>Widowed</option>
                        </select>
                    ) : (
                        <div style={styles.valueDisplay}>
                            <span style={styles.fieldValue}>{profileData.maritalStatus}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Anniversary</label>
                    {isEditing ? (
                        <input
                            type="date"
                            name="anniversary"
                            value={profileData.anniversary}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaCalendarAlt style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.anniversary}</span>
                        </div>
                    )}
                </div>
            </div>

            <div style={styles.sectionDivider} />

            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Address Information</h3>
            </div>
            <div style={styles.formGrid}>
                <div style={styles.formGroupFull}>
                    <label style={styles.formLabel}>Address</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaMapMarkerAlt style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.address}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>City</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <span style={styles.fieldValue}>{profileData.city}</span>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>State</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="state"
                            value={profileData.state}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <span style={styles.fieldValue}>{profileData.state}</span>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Pincode</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="pincode"
                            value={profileData.pincode}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <span style={styles.fieldValue}>{profileData.pincode}</span>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Country</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="country"
                            value={profileData.country}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <span style={styles.fieldValue}>{profileData.country}</span>
                    )}
                </div>
            </div>

            <div style={styles.sectionDivider} />

            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Employment Information</h3>
            </div>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Occupation</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="occupation"
                            value={profileData.occupation}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaBriefcase style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.occupation}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Employment Type</label>
                    {isEditing ? (
                        <select
                            name="employmentType"
                            value={profileData.employmentType}
                            onChange={handleChange}
                            style={styles.formSelect}
                        >
                            <option>Salaried</option>
                            <option>Self-Employed</option>
                            <option>Business</option>
                            <option>Retired</option>
                        </select>
                    ) : (
                        <span style={styles.fieldValue}>{profileData.employmentType}</span>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Annual Income</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="annualIncome"
                            value={profileData.annualIncome}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <div style={styles.valueDisplay}>
                            <FaRupeeSign style={styles.fieldIcon} />
                            <span style={styles.fieldValue}>{profileData.annualIncome}</span>
                        </div>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Employer Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="employerName"
                            value={profileData.employerName}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <span style={styles.fieldValue}>{profileData.employerName}</span>
                    )}
                </div>
            </div>
        </div>
    );

    // ============ ACCOUNT DETAILS TAB ============
    const AccountDetailsTab = () => (
        <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Account Information</h3>
            </div>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Customer ID</label>
                    <div style={styles.valueDisplay}>
                        <FaIdCard style={styles.fieldIcon} />
                        <span style={styles.fieldValue}>{profileData.customerId}</span>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Account Number</label>
                    <div style={styles.valueDisplay}>
                        <FaCreditCard style={styles.fieldIcon} />
                        <span style={styles.fieldValue}>{profileData.accountNumber}</span>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Account Type</label>
                    <span style={styles.fieldValue}>{profileData.accountType}</span>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Branch</label>
                    <div style={styles.valueDisplay}>
                        <FaBuilding style={styles.fieldIcon} />
                        <span style={styles.fieldValue}>{profileData.branch}</span>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>IFSC Code</label>
                    <span style={styles.fieldValue}>{profileData.ifscCode}</span>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>SWIFT Code</label>
                    <span style={styles.fieldValue}>{profileData.swiftCode}</span>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Customer Since</label>
                    <span style={styles.fieldValue}>{profileData.customerSince}</span>
                </div>
            </div>

            <div style={styles.sectionDivider} />

            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Nominee Information</h3>
            </div>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Nominee Name</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="nomineeName"
                            value={profileData.nomineeName}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <span style={styles.fieldValue}>{profileData.nomineeName}</span>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Relationship</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="nomineeRelationship"
                            value={profileData.nomineeRelationship}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <span style={styles.fieldValue}>{profileData.nomineeRelationship}</span>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Allocation %</label>
                    {isEditing ? (
                        <input
                            type="text"
                            name="nomineePercentage"
                            value={profileData.nomineePercentage}
                            onChange={handleChange}
                            style={styles.formInput}
                        />
                    ) : (
                        <span style={styles.fieldValue}>{profileData.nomineePercentage}</span>
                    )}
                </div>
            </div>
        </div>
    );

    // ============ KYC & SECURITY TAB ============
    const KycSecurityTab = () => (
        <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>KYC Documents</h3>
                <StatusBadge status={profileData.kycStatus} />
            </div>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>PAN Number</label>
                    <div style={styles.valueDisplay}>
                        <FaIdCard style={styles.fieldIcon} />
                        <span style={styles.fieldValue}>{profileData.panNumber}</span>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Aadhar Number</label>
                    <span style={styles.fieldValue}>{profileData.aadharNumber}</span>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Passport Number</label>
                    <span style={styles.fieldValue}>{profileData.passportNumber}</span>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Driving License</label>
                    <span style={styles.fieldValue}>{profileData.drivingLicense}</span>
                </div>
            </div>

            <div style={styles.sectionDivider} />

            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Security Settings</h3>
            </div>
            <div style={styles.securitySettings}>
                <div style={styles.securityItem}>
                    <div style={styles.securityInfo}>
                        <FaLock style={{ color: "#FFD700", fontSize: "18px" }} />
                        <div>
                            <span style={styles.securityLabel}>Password</span>
                            <span style={styles.securityValue}>Last changed: {profileData.lastPasswordChange}</span>
                        </div>
                    </div>
                    <button 
                        style={styles.securityBtn}
                        onClick={() => setShowPasswordModal(true)}
                    >
                        <FaEdit size={12} />
                        Change
                    </button>
                </div>
                <div style={styles.securityItem}>
                    <div style={styles.securityInfo}>
                        {profileData.twoFactorAuth ? (
                            <FaUnlock style={{ color: "#10B981", fontSize: "18px" }} />
                        ) : (
                            <FaLock style={{ color: "#EF4444", fontSize: "18px" }} />
                        )}
                        <div>
                            <span style={styles.securityLabel}>Two-Factor Authentication</span>
                            <span style={styles.securityValue}>
                                {profileData.twoFactorAuth ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                    {isEditing && (
                        <button style={styles.securityToggleBtn}>
                            {profileData.twoFactorAuth ? 'Disable' : 'Enable'}
                        </button>
                    )}
                </div>
                <div style={styles.securityItem}>
                    <div style={styles.securityInfo}>
                        <FaBell style={{ color: "#FFD700", fontSize: "18px" }} />
                        <div>
                            <span style={styles.securityLabel}>Transaction Alerts</span>
                            <span style={styles.securityValue}>
                                {profileData.transactionAlerts ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                    {isEditing && (
                        <button style={styles.securityToggleBtn}>
                            {profileData.transactionAlerts ? 'Disable' : 'Enable'}
                        </button>
                    )}
                </div>
            </div>

            <div style={styles.sectionDivider} />

            <div style={styles.sessionInfo}>
                <div style={styles.sessionItem}>
                    <FaClock style={{ color: "#FFD700" }} />
                    <span style={styles.sessionLabel}>Last Login:</span>
                    <span style={styles.sessionValue}>{profileData.lastLogin}</span>
                </div>
                <div style={styles.sessionItem}>
                    <FaShieldAlt style={{ color: "#FFD700" }} />
                    <span style={styles.sessionLabel}>Login Attempts:</span>
                    <span style={styles.sessionValue}>{profileData.loginAttempts}</span>
                </div>
                <div style={styles.sessionItem}>
                    {profileData.accountLocked ? (
                        <FaLock style={{ color: "#EF4444" }} />
                    ) : (
                        <FaUnlock style={{ color: "#10B981" }} />
                    )}
                    <span style={styles.sessionLabel}>Account Status:</span>
                    <span style={styles.sessionValue}>
                        {profileData.accountLocked ? 'Locked' : 'Active'}
                    </span>
                </div>
            </div>
        </div>
    );

    // ============ PREFERENCES TAB ============
    const PreferencesTab = () => (
        <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Notification Preferences</h3>
            </div>
            <div style={styles.preferencesList}>
                <div style={styles.preferenceItem}>
                    <div style={styles.preferenceInfo}>
                        <span style={styles.preferenceLabel}>Email Notifications</span>
                        <span style={styles.preferenceDesc}>Receive updates via email</span>
                    </div>
                    <label style={styles.switch}>
                        <input 
                            type="checkbox" 
                            checked={profileData.notificationPreference.includes('Email')}
                            onChange={handleChange}
                            name="notificationPreference"
                        />
                        <span style={styles.slider}></span>
                    </label>
                </div>
                <div style={styles.preferenceItem}>
                    <div style={styles.preferenceInfo}>
                        <span style={styles.preferenceLabel}>SMS Alerts</span>
                        <span style={styles.preferenceDesc}>Receive updates via SMS</span>
                    </div>
                    <label style={styles.switch}>
                        <input 
                            type="checkbox" 
                            checked={profileData.notificationPreference.includes('SMS')}
                            onChange={handleChange}
                            name="notificationPreference"
                        />
                        <span style={styles.slider}></span>
                    </label>
                </div>
                <div style={styles.preferenceItem}>
                    <div style={styles.preferenceInfo}>
                        <span style={styles.preferenceLabel}>Marketing Emails</span>
                        <span style={styles.preferenceDesc}>Receive offers and promotions</span>
                    </div>
                    <label style={styles.switch}>
                        <input 
                            type="checkbox" 
                            checked={profileData.marketingEmails}
                            onChange={handleChange}
                            name="marketingEmails"
                        />
                        <span style={styles.slider}></span>
                    </label>
                </div>
            </div>

            <div style={styles.sectionDivider} />

            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Display Preferences</h3>
            </div>
            <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Language</label>
                    {isEditing ? (
                        <select
                            name="language"
                            value={profileData.language}
                            onChange={handleChange}
                            style={styles.formSelect}
                        >
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Tamil</option>
                            <option>Telugu</option>
                            <option>Bengali</option>
                        </select>
                    ) : (
                        <span style={styles.fieldValue}>{profileData.language}</span>
                    )}
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Theme</label>
                    <div style={styles.themeSelector}>
                        <button 
                            style={{
                                ...styles.themeBtn,
                                background: profileData.theme === 'light' ? 'linear-gradient(135deg, #003366, #002244)' : '#FFFFFF',
                                color: profileData.theme === 'light' ? '#FFFFFF' : '#003366',
                                borderColor: profileData.theme === 'light' ? '#FFD700' : '#E6EDF5'
                            }}
                            onClick={() => isEditing && setProfileData({...profileData, theme: 'light'})}
                        >
                            <FaSun size={14} />
                            Light
                        </button>
                        <button 
                            style={{
                                ...styles.themeBtn,
                                background: profileData.theme === 'dark' ? 'linear-gradient(135deg, #003366, #002244)' : '#FFFFFF',
                                color: profileData.theme === 'dark' ? '#FFFFFF' : '#003366',
                                borderColor: profileData.theme === 'dark' ? '#FFD700' : '#E6EDF5'
                            }}
                            onClick={() => isEditing && setProfileData({...profileData, theme: 'dark'})}
                        >
                            <FaMoon size={14} />
                            Dark
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // ============ ACTIVITY LOG TAB ============
    const ActivityLogTab = () => (
        <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Recent Activity</h3>
            </div>
            <div style={styles.activityList}>
                {recentActivities.map((activity, index) => (
                    <div key={index} style={styles.activityItem}>
                        <div style={styles.activityIcon}>
                            <FaHistory style={{ color: "#FFD700" }} />
                        </div>
                        <div style={styles.activityInfo}>
                            <span style={styles.activityAction}>{activity.action}</span>
                            <span style={styles.activityTime}>{activity.date} at {activity.time}</span>
                        </div>
                        <StatusBadge status={activity.status} />
                    </div>
                ))}
            </div>
            <button style={styles.viewAllBtn}>
                View Complete Activity Log
                <FaChevronRight size={12} style={{ marginLeft: "8px" }} />
            </button>
        </div>
    );

    return (
        <div style={styles.container}>
            {/* Success Toast */}
            {showSuccessToast && <SuccessToast />}

            {/* Profile Header */}
            <ProfileHeader />

            {/* Profile Stats */}
            <ProfileStats />

            {/* Tabs */}
            <Tabs />

            {/* Tab Content */}
            <div style={styles.tabPanel}>
                {activeTab === "personal" && <PersonalInfoTab />}
                {activeTab === "account" && <AccountDetailsTab />}
                {activeTab === "kyc" && <KycSecurityTab />}
                {activeTab === "preferences" && <PreferencesTab />}
                {activeTab === "activity" && <ActivityLogTab />}
            </div>

            {/* Footer Actions */}
            {isEditing && (
                <div style={styles.formActions}>
                    <button style={styles.saveBtn} onClick={handleSave}>
                        <FaSave size={14} />
                        Save All Changes
                    </button>
                    <button style={styles.cancelBtn} onClick={handleCancel}>
                        <FaBan size={14} />
                        Cancel
                    </button>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
            )}
        </div>
    );
};

// ============ STYLES - MATCHING YOUR DESIGN SYSTEM ============
const styles = {
    container: {
        padding: "30px",
        background: "#F5F9FF",
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
    },
    toast: {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#FFFFFF",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 51, 102, 0.15)",
        border: "1px solid #10B981",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 1000,
        animation: "slideIn 0.3s ease",
    },
    profileHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        background: "#FFFFFF",
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(0, 51, 102, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
    },
    profileHeaderLeft: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
    },
    profileAvatarContainer: {
        position: "relative",
    },
    profileAvatar: {
        width: "80px",
        height: "80px",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #003366, #002244)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 16px rgba(0, 51, 102, 0.15)",
        border: "3px solid #FFD700",
    },
    cameraBtn: {
        position: "absolute",
        bottom: "0",
        right: "0",
        width: "28px",
        height: "28px",
        borderRadius: "10px",
        background: "linear-gradient(135deg, #FFD700, #FBBF24)",
        border: "2px solid #FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#003366",
        transition: "all 0.2s ease",
    },
    profileTitleContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    profileNameRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    profileName: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#003366",
        margin: 0,
    },
    profileSubtitle: {
        fontSize: "13px",
        color: "#4A6F8F",
        margin: 0,
        display: "flex",
        alignItems: "center",
    },
    profileHeaderRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    editBtn: {
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
    saveBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        background: "linear-gradient(135deg, #10B981, #059669)",
        border: "none",
        borderRadius: "14px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    cancelBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        background: "#FFFFFF",
        border: "2px solid #EF4444",
        borderRadius: "14px",
        color: "#EF4444",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    printBtn: {
        width: "44px",
        height: "44px",
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
    downloadBtn: {
        width: "44px",
        height: "44px",
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
    profileStatsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "30px",
    },
    profileStatCard: {
        background: "#FFFFFF",
        padding: "20px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 4px 12px rgba(0, 51, 102, 0.05)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
    },
    statIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: "rgba(255, 215, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    statInfo: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    statLabel: {
        fontSize: "12px",
        color: "#4A6F8F",
    },
    statValue: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#003366",
    },
    statSubtitle: {
        fontSize: "11px",
        color: "#10B981",
        fontWeight: "600",
    },
    tabsContainer: {
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap",
    },
    tab: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        borderRadius: "14px",
        border: "2px solid",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        background: "transparent",
    },
    tabPanel: {
        background: "#FFFFFF",
        borderRadius: "24px",
        padding: "30px",
        boxShadow: "0 8px 24px rgba(0, 51, 102, 0.08)",
        border: "1px solid rgba(255, 215, 0, 0.1)",
        marginBottom: "20px",
    },
    tabContent: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },
    sectionTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#003366",
        margin: 0,
    },
    sectionDivider: {
        height: "1px",
        background: "#E6EDF5",
        margin: "20px 0",
    },
    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    formGroupFull: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        gridColumn: "span 2",
    },
    formLabel: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#4A6F8F",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    formInput: {
        padding: "12px 16px",
        border: "2px solid #E6EDF5",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#003366",
        outline: "none",
        transition: "all 0.2s ease",
        background: "#FFFFFF",
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
        cursor: "pointer",
    },
    valueDisplay: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 0",
    },
    fieldIcon: {
        color: "#FFD700",
        fontSize: "14px",
    },
    fieldValue: {
        fontSize: "15px",
        color: "#003366",
        fontWeight: "500",
    },
    securitySettings: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    securityItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "14px",
    },
    securityInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    securityLabel: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
        display: "block",
        marginBottom: "2px",
    },
    securityValue: {
        fontSize: "12px",
        color: "#4A6F8F",
    },
    securityBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 16px",
        background: "#FFFFFF",
        border: "2px solid #FFD700",
        borderRadius: "10px",
        color: "#003366",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
    },
    securityToggleBtn: {
        padding: "8px 16px",
        background: "transparent",
        border: "2px solid #10B981",
        borderRadius: "10px",
        color: "#10B981",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
    },
    sessionInfo: {
        display: "flex",
        gap: "24px",
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "14px",
    },
    sessionItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    sessionLabel: {
        fontSize: "12px",
        color: "#4A6F8F",
    },
    sessionValue: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
    },
    preferencesList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    preferenceItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "14px",
    },
    preferenceInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    preferenceLabel: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    },
    preferenceDesc: {
        fontSize: "12px",
        color: "#4A6F8F",
    },
    switch: {
        position: "relative",
        display: "inline-block",
        width: "52px",
        height: "26px",
    },
    slider: {
        position: "absolute",
        cursor: "pointer",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#E6EDF5",
        transition: ".2s",
        borderRadius: "34px",
    },
    themeSelector: {
        display: "flex",
        gap: "12px",
    },
    themeBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "12px",
        border: "2px solid",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    activityList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "20px",
    },
    activityItem: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "14px",
    },
    activityIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "rgba(255, 215, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    activityInfo: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    activityAction: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    },
    activityTime: {
        fontSize: "11px",
        color: "#4A6F8F",
    },
    viewAllBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        background: "transparent",
        border: "2px solid #E6EDF5",
        borderRadius: "14px",
        color: "#003366",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        width: "100%",
        transition: "all 0.2s ease",
    },
    formActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "16px",
        marginTop: "20px",
    },
    // Modal Styles
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
        maxWidth: "500px",
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
    modalActions: {
        display: "flex",
        gap: "12px",
        marginTop: "32px",
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
    passwordRequirements: {
        marginTop: "20px",
        padding: "16px",
        background: "#F8FBFF",
        borderRadius: "12px",
    },
    requirementsTitle: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#003366",
        margin: "0 0 8px 0",
    },
    requirementsList: {
        margin: 0,
        paddingLeft: "20px",
        color: "#4A6F8F",
        fontSize: "12px",
        lineHeight: "1.6",
    },
};

export default Profile;