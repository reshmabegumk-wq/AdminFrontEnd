import React, { useState, useEffect } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaIdCard,
    FaEdit,
    FaCheckCircle,
    FaSave,
    FaBan,
    FaCity,
    FaGlobe,
    FaMapPin,
    FaUserTie,
    FaBirthdayCake,
    FaHome,
    FaFlag,
    FaTimes,
    FaPen
} from "react-icons/fa";
import API from "../../api";

const Profile = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Fields that can be edited
    const editableFields = [
        { name: 'mobileNumber', label: 'MOBILE NUMBER', icon: FaPhone, type: 'tel' },
        { name: 'address', label: 'ADDRESS', icon: FaHome, type: 'text' },
        { name: 'city', label: 'CITY', icon: FaCity, type: 'text' },
        { name: 'state', label: 'STATE', icon: FaFlag, type: 'text' },
        { name: 'country', label: 'COUNTRY', icon: FaGlobe, type: 'text' },
        { name: 'pincode', label: 'PINCODE', icon: FaMapPin, type: 'text' }
    ];

    // Fetch profile data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) return;

                // Fetch user details
                const userResponse = await API.get(`users/details/${userId}`);
                console.log("Profile data:", userResponse.data);

                const userData = userResponse.data?.data || {};
                setProfile(userData);

                // Initialize form data with only editable fields
                const initialFormData = {};
                editableFields.forEach(field => {
                    initialFormData[field.name] = userData[field.name] || '';
                });
                setFormData(initialFormData);

            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Format display date (DD-MM-YYYY)
    const formatDisplayDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        } catch (e) {
            return dateString;
        }
    };

    // Handle edit button click
    const handleEditClick = () => {
        // Reset form data with current profile values
        const updatedFormData = {};
        editableFields.forEach(field => {
            updatedFormData[field.name] = profile[field.name] || '';
        });
        setFormData(updatedFormData);
        setShowEditModal(true);
    };

    // Handle input change in modal
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle save from modal
    const handleSave = async () => {
        setUpdating(true);
        try {
            const userId = localStorage.getItem("userId");

            // Prepare update data with only the fields we want to update
            const updateData = {
                mobileNumber: formData.mobileNumber,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                pincode: formData.pincode
            };

            console.log("Updating with data:", updateData);

            const response = await API.put(`users/updateContact/${userId}`, updateData);

            if (response.data?.status) {
                // Update profile with new values
                setProfile(prev => ({
                    ...prev,
                    ...updateData
                }));

                setShowEditModal(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setShowEditModal(false);
    };

    // Loading state
    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p style={styles.loadingText}>Loading profile...</p>
            </div>
        );
    }

    // If no profile data
    if (!profile) {
        return (
            <div style={styles.errorContainer}>
                <p>No profile data found</p>
            </div>
        );
    }

    // Full name
    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User';

    return (
        <div style={styles.container}>
            {/* Success Toast */}
            {showSuccess && (
                <div style={styles.toast}>
                    <FaCheckCircle style={{ color: "#10B981" }} />
                    <span>Profile updated successfully!</span>
                </div>
            )}

            {/* Profile Header */}
            <div style={styles.headerCard}>
                <div style={styles.headerLeft}>
                    <div style={styles.avatar}>
                        <FaUserTie size={40} color="#1e4b8a" />
                    </div>
                    <div style={styles.headerInfo}>
                        <div style={styles.nameRow}>
                            <h1 style={styles.name}>{fullName}</h1>
                            <span style={styles.verifiedBadge}>
                                <FaCheckCircle size={14} color="#10B981" />
                                Verified
                            </span>
                        </div>
                        {/* Customer ID line removed */}
                    </div>
                </div>
                <button
                    style={styles.editButton}
                    onClick={handleEditClick}
                >
                    <FaEdit size={14} />
                    Edit Profile
                </button>
            </div>

            {/* Personal Info Content */}
            <div style={styles.contentCard}>
                <h2 style={styles.sectionTitle}>Personal Information</h2>

                <div style={styles.gridContainer}>
                    {/* Full Name - Full Width */}
                    <div style={styles.fullWidthField}>
                        <label style={styles.fieldLabel}>FULL NAME</label>
                        <div style={styles.fieldValue}>
                            <FaUser style={styles.fieldIcon} />
                            <span>{fullName}</span>
                        </div>
                    </div>

                    {/* Email - Full Width */}
                    <div style={styles.fullWidthField}>
                        <label style={styles.fieldLabel}>EMAIL ADDRESS</label>
                        <div style={styles.fieldValue}>
                            <FaEnvelope style={styles.fieldIcon} />
                            <span>{profile.email || "Not provided"}</span>
                        </div>
                    </div>

                    {/* Mobile Number - Full Width with Edit Icon */}
                    <div style={styles.fullWidthField}>
                        <label style={styles.fieldLabel}>MOBILE NUMBER</label>
                        <div style={styles.fieldValue}>
                            <FaPhone style={styles.fieldIcon} />
                            <span>{profile.mobileNumber || "Not provided"}</span>
                            <FaPen
                                style={styles.editIcon}
                                onClick={handleEditClick}
                                title="Click to edit"
                            />
                        </div>
                    </div>

                    {/* Date of Birth - Full Width */}
                    <div style={styles.fullWidthField}>
                        <label style={styles.fieldLabel}>DATE OF BIRTH</label>
                        <div style={styles.fieldValue}>
                            <FaBirthdayCake style={styles.fieldIcon} />
                            <span>{formatDisplayDate(profile.dateOfBirth)}</span>
                        </div>
                    </div>

                    {/* Address - Full Width with Edit Icon */}
                    <div style={styles.fullWidthField}>
                        <label style={styles.fieldLabel}>ADDRESS</label>
                        <div style={styles.fieldValue}>
                            <FaHome style={styles.fieldIcon} />
                            <span>{profile.address || "Not provided"}</span>
                            <FaPen
                                style={styles.editIcon}
                                onClick={handleEditClick}
                                title="Click to edit"
                            />
                        </div>
                    </div>

                    {/* City and State - Side by side */}
                    <div style={styles.fieldGroup}>
                        <div style={styles.fieldItem}>
                            <label style={styles.fieldLabel}>CITY</label>
                            <div style={styles.fieldValue}>
                                <FaCity style={styles.fieldIcon} />
                                <span>{profile.city || "Not provided"}</span>
                                <FaPen
                                    style={styles.editIcon}
                                    onClick={handleEditClick}
                                    title="Click to edit"
                                />
                            </div>
                        </div>

                        <div style={styles.fieldItem}>
                            <label style={styles.fieldLabel}>STATE</label>
                            <div style={styles.fieldValue}>
                                <FaFlag style={styles.fieldIcon} />
                                <span>{profile.state || "Not provided"}</span>
                                <FaPen
                                    style={styles.editIcon}
                                    onClick={handleEditClick}
                                    title="Click to edit"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Country and Pincode - Side by side */}
                    <div style={styles.fieldGroup}>
                        <div style={styles.fieldItem}>
                            <label style={styles.fieldLabel}>COUNTRY</label>
                            <div style={styles.fieldValue}>
                                <FaGlobe style={styles.fieldIcon} />
                                <span>{profile.country || "India"}</span>
                                <FaPen
                                    style={styles.editIcon}
                                    onClick={handleEditClick}
                                    title="Click to edit"
                                />
                            </div>
                        </div>

                        <div style={styles.fieldItem}>
                            <label style={styles.fieldLabel}>PINCODE</label>
                            <div style={styles.fieldValue}>
                                <FaMapPin style={styles.fieldIcon} />
                                <span>{profile.pincode || "Not provided"}</span>
                                <FaPen
                                    style={styles.editIcon}
                                    onClick={handleEditClick}
                                    title="Click to edit"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                <FaEdit style={styles.modalTitleIcon} />
                                Edit Profile Information
                            </h3>
                            <button style={styles.modalCloseBtn} onClick={handleCancel}>
                                <FaTimes />
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            {editableFields.map(field => (
                                <div key={field.name} style={styles.modalField}>
                                    <label style={styles.modalLabel}>
                                        <field.icon style={styles.modalLabelIcon} />
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        style={styles.modalInput}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={styles.modalFooter}>
                            <button
                                style={styles.modalCancelBtn}
                                onClick={handleCancel}
                            >
                                <FaBan size={14} />
                                Cancel
                            </button>
                            <button
                                style={styles.modalSaveBtn}
                                onClick={handleSave}
                                disabled={updating}
                            >
                                <FaSave size={14} />
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============ STYLES ============
const styles = {
    container: {
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
    },

    // Toast
    toast: {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#FFFFFF",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        border: "1px solid #10B981",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 1000,
        color: "#1e4b8a",
        fontWeight: "500",
    },

    // Header Card
    headerCard: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        border: "1px solid #E6EDF5",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
    },

    headerLeft: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        alignItems: "center",
    },

    avatar: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "#E8F0FE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    headerInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    nameRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
    },

    name: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1e4b8a",
        margin: 0,
    },

    verifiedBadge: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        background: "rgba(16, 185, 129, 0.1)",
        borderRadius: "30px",
        fontSize: "12px",
        color: "#10B981",
        fontWeight: "600",
    },

    // Edit Icon
    editIcon: {
        marginLeft: "auto",
        color: "#1e4b8a",
        cursor: "pointer",
        fontSize: "14px",
        opacity: 0.6,
        transition: "opacity 0.2s ease",
        ':hover': {
            opacity: 1,
        }
    },

    // Buttons
    editButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 24px",
        background: "#1e4b8a",
        border: "none",
        borderRadius: "12px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 12px rgba(30, 75, 138, 0.2)",
    },

    // Content Card
    contentCard: {
        background: "#FFFFFF",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        border: "1px solid #E6EDF5",
    },

    sectionTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#1e4b8a",
        margin: "0 0 30px 0",
        paddingBottom: "15px",
        borderBottom: "2px solid #E6EDF5",
    },

    // Grid Layout
    gridContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "25px",
    },

    fieldGroup: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },

    fieldItem: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    fullWidthField: {
        gridColumn: "1 / -1",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    // Form Fields
    fieldLabel: {
        fontSize: "11px",
        fontWeight: "600",
        color: "#64748B",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },

    fieldValue: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "15px",
        color: "#1e4b8a",
        fontWeight: "500",
        background: "#F8FAFC",
        borderRadius: "10px",
        padding: "12px 16px",
        border: "1px solid #E6EDF5",
    },

    fieldIcon: {
        color: "#FFD700",
        fontSize: "14px",
    },

    // Modal Styles
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },

    modalContent: {
        background: "#FFFFFF",
        borderRadius: "24px",
        maxWidth: "500px",
        width: "100%",
        maxHeight: "90vh",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    },

    modalHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        borderBottom: "1px solid #E6EDF5",
        background: "linear-gradient(135deg, #F8FAFC, #FFFFFF)",
    },

    modalTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#1e4b8a",
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    modalTitleIcon: {
        color: "#FFD700",
    },

    modalCloseBtn: {
        background: "none",
        border: "none",
        fontSize: "20px",
        color: "#64748B",
        cursor: "pointer",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        ':hover': {
            background: "#F1F5F9",
            color: "#1e4b8a",
        }
    },

    modalBody: {
        padding: "24px",
        overflowY: "auto",
        maxHeight: "calc(90vh - 140px)",
    },

    modalField: {
        marginBottom: "20px",
    },

    modalLabel: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#1e4b8a",
        marginBottom: "8px",
    },

    modalLabelIcon: {
        color: "#FFD700",
        fontSize: "14px",
    },

    modalInput: {
        width: "100%",
        padding: "12px 16px",
        border: "2px solid #E6EDF5",
        borderRadius: "10px",
        fontSize: "14px",
        color: "#1e4b8a",
        outline: "none",
        transition: "all 0.2s ease",
        background: "#FFFFFF",
        ':focus': {
            borderColor: "#1e4b8a",
        }
    },

    modalFooter: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        padding: "20px 24px",
        borderTop: "1px solid #E6EDF5",
        background: "#F8FAFC",
    },

    modalCancelBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: "#FFFFFF",
        border: "2px solid #EF4444",
        borderRadius: "10px",
        color: "#EF4444",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ':hover': {
            background: "#EF4444",
            color: "#FFFFFF",
        }
    },

    modalSaveBtn: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        background: "#10B981",
        border: "none",
        borderRadius: "10px",
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ':hover': {
            background: "#059669",
        }
    },

    // Loading
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
    },

    loader: {
        width: "40px",
        height: "40px",
        border: "3px solid #E6EDF5",
        borderTopColor: "#1e4b8a",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },

    loadingText: {
        marginTop: "16px",
        color: "#4A6F8F",
        fontSize: "14px",
    },

    // Error
    errorContainer: {
        textAlign: "center",
        padding: "40px",
        color: "#EF4444",
    },
};

// Add this to your global CSS
const globalStyles = `
@keyframes spin {
    to { transform: rotate(360deg); }
}
`;

export default Profile;