import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Layout from "./Components/Layout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Profile from "./Components/Profile/Profile";
import DebitCard from "./Components/Services/DebitCard";
import DebitCardRequest from "./Components/Services/DebitCardRequest";
import Checkbook from "./Components/Services/Checkbook";
import CreditCard from "./Components/Services/CreditCard";
import CreditCardRequest from "./Components/Services/CreditCardRequest";

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
          path="/services/debit-card"
          element={
            <Layout>
              <DebitCard />
            </Layout>
          }
        />

        <Route
          path="/services/debit-card-request"
          element={
            <Layout>
              <DebitCardRequest />
            </Layout>
          }
        />

        <Route
          path="/services/credit-card"
          element={
            <Layout>
              <CreditCard />
            </Layout>
          }
        />

        <Route
          path="/services/credit-card-request"
          element={
            <Layout>
              <CreditCardRequest />
            </Layout>
          }
        />

        <Route
          path="/services/checkbook"
          element={
            <Layout>
              <Checkbook />
            </Layout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
