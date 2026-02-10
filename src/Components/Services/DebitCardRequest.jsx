import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCreditCard, 
  FaNetworkWired, 
  FaQuestionCircle, 
  FaGlobeAmericas,
  FaMapMarkerAlt,
  FaStickyNote,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaIdCard
} from "react-icons/fa";

const DebitCardRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountNumber: "",
    cardTypeId: "",
    networkTypeId: "",
    applyReasonId: "",
    usageType: "",
    deliveryAddress: "",
    remarks: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    ssnLastFour: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Account Number validation
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^\d{9,12}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must be 9-12 digits";
    }

    // Card Type validation
    if (!formData.cardTypeId) {
      newErrors.cardTypeId = "Please select a card type";
    }

    // Network Type validation
    if (!formData.networkTypeId) {
      newErrors.networkTypeId = "Please select a network";
    }

    // Apply Reason validation
    if (!formData.applyReasonId) {
      newErrors.applyReasonId = "Please select a reason for applying";
    }

    // Usage Type validation
    if (!formData.usageType) {
      newErrors.usageType = "Please select usage type";
    }

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Number validation (US format)
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Format: (XXX) XXX-XXXX";
    }

    // SSN Last 4 validation
    if (!formData.ssnLastFour.trim()) {
      newErrors.ssnLastFour = "Last 4 SSN digits are required";
    } else if (!/^\d{4}$/.test(formData.ssnLastFour)) {
      newErrors.ssnLastFour = "Must be 4 digits";
    }

    // Delivery Address validation
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address is required";
    } else if (formData.deliveryAddress.trim().length < 10) {
      newErrors.deliveryAddress = "Address must be at least 10 characters";
    } else if (formData.deliveryAddress.trim().length > 200) {
      newErrors.deliveryAddress = "Address must not exceed 200 characters";
    }

    // Remarks validation
    if (formData.remarks.length > 500) {
      newErrors.remarks = "Remarks must not exceed 500 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number
    let formattedValue = value;
    if (name === "phoneNumber") {
      formattedValue = formatPhoneNumber(value);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phone = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phone.length <= 3) {
      return phone;
    } else if (phone.length <= 6) {
      return `(${phone.slice(0,3)}) ${phone.slice(3)}`;
    } else {
      return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6,10)}`;
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    // Validate individual field on blur
    const newErrors = validateForm();
    if (newErrors[name]) {
      setErrors({
        ...errors,
        [name]: newErrors[name]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate entire form
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // Check if form is valid
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("Submitted Data:", formData);
        alert("Debit Card Request Submitted Successfully!");
        navigate("/services/debit-card");
      } catch (error) {
        console.error("Submission error:", error);
        alert("There was an error submitting your request. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <div style={container}>
      <div style={formWrapper}>
        <div style={headerSection}>
          <div style={iconHeader}>
            <FaCreditCard style={headerIcon} />
          </div>
          <h2 style={headerTitle}>Debit Card Request</h2>
          <p style={headerSubtitle}>Fill out the form below to request a new debit card</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle} noValidate>
          
          {/* First Row: Account Number & Card Type */}
          <div style={rowStyle}>
            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaUserCircle style={iconStyle} /> Account Number <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaUserCircle style={inputIcon} />
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="XXXX-XXXX-XXXX"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle(errors.accountNumber && touched.accountNumber)}
                    maxLength="12"
                  />
                </div>
                {errors.accountNumber && touched.accountNumber && (
                  <div style={errorStyle}>{errors.accountNumber}</div>
                )}
              </div>
            </div>

            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaCreditCard style={iconStyle} /> Card Type <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaCreditCard style={inputIcon} />
                  <select
                    name="cardTypeId"
                    value={formData.cardTypeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={selectStyle(errors.cardTypeId && touched.cardTypeId)}
                    required
                  >
                    <option value="">Select Card Type</option>
                    <option value="1">Platinum</option>
                    <option value="2">Gold</option>
                    <option value="3">Silver</option>
                    <option value="4">Standard</option>
                  </select>
                </div>
                {errors.cardTypeId && touched.cardTypeId && (
                  <div style={errorStyle}>{errors.cardTypeId}</div>
                )}
              </div>
            </div>
          </div>

          {/* Second Row: Network Type & Apply Reason */}
          <div style={rowStyle}>
            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaNetworkWired style={iconStyle} /> Network Type <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaNetworkWired style={inputIcon} />
                  <select
                    name="networkTypeId"
                    value={formData.networkTypeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={selectStyle(errors.networkTypeId && touched.networkTypeId)}
                    required
                  >
                    <option value="">Select Network</option>
                    <option value="1">Visa</option>
                    <option value="2">RuPay</option>
                    <option value="3">MasterCard</option>
                    <option value="4">Discover</option>
                  </select>
                </div>
                {errors.networkTypeId && touched.networkTypeId && (
                  <div style={errorStyle}>{errors.networkTypeId}</div>
                )}
              </div>
            </div>

            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaQuestionCircle style={iconStyle} /> Apply Reason <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaQuestionCircle style={inputIcon} />
                  <select
                    name="applyReasonId"
                    value={formData.applyReasonId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={selectStyle(errors.applyReasonId && touched.applyReasonId)}
                    required
                  >
                    <option value="">Select Reason</option>
                    <option value="1">New Card</option>
                    <option value="2">Replacement</option>
                    <option value="3">Lost Card</option>
                    <option value="4">Damaged Card</option>
                    <option value="5">Upgrade Card</option>
                  </select>
                </div>
                {errors.applyReasonId && touched.applyReasonId && (
                  <div style={errorStyle}>{errors.applyReasonId}</div>
                )}
              </div>
            </div>
          </div>

          {/* Third Row: Full Name & Usage Type */}
          <div style={rowStyle}>
            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaUserCircle style={iconStyle} /> Full Name <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaUserCircle style={inputIcon} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle(errors.fullName && touched.fullName)}
                  />
                </div>
                {errors.fullName && touched.fullName && (
                  <div style={errorStyle}>{errors.fullName}</div>
                )}
              </div>
            </div>

            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaGlobeAmericas style={iconStyle} /> Usage Type <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaGlobeAmericas style={inputIcon} />
                  <select
                    name="usageType"
                    value={formData.usageType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={selectStyle(errors.usageType && touched.usageType)}
                    required
                  >
                    <option value="">Select Usage</option>
                    <option value="Domestic">Domestic (US Only)</option>
                    <option value="International">International</option>
                  </select>
                </div>
                {errors.usageType && touched.usageType && (
                  <div style={errorStyle}>{errors.usageType}</div>
                )}
              </div>
            </div>
          </div>

          {/* Fourth Row: Email & Phone Number */}
          <div style={rowStyle}>
            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaEnvelope style={iconStyle} /> Email Address <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaEnvelope style={inputIcon} />
                  <input
                    type="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle(errors.email && touched.email)}
                  />
                </div>
                {errors.email && touched.email && (
                  <div style={errorStyle}>{errors.email}</div>
                )}
              </div>
            </div>

            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaPhone style={iconStyle} /> Phone Number <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaPhone style={inputIcon} />
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="(123) 456-7890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle(errors.phoneNumber && touched.phoneNumber)}
                    maxLength="14"
                  />
                </div>
                {errors.phoneNumber && touched.phoneNumber && (
                  <div style={errorStyle}>{errors.phoneNumber}</div>
                )}
              </div>
            </div>
          </div>

          {/* Fifth Row: SSN Last 4 & Delivery Address (single column) */}
          <div style={rowStyle}>
            <div style={columnStyle}>
              <div style={formGroup}>
                <label style={labelStyle}>
                  <FaIdCard style={iconStyle} /> SSN Last 4 Digits <span style={requiredStar}>*</span>
                </label>
                <div style={inputContainer}>
                  <FaIdCard style={inputIcon} />
                  <input
                    type="password"
                    name="ssnLastFour"
                    placeholder="XXXX"
                    value={formData.ssnLastFour}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={inputStyle(errors.ssnLastFour && touched.ssnLastFour)}
                    maxLength="4"
                  />
                </div>
                {errors.ssnLastFour && touched.ssnLastFour && (
                  <div style={errorStyle}>{errors.ssnLastFour}</div>
                )}
              </div>
            </div>
            <div style={columnStyle}>
              {/* Empty column for alignment */}
            </div>
          </div>

          {/* Delivery Address (Full Width) */}
          <div style={formGroup}>
            <label style={labelStyle}>
              <FaMapMarkerAlt style={iconStyle} /> Delivery Address <span style={requiredStar}>*</span>
            </label>
            <div style={inputContainer}>
              <FaMapMarkerAlt style={inputIcon} />
              <textarea
                name="deliveryAddress"
                placeholder="Enter your complete delivery address (street, city, state, ZIP code)"
                value={formData.deliveryAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                style={textareaStyle(errors.deliveryAddress && touched.deliveryAddress)}
                rows="3"
                maxLength="200"
              />
            </div>
            {errors.deliveryAddress && touched.deliveryAddress && (
              <div style={errorStyle}>{errors.deliveryAddress}</div>
            )}
          </div>

          {/* Remarks (Full Width) */}
          <div style={formGroup}>
            <label style={labelStyle}>
              <FaStickyNote style={iconStyle} /> Additional Remarks (Optional)
            </label>
            <div style={inputContainer}>
              <FaStickyNote style={inputIcon} />
              <textarea
                name="remarks"
                placeholder="Enter any additional details or special instructions"
                value={formData.remarks}
                onChange={handleChange}
                onBlur={handleBlur}
                style={textareaStyle(errors.remarks && touched.remarks)}
                rows="3"
                maxLength="500"
              />
            </div>
            {errors.remarks && touched.remarks && (
              <div style={errorStyle}>{errors.remarks}</div>
            )}
            <div style={charCount}>
              {formData.remarks.length}/500 characters
            </div>
          </div>

          {/* Buttons */}
          <div style={buttonGroup}>
            <button 
              type="button" 
              style={cancelBtn}
              onClick={() => navigate("/services/debit-card")}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={submitBtn(isSubmitting || !isFormValid)}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <span style={spinner}></span> Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>

          <div style={disclaimer}>
            <p style={disclaimerText}>
              <strong>Note:</strong> All fields marked with <span style={requiredStar}>*</span> are required. 
              Please allow 7-10 business days for card delivery. A confirmation email will be sent to your registered email address.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const container = {
  minHeight: "100vh",
  width: "100%",
  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const formWrapper = {
  width: "100%",
  maxWidth: "900px",
  background: "white",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  color: "#333"
};

const headerSection = {
  textAlign: "center",
  marginBottom: "40px"
};

const iconHeader = {
  marginBottom: "15px"
};

const headerIcon = {
  fontSize: "48px",
  color: "#3498db"
};

const headerTitle = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#2c3e50",
  marginBottom: "10px"
};

const headerSubtitle = {
  fontSize: "16px",
  color: "#7f8c8d",
  marginBottom: "0"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "25px"
};

const rowStyle = {
  display: "flex",
  gap: "20px",
  width: "100%"
};

const columnStyle = {
  flex: "1",
  minWidth: "0" // Prevents overflow
};

const formGroup = {
  display: "flex",
  flexDirection: "column"
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#2c3e50",
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const iconStyle = {
  fontSize: "14px",
  color: "#3498db"
};

const inputContainer = {
  position: "relative",
  width: "100%"
};

const inputIcon = {
  position: "absolute",
  left: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "16px",
  color: "#95a5a6",
  zIndex: "1"
};

const inputStyle = (hasError) => ({
  width: "100%",
  padding: "14px 16px 14px 48px",
  border: `2px solid ${hasError ? "#e74c3c" : "#e0e0e0"}`,
  borderRadius: "8px",
  fontSize: "15px",
  transition: "all 0.3s ease",
  outline: "none",
  backgroundColor: hasError ? "#fff5f5" : "white",
  boxSizing: "border-box",
  "&:focus": {
    borderColor: hasError ? "#e74c3c" : "#3498db",
    boxShadow: hasError ? "0 0 0 3px rgba(231, 76, 60, 0.1)" : "0 0 0 3px rgba(52, 152, 219, 0.1)"
  },
  "&::placeholder": {
    color: "#bdc3c7"
  }
});

const selectStyle = (hasError) => ({
  ...inputStyle(hasError),
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 16px center",
  backgroundSize: "16px",
  paddingRight: "48px"
});

const textareaStyle = (hasError) => ({
  ...inputStyle(hasError),
  resize: "vertical",
  minHeight: "100px",
  padding: "14px 16px 14px 48px"
});

const errorStyle = {
  color: "#e74c3c",
  fontSize: "12px",
  marginTop: "6px",
  display: "flex",
  alignItems: "center",
  gap: "5px"
};

const buttonGroup = {
  display: "flex",
  gap: "15px",
  marginTop: "20px"
};

const cancelBtn = {
  flex: "1",
  padding: "16px",
  background: "#ecf0f1",
  color: "#7f8c8d",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    background: "#d5dbdb",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  }
};

const submitBtn = (disabled) => ({
  flex: "2",
  padding: "16px",
  background: disabled ? "#95a5a6" : "#2ecc71",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: "600",
  fontSize: "15px",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  "&:hover": disabled ? {} : {
    background: "#27ae60",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(46, 204, 113, 0.3)"
  }
});

const spinner = {
  width: "16px",
  height: "16px",
  border: "2px solid rgba(255,255,255,0.3)",
  borderRadius: "50%",
  borderTopColor: "#fff",
  animation: "spin 1s ease-in-out infinite",
  "@keyframes spin": {
    "to": { transform: "rotate(360deg)" }
  }
};

const charCount = {
  fontSize: "12px",
  color: "#95a5a6",
  textAlign: "right",
  marginTop: "6px"
};

const disclaimer = {
  marginTop: "25px",
  padding: "18px",
  background: "#f8f9fa",
  borderRadius: "8px",
  borderLeft: "5px solid #3498db"
};

const disclaimerText = {
  fontSize: "13px",
  color: "#7f8c8d",
  margin: "0",
  lineHeight: "1.6"
};

const requiredStar = {
  color: "#e74c3c",
  fontSize: "16px",
  marginLeft: "2px"
};

export default DebitCardRequest;