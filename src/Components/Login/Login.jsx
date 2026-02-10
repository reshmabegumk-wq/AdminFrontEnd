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
    FaCheckCircle
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

        try {
            const payload = {
                userName: email,
                password: password
            }
            const response = await API.post("api/users/login", payload);

            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");

        } catch (error) {
            showSnackbar("error", "Invalid credentials");
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard");
        }, 1500);
    };

    const handleReset = () => {
        setEmail("");
        setPassword("");
        setErrors({});
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={styles.container}>
            {/* Left Side - Bank Info */}
            <div style={styles.leftPanel}>
                <div style={styles.bankContent}>
                    {/* Bank Logo & Name */}
                    <div style={styles.bankHeader}>
                        <div style={styles.bankLogo}>
                            <FaShieldAlt size={42} color="#ffffff" />
                        </div>
                        <h1 style={styles.bankName}>
                            <span style={styles.bankNameAccent}>ABC</span> Bank
                        </h1>
                        <p style={styles.bankTagline}>Secure Banking, Trusted Worldwide</p>
                    </div>

                    {/* Bank Stats */}
                    <div style={styles.bankStats}>
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>2.5M+</div>
                            <div style={styles.statLabel}>Happy Customers</div>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>50+</div>
                            <div style={styles.statLabel}>Countries</div>
                        </div>
                        <div style={styles.statDivider} />
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>24/7</div>
                            <div style={styles.statLabel}>Customer Support</div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div style={styles.featuresContainer}>
                        <h3 style={styles.featuresTitle}>Why Choose ABC Bank?</h3>

                        <div style={styles.featureItem}>
                            <FaCheckCircle style={styles.featureIcon} />
                            <div style={styles.featureText}>
                                <span style={styles.featureTitle}>Military-Grade Security</span>
                                <span style={styles.featureDesc}>256-bit encryption & biometric authentication</span>
                            </div>
                        </div>

                        <div style={styles.featureItem}>
                            <FaCreditCard style={styles.featureIcon} />
                            <div style={styles.featureText}>
                                <span style={styles.featureTitle}>Zero Annual Fees</span>
                                <span style={styles.featureDesc}>Premium banking with no hidden charges</span>
                            </div>
                        </div>

                        <div style={styles.featureItem}>
                            <FaMobileAlt style={styles.featureIcon} />
                            <div style={styles.featureText}>
                                <span style={styles.featureTitle}>Mobile Banking</span>
                                <span style={styles.featureDesc}>Manage accounts anytime, anywhere</span>
                            </div>
                        </div>

                        <div style={styles.featureItem}>
                            <FaGlobeAmericas style={styles.featureIcon} />
                            <div style={styles.featureText}>
                                <span style={styles.featureTitle}>Global Access</span>
                                <span style={styles.featureDesc}>Bank globally with competitive FX rates</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div style={styles.testimonial}>
                        <div style={styles.quoteIcon}>"</div>
                        <p style={styles.testimonialText}>
                            Banking with ABC has been seamless. Their digital platform is intuitive and customer service is exceptional.
                        </p>
                        <div style={styles.testimonialAuthor}>
                            <div style={styles.authorRating}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} style={styles.starIcon} />
                                ))}
                            </div>
                            <div style={styles.authorName}>- Sarah Johnson</div>
                            <div style={styles.authorRole}>Premium Customer Since 2018</div>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div style={styles.securityBadge}>
                        <FaShieldAlt style={styles.securityIcon} />
                        <span style={styles.securityText}>ISO 27001 Certified • GDPR Compliant</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={styles.rightPanel}>
                <div style={styles.loginContainer}>
                    <div style={styles.loginHeader}>
                        <div style={styles.loginLogo}>
                            <FaSignInAlt size={36} color="#4361ee" />
                        </div>
                        <h2 style={styles.loginTitle}>Welcome Back</h2>
                        <p style={styles.loginSubtitle}>Sign in to your ABC Bank account</p>
                    </div>

                    {/* Email Field */}
                    <div style={styles.inputContainer}>
                        <div style={styles.inputGroup}>
                            <FaEnvelope style={styles.icon} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={handleEmailChange}
                                onKeyPress={handleKeyPress}
                                style={styles.input}
                            />
                        </div>
                        {errors.email && <span style={styles.error}>{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div style={styles.inputContainer}>
                        <div style={styles.inputGroup}>
                            <FaLock style={styles.icon} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={handlePasswordChange}
                                onKeyPress={handleKeyPress}
                                style={styles.input}
                            />
                            <div
                                style={styles.eyeIcon}
                                onClick={togglePasswordVisibility}
                                role="button"
                                tabIndex={0}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        {errors.password && <span style={styles.error}>{errors.password}</span>}
                    </div>

                    {/* Forgot Password */}
                    {/* <div style={styles.forgotContainer}>
            <a 
              href="#" 
              style={styles.forgotLink}
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset instructions will be sent to your email!");
              }}
            >
              Forgot Password?
            </a>
          </div> */}

                    {/* Buttons */}
                    <div style={styles.buttonGroup}>
                        <button
                            style={{
                                ...styles.loginBtn,
                                ...(isLoading ? styles.loginBtnLoading : {})
                            }}
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div style={styles.loadingSpinner}></div>
                            ) : (
                                <>
                                    <FaSignInAlt style={styles.btnIcon} />
                                    Sign In
                                </>
                            )}
                        </button>

                        <button
                            style={styles.resetBtn}
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            <FaRedo style={styles.btnIcon} />
                            Clear
                        </button>
                    </div>

                    {/* Divider */}
                    <div style={styles.divider}>
                        <span style={styles.dividerText}>or</span>
                    </div>

                    {/* Additional Options */}
                    <div style={styles.optionsContainer}>
                        {/* <button 
              style={styles.registerBtn}
              onClick={() => navigate("/register")}
            >
              Create New Account
            </button> */}

                        <button
                            style={styles.demoBtn}
                            onClick={() => {
                                setEmail("demo@example.com");
                                setPassword("demo123");
                            }}
                        >
                            Try Demo Account
                        </button>
                    </div>

                    {/* Security Note */}
                    <div style={styles.securityNote}>
                        <FaShieldAlt style={styles.noteIcon} />
                        <span>Your security is our priority. All data is encrypted.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#ffffff"
    },
    // Left Panel Styles
    leftPanel: {
        flex: 1,
        background: "linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)",
        color: "#ffffff",
        padding: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
    },
    bankContent: {
        maxWidth: "600px",
        margin: "0 auto",
        position: "relative",
        zIndex: 2
    },
    bankHeader: {
        textAlign: "center",
        marginBottom: "60px"
    },
    bankLogo: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "linear-gradient(45deg, #5c6bc0, #3949ab)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
    },
    bankName: {
        fontSize: "48px",
        fontWeight: "800",
        marginBottom: "10px",
        letterSpacing: "1px"
    },
    bankNameAccent: {
        background: "linear-gradient(45deg, #64b5f6, #2196f3)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    bankTagline: {
        fontSize: "18px",
        opacity: "0.9",
        fontWeight: "300",
        letterSpacing: "0.5px"
    },
    bankStats: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "30px",
        marginBottom: "50px",
        border: "1px solid rgba(255,255,255,0.2)"
    },
    statItem: {
        textAlign: "center"
    },
    statNumber: {
        fontSize: "32px",
        fontWeight: "700",
        background: "linear-gradient(45deg, #64b5f6, #2196f3)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "5px"
    },
    statLabel: {
        fontSize: "14px",
        opacity: "0.8",
        fontWeight: "300"
    },
    statDivider: {
        width: "1px",
        height: "40px",
        background: "rgba(255,255,255,0.2)"
    },
    featuresContainer: {
        marginBottom: "50px"
    },
    featuresTitle: {
        fontSize: "24px",
        fontWeight: "600",
        marginBottom: "30px",
        color: "#bbdefb"
    },
    featureItem: {
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "25px",
        padding: "15px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.05)",
        transition: "all 0.3s ease"
    },
    featureIcon: {
        fontSize: "20px",
        color: "#64b5f6",
        marginRight: "15px",
        marginTop: "2px"
    },
    featureText: {
        display: "flex",
        flexDirection: "column"
    },
    featureTitle: {
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "5px"
    },
    featureDesc: {
        fontSize: "14px",
        opacity: "0.8",
        fontWeight: "300"
    },
    testimonial: {
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "30px",
        marginBottom: "40px",
        border: "1px solid rgba(255,255,255,0.2)",
        position: "relative"
    },
    quoteIcon: {
        fontSize: "60px",
        color: "#64b5f6",
        opacity: "0.3",
        position: "absolute",
        top: "-10px",
        left: "20px",
        fontWeight: "bold"
    },
    testimonialText: {
        fontSize: "16px",
        lineHeight: "1.6",
        marginBottom: "20px",
        fontStyle: "italic",
        position: "relative",
        zIndex: 1
    },
    testimonialAuthor: {
        textAlign: "center"
    },
    authorRating: {
        display: "flex",
        justifyContent: "center",
        gap: "5px",
        marginBottom: "10px"
    },
    starIcon: {
        color: "#ffd600",
        fontSize: "16px"
    },
    authorName: {
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "5px"
    },
    authorRole: {
        fontSize: "14px",
        opacity: "0.8",
        fontWeight: "300"
    },
    securityBadge: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "15px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)"
    },
    securityIcon: {
        color: "#4caf50"
    },
    securityText: {
        fontSize: "14px",
        fontWeight: "300",
        letterSpacing: "0.5px"
    },
    // Right Panel Styles
    rightPanel: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        background: "#f8fafc"
    },
    loginContainer: {
        width: "100%",
        maxWidth: "480px",
        padding: "50px",
        background: "#ffffff",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.05)"
    },
    loginHeader: {
        textAlign: "center",
        marginBottom: "40px"
    },
    loginLogo: {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        background: "linear-gradient(45deg, #e3f2fd, #bbdefb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px"
    },
    loginTitle: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#1a237e",
        marginBottom: "10px"
    },
    loginSubtitle: {
        color: "#64748b",
        fontSize: "15px",
        fontWeight: "400"
    },
    inputContainer: {
        marginBottom: "25px"
    },
    inputGroup: {
        display: "flex",
        alignItems: "center",
        border: "2px solid #e2e8f0",
        borderRadius: "14px",
        padding: "16px 20px",
        transition: "all 0.3s ease",
        backgroundColor: "#f8fafc"
    },
    icon: {
        marginRight: "15px",
        color: "#64748b",
        fontSize: "18px"
    },
    eyeIcon: {
        marginLeft: "15px",
        color: "#64748b",
        cursor: "pointer",
        fontSize: "18px",
        display: "flex",
        alignItems: "center"
    },
    input: {
        border: "none",
        outline: "none",
        width: "100%",
        fontSize: "15px",
        backgroundColor: "transparent",
        color: "#1e293b",
        fontWeight: "500"
    },
    error: {
        color: "#ef4444",
        fontSize: "13px",
        marginTop: "8px",
        marginLeft: "10px",
        display: "block",
        fontWeight: "500"
    },
    forgotContainer: {
        textAlign: "right",
        marginBottom: "30px"
    },
    forgotLink: {
        color: "#4361ee",
        fontSize: "14px",
        textDecoration: "none",
        fontWeight: "600",
        cursor: "pointer",
        transition: "color 0.3s ease"
    },
    buttonGroup: {
        display: "flex",
        gap: "15px",
        marginBottom: "30px"
    },
    loginBtn: {
        flex: "2",
        padding: "18px",
        background: "linear-gradient(45deg, #4361ee, #3a0ca3)",
        color: "#fff",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "16px",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        boxShadow: "0 4px 20px rgba(67, 97, 238, 0.3)"
    },
    loginBtnLoading: {
        opacity: "0.8",
        cursor: "not-allowed"
    },
    resetBtn: {
        flex: "1",
        padding: "18px",
        backgroundColor: "#f1f5f9",
        color: "#64748b",
        border: "2px solid #e2e8f0",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "16px",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px"
    },
    btnIcon: {
        fontSize: "14px"
    },
    loadingSpinner: {
        width: "20px",
        height: "20px",
        border: "3px solid rgba(255,255,255,0.3)",
        borderRadius: "50%",
        borderTopColor: "#fff",
        animation: "spin 1s linear infinite"
    },
    divider: {
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        margin: "30px 0"
    },
    dividerText: {
        padding: "0 20px",
        color: "#94a3b8",
        fontSize: "14px",
        fontWeight: "500",
        backgroundColor: "#ffffff"
    },
    optionsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginBottom: "30px"
    },
    registerBtn: {
        padding: "16px",
        background: "transparent",
        color: "#4361ee",
        border: "2px solid #4361ee",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "16px",
        transition: "all 0.3s ease"
    },
    demoBtn: {
        padding: "16px",
        background: "#f1f5f9",
        color: "#475569",
        border: "2px solid #e2e8f0",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "16px",
        transition: "all 0.3s ease"
    },
    securityNote: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "15px",
        background: "#f8fafc",
        borderRadius: "12px",
        fontSize: "13px",
        color: "#64748b",
        fontWeight: "500"
    },
    noteIcon: {
        color: "#10b981"
    }
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

// Add hover effects
styleSheet.insertRule(`
  .feature-item-hover:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
  }
`, styleSheet.cssRules.length);

// Apply hover class to feature items
const addHoverEffects = () => {
    const featureItems = document.querySelectorAll('[class*="featureItem"]');
    featureItems.forEach(item => {
        item.classList.add('feature-item-hover');
    });
};

export default Login;