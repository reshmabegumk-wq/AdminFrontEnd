
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt,
    FaRedo, FaShieldAlt, FaCreditCard, FaMobileAlt,
    FaGlobeAmericas, FaStar, FaCheckCircle, FaArrowRight,
    FaBuilding, FaUserShield
} from "react-icons/fa";
import API from "../../api";
import { useSnackbar } from "../../Context/SnackbarContext";

/* ─── HDFC Exact Design Tokens (from hdfc.bank.in) ────────────────────────
   Navy blue primary + Bright red CTA — exactly as seen on the live site     */
const H = {
    navy: "#003580",
    navyDark: "#002D6E",
    navyDeep: "#001E4E",
    navyLight: "#E8EEF8",
    navyMid: "#1A4FA0",
    red: "#E31837",
    redDark: "#C0122D",
    redLight: "#FDEAED",
    white: "#FFFFFF",
    offWhite: "#F4F6FA",
    g100: "#EEF1F7",
    g200: "#DDE3EF",
    g400: "#B0B8CC",
    g600: "#6B778C",
    g800: "#2C3347",
    text: "#1A1F36",
};

const Login = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // ── All original handlers — untouched ──────────────────────────────────
    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) newErrors.email = "Email is required";
        else if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email address";
        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) setErrors({ ...errors, email: "" });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) setErrors({ ...errors, password: "" });
    };

    const handleLogin = async () => {
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const payload = { email, password };
            const response = await API.post("users/login", payload);
            if (response.data.data?.roleId === 1) {
                localStorage.setItem("roleId", response.data.data.roleId);
                showSnackbar("success", "Welcome back! Login successful.");
                navigate("/dashboard");
                localStorage.setItem("userId", response?.data?.data?.userId);
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
        setEmail(""); setPassword(""); setErrors({});
        showSnackbar("info", "Form has been cleared");
    };

    const handleKeyPress = (e) => { if (e.key === "Enter") handleLogin(); };
    // ───────────────────────────────────────────────────────────────────────

    return (
        <div style={S.container}>

            {/* ══ LEFT PANEL ════════════════════════════════════════════ */}
            <div style={S.leftPanel}>
                <div style={S.redTopBar} />
                <div style={S.gridOverlay} />
                <div style={S.orb1} />
                <div style={S.orb2} />

                <div style={S.leftContent}>

                    {/* Logo — mimics HDFC's red-box + "HDFC BANK" white-bg header */}
                    <div style={S.bankHeader}>
                        <div style={S.logoBlock}>
                            <div style={S.logoRedBox}>
                                <FaBuilding size={14} color={H.white} />
                            </div>
                            <div>
                                <div style={S.logoText}>ABC BANK</div>
                                <div style={S.logoSub}>Personal Banking</div>
                            </div>
                        </div>
                        <div style={S.bankBadge}>
                            <FaUserShield style={{ fontSize: 10, color: H.white }} />
                            <span style={S.badgeText}>EST. 2024</span>
                        </div>
                    </div>

                    {/* Hero */}
                    <div style={S.heroSection}>
                        <h2 style={S.heroTitle}>
                            Bank Smarter.
                            <span style={S.heroHighlight}>Live Better.</span>
                        </h2>
                        <p style={S.heroSubtitle}>
                            India's trusted banking partner — built for people who expect more.
                            Seamless, secure and always on your side.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div style={S.featureGrid}>
                        {[
                            { icon: <FaShieldAlt />, label: "Secure Banking", value: "256-bit SSL" },
                            { icon: <FaMobileAlt />, label: "Mobile App", value: "4.8 ★ Rating" },
                            { icon: <FaCreditCard />, label: "Zero Fees", value: "Lifetime" },
                            { icon: <FaGlobeAmericas />, label: "Global Access", value: "190+ Countries" },
                        ].map((f, i) => (
                            <div key={i} style={S.featureCard}>
                                <div style={S.featIconWrap}><span style={S.featIcon}>{f.icon}</span></div>
                                <div>
                                    <span style={S.featLabel}>{f.label}</span>
                                    <span style={S.featValue}>{f.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust */}
                    <div style={S.trustSection}>
                        <div style={S.starsRow}>
                            {[...Array(5)].map((_, i) => <FaStar key={i} style={S.star} />)}
                            <span style={S.trustText}>Trusted by 2.5M+ customers</span>
                        </div>
                        <div style={S.statsRow}>
                            {[
                                { num: "₹500B+", desc: "Assets Managed" },
                                { num: "50+", desc: "Countries" },
                                { num: "24/7", desc: "Support" },
                            ].map((s, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <div style={S.statSep} />}
                                    <div style={S.statItem}>
                                        <span style={S.statNum}>{s.num}</span>
                                        <span style={S.statDesc}>{s.desc}</span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ RIGHT PANEL ═══════════════════════════════════════════ */}
            <div style={S.rightPanel}>
                <div style={S.loginCard}>
                    {/* Red top bar — HDFC signature */}
                    <div style={S.cardBar} />

                    {/* Card header */}
                    <div style={S.cardHead}>
                        <div style={S.headIcon}>
                            <FaBuilding size={20} color={H.white} />
                        </div>
                        <div>
                            <h3 style={S.headTitle}>Admin Login</h3>
                            <p style={S.headSub}>Secure access to ABC Bank dashboard</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div style={S.formWrap}>

                        {/* Email */}
                        <div style={S.field}>
                            <label style={S.label}>Email Address</label>
                            <div style={{
                                ...S.inputBox,
                                ...(focusedField === "email" ? S.inputFocused : {}),
                                ...(errors.email ? S.inputError : {}),
                            }}>
                                <FaEnvelope style={S.iico} />
                                <input
                                    type="email" placeholder="admin@abcbank.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onKeyPress={handleKeyPress}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    style={S.input}
                                />
                            </div>
                            {errors.email && <span style={S.errorMsg}>{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div style={S.field}>
                            <div style={S.pwRow}>
                                <label style={S.label}>Password</label>
                                
                            </div>
                            <div style={{
                                ...S.inputBox,
                                ...(focusedField === "password" ? S.inputFocused : {}),
                                ...(errors.password ? S.inputError : {}),
                            }}>
                                <FaLock style={S.iico} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onKeyPress={handleKeyPress}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                    style={S.input}
                                />
                                <button style={S.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <span style={S.errorMsg}>{errors.password}</span>}
                        </div>

                        {/* Actions */}
                        <div style={S.btnRow}>
                            <button style={S.btnSignin} onClick={handleLogin} disabled={isLoading}>
                                {isLoading
                                    ? <div style={S.loader} />
                                    : <><span>LOGIN</span><FaArrowRight style={{ fontSize: 12 }} /></>
                                }
                            </button>
                            <button style={S.btnClear} onClick={handleReset} disabled={isLoading}>
                                <FaRedo style={{ fontSize: 12 }} /> Clear
                            </button>
                        </div>

                       

                        {/* Security */}
                        <div style={S.secBadge}>
                            <FaShieldAlt style={S.secIcon} />
                            <div>
                                <span style={S.secTitle}>256-bit SSL Encrypted</span>
                                <span style={S.secDesc}>Your data is fully protected</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={S.cardFoot}>
                        <FaCheckCircle style={{ color: H.red, fontSize: 11 }} />
                        <span style={S.footText}>ISO 27001 Certified &nbsp;•&nbsp; RBI Regulated</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Style Object ───────────────────────────────────────────────────────── */
const FONT = "'Open Sans', 'Segoe UI', Arial, sans-serif";

const S = {
    container: {
        height: "100vh", width: "100vw",
        display: "flex",
        backgroundColor: H.white,
        fontFamily: FONT,
        overflow: "hidden",
    },

    /* Left */
    leftPanel: {
        flex: "1.15",
        background: `linear-gradient(160deg, ${H.navy} 0%, ${H.navyDeep} 100%)`,
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "52px",
        overflow: "hidden",
    },
    redTopBar: {
        position: "absolute", top: 0, left: 0, right: 0,
        height: "6px", background: H.red,
    },
    gridOverlay: {
        position: "absolute", inset: 0,
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
    },
    orb1: {
        position: "absolute", top: -100, right: -100,
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(26,79,160,0.5) 0%, transparent 70%)`,
        pointerEvents: "none",
    },
    orb2: {
        position: "absolute", bottom: -80, left: -60,
        width: 300, height: 300, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(227,24,55,0.12) 0%, transparent 70%)`,
        pointerEvents: "none",
    },
    leftContent: { width: "100%", maxWidth: "560px", position: "relative", zIndex: 2 },

    bankHeader: {
        display: "flex", alignItems: "center", gap: 16, marginBottom: 40,
    },
    logoBlock: {
        display: "flex", alignItems: "center", gap: 0,
        background: H.white, borderRadius: 6,
        padding: "8px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    },
    logoRedBox: {
        width: 36, height: 36, borderRadius: 4,
        background: H.red,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginRight: 10,
    },
    logoText: { fontSize: 16, fontWeight: 800, color: H.navy, letterSpacing: 1 },
    logoSub: { fontSize: 9, fontWeight: 600, color: H.g600, letterSpacing: 2, textTransform: "uppercase", marginTop: 1 },
    bankBadge: {
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 14px",
        background: "rgba(255,255,255,0.12)",
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.2)",
    },
    badgeText: { fontSize: 11, fontWeight: 700, color: H.white, letterSpacing: "2px" },

    heroSection: { marginBottom: 36 },
    heroTitle: {
        fontSize: 40, fontWeight: 800,
        color: H.white, lineHeight: 1.15,
        letterSpacing: -0.5, margin: 0, marginBottom: 14,
    },
    heroHighlight: {
        display: "block",
        color: H.red,
        fontSize: 38, fontStyle: "normal",
    },
    heroSubtitle: {
        fontSize: 15, lineHeight: 1.75,
        color: "rgba(255,255,255,0.75)",
        margin: 0, maxWidth: 460,
    },

    featureGrid: {
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 14, marginBottom: 28,
    },
    featureCard: {
        display: "flex", alignItems: "center", gap: 13,
        padding: "14px 16px",
        background: "rgba(255,255,255,0.07)",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.12)",
    },
    featIconWrap: {
        width: 40, height: 40, borderRadius: 8,
        background: "rgba(227,24,55,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
    },
    featIcon: { color: H.red, fontSize: 17 },
    featLabel: { fontSize: 11.5, color: "rgba(255,255,255,0.65)", display: "block" },
    featValue: { fontSize: 13.5, fontWeight: 700, color: H.white, display: "block" },

    trustSection: {
        background: "rgba(255,255,255,0.06)",
        borderRadius: 10, padding: "20px 24px",
        border: "1px solid rgba(255,255,255,0.1)",
    },
    starsRow: { display: "flex", alignItems: "center", gap: 4, marginBottom: 12 },
    star: { color: "#FFD700", fontSize: 14 },
    trustText: { color: H.white, fontSize: 13, fontWeight: 600, marginLeft: 8 },
    statsRow: { display: "flex", alignItems: "center" },
    statItem: { flex: 1 },
    statNum: { fontSize: 21, fontWeight: 800, color: H.white, display: "block", marginBottom: 2 },
    statDesc: { fontSize: 11.5, color: "rgba(255,255,255,0.6)", display: "block" },
    statSep: { width: 1, height: 36, background: "rgba(255,255,255,0.15)", margin: "0 20px" },

    /* Right */
    rightPanel: {
        flex: "0.85",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 40, background: H.offWhite, overflow: "hidden",
    },
    loginCard: {
        width: "100%", maxWidth: 410,
        background: H.white, borderRadius: 10, overflow: "hidden",
        boxShadow: "0 12px 48px rgba(0,53,128,0.12), 0 2px 8px rgba(0,0,0,0.05)",
        border: `1px solid ${H.g200}`,
    },
    cardBar: { height: 6, background: H.red },

    cardHead: {
        display: "flex", alignItems: "center", gap: 14,
        padding: "24px 28px 18px",
        borderBottom: `1px solid ${H.g100}`,
        background: `linear-gradient(135deg, ${H.navyLight}, ${H.white})`,
    },
    headIcon: {
        width: 48, height: 48, borderRadius: 8,
        background: `linear-gradient(135deg, ${H.navy}, ${H.navyDark})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, boxShadow: "0 4px 14px rgba(0,53,128,0.3)",
    },
    headTitle: { fontSize: 21, fontWeight: 800, color: H.navy, letterSpacing: -0.3, margin: 0 },
    headSub: { fontSize: 12.5, color: H.g600, marginTop: 3, margin: 0 },

    formWrap: { display: "flex", flexDirection: "column", gap: 16, padding: "20px 28px" },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: {
        fontSize: 12.5, fontWeight: 700, color: H.g800,
        textTransform: "uppercase", letterSpacing: "0.6px",
    },
    pwRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    forgotBtn: { background: "none", border: "none", fontSize: 12, color: H.red, fontWeight: 600, cursor: "pointer" },

    inputBox: {
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 14px",
        background: H.g100,
        border: `1.5px solid ${H.g200}`,
        borderRadius: 7, transition: "all 0.2s",
    },
    inputFocused: {
        borderColor: H.navy, background: H.white,
        boxShadow: "0 0 0 3px rgba(0,53,128,0.1)",
    },
    inputError: { borderColor: "#DC3545", background: "#FFF5F5" },
    iico: { color: H.g400, fontSize: 14, flexShrink: 0 },
    input: {
        flex: 1, border: "none", outline: "none", background: "transparent",
        fontSize: 14, color: H.text, fontWeight: 500, fontFamily: FONT,
    },
    eyeBtn: { background: "none", border: "none", color: H.g400, cursor: "pointer", fontSize: 14 },
    errorMsg: { fontSize: 12, color: "#DC3545", fontWeight: 500 },

    btnRow: { display: "flex", gap: 10, marginTop: 4 },
    btnSignin: {
        flex: 2, padding: "13px 20px",
        background: H.red, border: "none", borderRadius: 7,
        color: H.white, fontSize: 14, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(227,24,55,0.35)",
        fontFamily: FONT, letterSpacing: "0.5px",
    },
    btnClear: {
        flex: 1, padding: 13,
        background: H.white, border: `1.5px solid ${H.g200}`, borderRadius: 7,
        color: H.g800, fontSize: 14, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        cursor: "pointer", fontFamily: FONT,
    },
    loader: {
        width: 18, height: 18,
        border: "3px solid rgba(255,255,255,0.3)",
        borderTop: "3px solid #FFFFFF",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },

    dividerWrap: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
    divLine: { flex: 1, height: 1, background: H.g200 },
    divText: {
        fontSize: 10.5, fontWeight: 700, color: H.g600,
        textTransform: "uppercase", letterSpacing: "1.2px", whiteSpace: "nowrap",
    },
    btnDemo: {
        width: "100%", padding: 12,
        background: H.navyLight, border: `1.5px solid ${H.g200}`, borderRadius: 7,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        cursor: "pointer", fontFamily: FONT,
    },
    demoText: { color: H.navy, fontSize: 13, fontWeight: 700 },

    secBadge: {
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px",
        background: H.g100, borderRadius: 7, border: `1px solid ${H.g200}`,
    },
    secIcon: { color: H.navy, fontSize: 18, flexShrink: 0 },
    secTitle: { fontSize: 13, fontWeight: 700, color: H.text, display: "block" },
    secDesc: { fontSize: 11, color: H.g600, display: "block" },

    cardFoot: {
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "13px 28px",
        borderTop: `1px solid ${H.g100}`,
        background: H.offWhite,
    },
    footText: { fontSize: 11, color: H.g600, fontWeight: 600 },
};

// Animations
const ss = document.styleSheets[0];
ss.insertRule(`@keyframes spin { to { transform: rotate(360deg); } }`, ss.cssRules.length);
ss.insertRule(`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`, ss.cssRules.length);

export default Login;

