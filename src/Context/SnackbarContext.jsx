import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {

    const [snackbar, setSnackbar] = useState({
        open: false,
        type: "success",
        message: ""
    });

    const showSnackbar = useCallback((type, message) => {
        setSnackbar({
            open: true,
            type,
            message
        });

        setTimeout(() => {
            setSnackbar(prev => ({ ...prev, open: false }));
        }, 3000);
    }, []);

    const closeSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            {snackbar.open && (
                <div style={styles.wrapper}>
                    <div
                        style={{
                            ...styles.snackbar,
                            backgroundColor:
                                snackbar.type === "success"
                                    ? "#16a34a"
                                    : "#dc2626"
                        }}
                    >
                        <div style={styles.content}>
                            {snackbar.type === "success" ? (
                                <FaCheckCircle />
                            ) : (
                                <FaExclamationCircle />
                            )}
                            <span>{snackbar.message}</span>
                        </div>

                        <FaTimes
                            style={styles.close}
                            onClick={closeSnackbar}
                        />
                    </div>
                </div>
            )}
        </SnackbarContext.Provider>
    );
};

const styles = {
    wrapper: {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        zIndex: 9999,
        animation: "slideIn 0.3s ease-out"
    },
    snackbar: {
        minWidth: "300px",
        padding: "14px 18px",
        borderRadius: "12px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },
    content: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "14px",
        fontWeight: "500"
    },
    close: {
        cursor: "pointer"
    }
};

export default SnackbarContext;
