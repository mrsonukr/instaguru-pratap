import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import Home from "./pages/Home";
import Payme from "./pages/Payme";
import Getdata from "./pages/Getdata";

// Lazy load non-critical routes
const About = lazy(() => import("./pages/About"));
const Purchase = lazy(() => import("./pages/Purchase"));
const Contact = lazy(() => import("./pages/Contact"));
const Products = lazy(() => import("./pages/Products"));
const AddFunds = lazy(() => import("./pages/AddFunds"));
const Wallet = lazy(() => import("./pages/Wallet"));
const ReferPage = lazy(() => import("./pages/Refer"));
const Redirecting = lazy(() => import("./pages/Redirecting"));
const Orders = lazy(() => import("./pages/Orders"));
const GenerateLink = lazy(() => import("./pages/GenerateLink"));
const ProcessLink = lazy(() => import("./pages/ProcessLink"));
const Refund = lazy(() => import("./pages/Refund"));


const Routing = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/getdata" element={<Getdata />} />
        <Route path="/" element={<Home />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/refer" element={<ReferPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/purchase/:id" element={<Purchase />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/:slug" element={<Products />} />
        <Route path="/addfund" element={<AddFunds />} />
        <Route path="/payment/:token" element={<Payme />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/refer/:referralId" element={<ReferPage />} />
        <Route path="/redirecting" element={<Redirecting />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/generate-link" element={<GenerateLink />} />
        <Route path="/add-funds/:token" element={<ProcessLink />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default Routing;