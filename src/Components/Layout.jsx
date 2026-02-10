import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }) => {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                width: "100vw",          // ✅ ADD THIS
                boxSizing: "border-box" // ✅ ADD THIS
            }}
        >
            <Sidebar />

            <main
                style={{
                    flex: 1,
                    padding: "30px",
                    background: "#f4f6f9",
                    boxSizing: "border-box" // ✅ ADD THIS
                }}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;
