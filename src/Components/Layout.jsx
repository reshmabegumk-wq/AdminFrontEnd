import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }) => {
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",      // 🔥 CHANGE minHeight → height
                width: "100vw",
                overflow: "hidden",   // 🔥 PREVENT whole page scroll
                boxSizing: "border-box"
            }}
        >
            <Sidebar />

            <main
                style={{
                    flex: 1,
                    padding: "30px",
                    background: "#f4f6f9",
                    overflowY: "auto",  // 🔥 ONLY MAIN SCROLLS
                    height: "100vh",    // 🔥 FIXED HEIGHT
                    boxSizing: "border-box"
                }}
            >
                {children}
            </main>
        </div>
    );
};


export default Layout;
