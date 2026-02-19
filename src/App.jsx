import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Layout from "./Components/Layout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Profile from "./Components/Profile/Profile";
import ChequeLeavesRequests from "./Components/Requests/ChequeLeavesRequests";
import StolenCardRequests from "./Components/Requests/StolenCardRequests";
import IncreaseLimitRequests from "./Components/Requests/IncreaseLimitRequests";
import CustomerQueries from "./Components/Requests/CustomerQueries";
import CustomerAdminManagement from "./Components/Users/CustomerAdminManagement";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/cheque-book"
          element={
            <Layout>
              <ChequeLeavesRequests />
            </Layout>
          }
        />

        <Route
          path="/stolen-card"
          element={
            <Layout>
              <StolenCardRequests />
            </Layout>
          }
        />

        <Route
          path="/increase-limit"
          element={
            <Layout>
              <IncreaseLimitRequests />
            </Layout>
          }
        />

        <Route
          path="/customer-queries"
          element={
            <Layout>
              <CustomerQueries />
            </Layout>
          }
        />

        <Route
          path="/users"
          element={
            <Layout>
              <CustomerAdminManagement />
            </Layout>
          }
        />


      </Routes>
    </BrowserRouter>
  );
};

export default App;
