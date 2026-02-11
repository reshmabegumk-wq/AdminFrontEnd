import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSignInAlt,
    FaRedo,
    FaShieldAlt,
    FaCreditCard,
    FaMobileAlt,
    FaGlobeAmericas,
    FaStar,
    FaCheckCircle,
    FaChartLine,
    FaWallet,
    FaArrowRight,
    FaBuilding,
    FaUserShield
} from "react-icons/fa";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";

const Login = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors({ ...errors, email: "" });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors({ ...errors, password: "" });
        }
    };

    const handleLogin = async () => {
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            const payload = {
                email: email,
                password: password
            }
            const response = await API.post("api/users/login", payload);

            if (response.data.roleId === 1) {
                localStorage.setItem("token", response.data.token);
                showSnackbar("success", "Welcome back! Login successful.");
                navigate("/dashboard");
            } else {
                showSnackbar("error", "Unauthorized access. Admin privileges required.");
            }
        } catch (error) {
            showSnackbar("error", "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setEmail("");
        setPassword("");
        setErrors({});
        showSnackbar("info", "Form has been cleared");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div style={styles.container}>
            {/* Left Side - ABC Bank Premium Experience */}
            <div style={styles.leftPanel}>
                <div style={styles.gradientOverlay}></div>
                <div style={styles.patternOverlay}></div>
                <div style={styles.leftContent}>
                    {/* Bank Header with Logo */}
                    <div style={styles.bankHeader}>
                        <div style={styles.logoContainer}>
                            <div style={styles.logoGlow}></div>
                            <div style={styles.logoIcon}>
                                <FaBuilding size={32} color="#FFFFFF" />
                            </div>
                        </div>
                        <div style={styles.bankTitleGroup}>
                            <h1 style={styles.bankName}>
                                <span style={styles.bankNameAccent}>ABC</span> Bank
                            </h1>
                            <div style={styles.bankBadge}>
                                <FaUserShield style={styles.badgeIcon} />
                                <span style={styles.badgeText}>EST. 1985</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Message */}
                    <div style={styles.heroSection}>
                        <h2 style={styles.heroTitle}>
                            Banking Beyond
                            <span style={styles.heroTitleHighlight}> Boundaries</span>
                        </h2>
                        <p style={styles.heroSubtitle}>
                            Experience the perfect blend of tradition and innovation with India's most trusted banking partner
                        </p>
                    </div>

                    {/* Compact Feature Grid */}
                    <div style={styles.featureGrid}>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIconWrapper}>
                                <FaShieldAlt style={styles.featureIcon} />
                            </div>
                            <div style={styles.featureInfo}>
                                <span style={styles.featureLabel}>Secure Banking</span>
                                <span style={styles.featureValue}>256-bit</span>
                            </div>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIconWrapper}>
                                <FaMobileAlt style={styles.featureIcon} />
                            </div>
                            <div style={styles.featureInfo}>
                                <span style={styles.featureLabel}>Mobile App</span>
                                <span style={styles.featureValue}>4.8★</span>
                            </div>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIconWrapper}>
                                <FaCreditCard style={styles.featureIcon} />
                            </div>
                            <div style={styles.featureInfo}>
                                <span style={styles.featureLabel}>Zero Fees</span>
                                <span style={styles.featureValue}>Lifetime</span>
                            </div>
                        </div>
                        <div style={styles.featureCard}>
                            <div style={styles.featureIconWrapper}>
                                <FaGlobeAmericas style={styles.featureIcon} />
                            </div>
                            <div style={styles.featureInfo}>
                                <span style={styles.featureLabel}>Global Access</span>
                                <span style={styles.featureValue}>190+</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Trust Section */}
                    <div style={styles.trustSection}>
                        <div style={styles.trustBadge}>
                            <FaStar style={styles.trustStar} />
                            <FaStar style={styles.trustStar} />
                            <FaStar style={styles.trustStar} />
                            <FaStar style={styles.trustStar} />
                            <FaStar style={styles.trustStar} />
                            <span style={styles.trustText}>Trusted by 2.5M+ customers</span>
                        </div>
                        <div style={styles.statsRow}>
                            <div style={styles.statItem}>
                                <span style={styles.statNumber}>₹500B+</span>
                                <span style={styles.statDesc}>Assets</span>
                            </div>
                            <div style={styles.statDot}></div>
                            <div style={styles.statItem}>
                                <span style={styles.statNumber}>50+</span>
                                <span style={styles.statDesc}>Countries</span>
                            </div>
                            <div style={styles.statDot}></div>
                            <div style={styles.statItem}>
                                <span style={styles.statNumber}>24/7</span>
                                <span style={styles.statDesc}>Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={styles.rightPanel}>
                <div style={styles.loginCard}>
                    {/* Welcome Header */}
                    <div style={styles.welcomeHeader}>
                        <div style={styles.welcomeIcon}>
                            <FaSignInAlt size={24} color="#0052A5" />
                        </div>
                        <div style={styles.welcomeText}>
                            <h3 style={styles.welcomeTitle}>Admin Login</h3>
                            <p style={styles.welcomeSubtitle}>Secure access to ABC Bank dashboard</p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div style={styles.formContainer}>
                        {/* Email Field */}
                        <div style={styles.fieldGroup}>
                            <label style={styles.fieldLabel}>Email Address</label>
                            <div style={{
                                ...styles.inputBox,
                                ...(focusedField === 'email' ? styles.inputBoxFocused : {}),
                                ...(errors.email ? styles.inputBoxError : {})
                            }}>
                                <FaEnvelope style={styles.inputIcon} />
                                <input
                                    type="email"
                                    placeholder="admin@abcbank.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onKeyPress={handleKeyPress}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    style={styles.input}
                                />
                            </div>
                            {errors.email && <span style={styles.errorMsg}>{errors.email}</span>}
                        </div>

                        {/* Password Field */}
                        <div style={styles.fieldGroup}>
                            <div style={styles.passwordHeader}>
                                <label style={styles.fieldLabel}>Password</label>
                                <button 
                                    style={styles.forgotBtn}
                                    onClick={() => showSnackbar("info", "Reset link sent to registered email")}
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div style={{
                                ...styles.inputBox,
                                ...(focusedField === 'password' ? styles.inputBoxFocused : {}),
                                ...(errors.password ? styles.inputBoxError : {})
                            }}>
                                <FaLock style={styles.inputIcon} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onKeyPress={handleKeyPress}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    style={styles.input}
                                />
                                <button 
                                    style={styles.toggleBtn}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <span style={styles.errorMsg}>{errors.password}</span>}
                        </div>

                        {/* Action Buttons */}
                        <div style={styles.actionRow}>
                            <button
                                style={styles.loginBtn}
                                onClick={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div style={styles.loader}></div>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <FaArrowRight style={styles.loginArrow} />
                                    </>
                                )}
                            </button>
                            
                            <button
                                style={styles.clearBtn}
                                onClick={handleReset}
                                disabled={isLoading}
                            >
                                <FaRedo style={styles.clearIcon} />
                                Clear
                            </button>
                        </div>

                        {/* Demo Access */}
                        <div style={styles.demoContainer}>
                            <div style={styles.dividerLine}>
                                <span style={styles.dividerText}>Quick Access</span>
                            </div>
                            
                            <button
                                style={styles.demoBtn}
                                onClick={() => {
                                    setEmail("admin@abcbank.com");
                                    setPassword("admin123");
                                }}
                            >
                                <FaUserShield style={styles.demoIcon} />
                                <span style={styles.demoText}>Demo Admin Access</span>
                            </button>
                        </div>

                        {/* Security Badge */}
                        <div style={styles.securityBadge}>
                            <FaShieldAlt style={styles.securityIcon} />
                            <div style={styles.securityInfo}>
                                <span style={styles.securityTitle}>256-bit SSL Encrypted</span>
                                <span style={styles.securityDesc}>Your data is protected</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={styles.footerNote}>
                        <FaCheckCircle style={styles.footerIcon} />
                        <span style={styles.footerText}>ISO 27001 Certified • RBI Regulated</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        backgroundColor: "#FFFFFF",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden", // Prevents any scroll
    },
    // Left Panel - Premium Blue Theme
    leftPanel: {
        flex: "1.1",
        background: "linear-gradient(145deg, #003366 0%, #002244 100%)", // ABC Bank blue
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        overflow: "hidden",
    },
    gradientOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 30%, rgba(0, 82, 165, 0.4) 0%, transparent 60%)",
        pointerEvents: "none",
    },
    patternOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNMjAgMjBoMTB2MTBIMjB6TTUwIDUwaDEwdjEwSDUweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvc3ZnPg==')",
        opacity: 0.4,
        pointerEvents: "none",
    },
    leftContent: {
        width: "100%",
        maxWidth: "580px",
        position: "relative",
        zIndex: 2,
    },
    bankHeader: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "48px",
    },
    logoContainer: {
        position: "relative",
    },
    logoGlow: {
        position: "absolute",
        width: "70px",
        height: "70px",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.2)",
        filter: "blur(10px)",
        top: "-5px",
        left: "-5px",
    },
    logoIcon: {
        width: "60px",
        height: "60px",
        borderRadius: "18px",
        background: "linear-gradient(135deg, #0052A5, #003366)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.2)",
    },
    bankTitleGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    bankName: {
        fontSize: "40px",
        fontWeight: "800",
        margin: 0,
        color: "#FFFFFF",
        lineHeight: 1,
    },
    bankNameAccent: {
        color: "#FFD700", // Gold accent for ABC
    },
    bankBadge: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 14px",
        background: "rgba(255, 215, 0, 0.15)",
        borderRadius: "30px",
        border: "1px solid rgba(255, 215, 0, 0.3)",
        alignSelf: "flex-start",
    },
    badgeIcon: {
        color: "#FFD700",
        fontSize: "12px",
    },
    badgeText: {
        color: "#FFD700",
        fontSize: "12px",
        fontWeight: "600",
        letterSpacing: "1px",
    },
    heroSection: {
        marginBottom: "40px",
    },
    heroTitle: {
        fontSize: "42px",
        fontWeight: "700",
        margin: 0,
        marginBottom: "16px",
        color: "#FFFFFF",
        lineHeight: 1.2,
    },
    heroTitleHighlight: {
        color: "#FFD700",
        display: "block",
    },
    heroSubtitle: {
        fontSize: "16px",
        lineHeight: 1.6,
        color: "#E6F0FF",
        margin: 0,
        opacity: 0.9,
        maxWidth: "480px",
    },
    featureGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
        marginBottom: "32px",
    },
    featureCard: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
    },
    featureIconWrapper: {
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "rgba(255, 215, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    featureIcon: {
        color: "#FFD700",
        fontSize: "18px",
    },
    featureInfo: {
        display: "flex",
        flexDirection: "column",
    },
    featureLabel: {
        fontSize: "13px",
        color: "#E6F0FF",
        opacity: 0.9,
    },
    featureValue: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#FFFFFF",
    },
    trustSection: {
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    trustBadge: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "16px",
    },
    trustStar: {
        color: "#FFD700",
        fontSize: "14px",
    },
    trustText: {
        color: "#FFFFFF",
        fontSize: "14px",
        fontWeight: "500",
        marginLeft: "8px",
    },
    statsRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    statItem: {
        display: "flex",
        flexDirection: "column",
    },
    statNumber: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#FFD700",
        marginBottom: "4px",
    },
    statDesc: {
        fontSize: "13px",
        color: "#E6F0FF",
        opacity: 0.8,
    },
    statDot: {
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: "rgba(255, 215, 0, 0.5)",
    },
    // Right Panel - Clean & Professional
    rightPanel: {
        flex: "0.9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        background: "#F5F9FF",
        overflow: "hidden",
    },
    loginCard: {
        width: "100%",
        maxWidth: "440px",
        background: "#FFFFFF",
        borderRadius: "28px",
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0, 51, 102, 0.08)",
        border: "1px solid rgba(0, 82, 165, 0.08)",
    },
    welcomeHeader: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "32px",
    },
    welcomeIcon: {
        width: "56px",
        height: "56px",
        borderRadius: "18px",
        background: "linear-gradient(135deg, #E6F0FF, #CCE5FF)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    welcomeText: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    welcomeTitle: {
        fontSize: "26px",
        fontWeight: "700",
        margin: 0,
        color: "#003366",
        letterSpacing: "-0.5px",
    },
    welcomeSubtitle: {
        fontSize: "14px",
        margin: 0,
        color: "#4A6F8F",
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    fieldLabel: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    },
    passwordHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    forgotBtn: {
        background: "none",
        border: "none",
        fontSize: "13px",
        color: "#0052A5",
        fontWeight: "600",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "6px",
        transition: "all 0.2s",
        ":hover": {
            background: "#E6F0FF",
        },
    },
    inputBox: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 18px",
        background: "#F8FBFF",
        border: "2px solid #E6EDF5",
        borderRadius: "16px",
        transition: "all 0.2s ease",
    },
    inputBoxFocused: {
        borderColor: "#0052A5",
        background: "#FFFFFF",
        boxShadow: "0 4px 12px rgba(0, 82, 165, 0.1)",
    },
    inputBoxError: {
        borderColor: "#DC3545",
    },
    inputIcon: {
        color: "#6B8BA4",
        fontSize: "16px",
    },
    input: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "15px",
        color: "#003366",
        fontWeight: "500",
        "::placeholder": {
            color: "#8DA6C0",
            fontWeight: "400",
        },
    },
    toggleBtn: {
        background: "none",
        border: "none",
        color: "#6B8BA4",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        fontSize: "16px",
        transition: "color 0.2s",
        ":hover": {
            color: "#0052A5",
        },
    },
    errorMsg: {
        fontSize: "12px",
        color: "#DC3545",
        fontWeight: "500",
        marginTop: "2px",
    },
    actionRow: {
        display: "flex",
        gap: "12px",
        marginTop: "8px",
    },
    loginBtn: {
        flex: 2,
        padding: "16px 24px",
        background: "linear-gradient(135deg, #0052A5, #003366)",
        border: "none",
        borderRadius: "16px",
        color: "#FFFFFF",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 8px 20px rgba(0, 82, 165, 0.25)",
        ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 28px rgba(0, 82, 165, 0.35)",
        },
        ":disabled": {
            opacity: 0.7,
            cursor: "not-allowed",
            transform: "none",
        },
    },
    loginArrow: {
        fontSize: "14px",
    },
    clearBtn: {
        flex: 1,
        padding: "16px 24px",
        background: "#F0F7FF",
        border: "2px solid #CCE5FF",
        borderRadius: "16px",
        color: "#003366",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            background: "#E6F0FF",
            borderColor: "#0052A5",
        },
    },
    clearIcon: {
        fontSize: "14px",
    },
    loader: {
        width: "20px",
        height: "20px",
        border: "3px solid rgba(255, 255, 255, 0.3)",
        borderTop: "3px solid #FFFFFF",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    demoContainer: {
        marginTop: "4px",
    },
    dividerLine: {
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        marginBottom: "16px",
        ":before": {
            content: "''",
            flex: 1,
            borderBottom: "1px solid #E6EDF5",
        },
        ":after": {
            content: "''",
            flex: 1,
            borderBottom: "1px solid #E6EDF5",
        },
    },
    dividerText: {
        padding: "0 16px",
        color: "#6B8BA4",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "1px",
        background: "#FFFFFF",
    },
    demoBtn: {
        width: "100%",
        padding: "14px",
        background: "linear-gradient(135deg, #FFF9E6, #FFF2CC)",
        border: "1px solid #FFEAA7",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
            background: "linear-gradient(135deg, #FFF2CC, #FFEAA7)",
            borderColor: "#FFD700",
        },
    },
    demoIcon: {
        color: "#0052A5",
        fontSize: "14px",
    },
    demoText: {
        color: "#003366",
        fontSize: "14px",
        fontWeight: "600",
    },
    securityBadge: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px",
        background: "#F0F7FF",
        borderRadius: "14px",
        marginTop: "8px",
    },
    securityIcon: {
        color: "#0052A5",
        fontSize: "20px",
    },
    securityInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    securityTitle: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#003366",
    },
    securityDesc: {
        fontSize: "12px",
        color: "#4A6F8F",
    },
    footerNote: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginTop: "24px",
        padding: "12px",
        borderTop: "1px solid #E6EDF5",
    },
    footerIcon: {
        color: "#0052A5",
        fontSize: "12px",
    },
    footerText: {
        fontSize: "12px",
        color: "#4A6F8F",
        fontWeight: "500",
    },
};

// Add global styles for animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
    @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
    }
`, styleSheet.cssRules.length);

export default Login;