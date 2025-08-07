import React, { useState, useEffect } from "react";
import { FiMenu, FiHome, FiCreditCard, FiPhone, FiInfo, FiShare2, FiPackage } from "react-icons/fi";
import { Link } from "react-router-dom";
import siteConfig from "../config/siteConfig";
import { calculateWalletBalance } from "../utils/walletUtils";
import { clearConsole } from "../utils/consoleUtils";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  // Update wallet balance when component mounts or when sidebar opens
  useEffect(() => {
    const updateBalance = () => {
      const balance = calculateWalletBalance();
      setWalletBalance(balance);
    };
    
    updateBalance();
    
    // Update balance when sidebar opens
    if (isSidebarOpen) {
      updateBalance();
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    // Clear console when opening/closing sidebar
    clearConsole();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Header with Logo and Menu Icon */}
      <header className="flex justify-between items-center p-4 bg-white text-black fixed top-0 w-full z-10">
        <div className="logo">
          <Link to="/">
            <img
              src={siteConfig.logoPath}
              alt={`${siteConfig.siteName} Logo`}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div
          className="menu-icon cursor-pointer p-2 rounded-full hover:bg-green-200 transition-colors duration-200"
          onClick={toggleSidebar}
        >
          <FiMenu className="h-6 w-6" />
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-10 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 w-72 h-full rounded-r-3xl bg-white/95 backdrop-blur-lg shadow-2xl pt-6 transition-transform duration-300 ease-in-out z-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img
          src={siteConfig.logoPath}
          alt={`${siteConfig.siteName} Logo`}
          className="mx-6 mb-4 h-8 w-auto"
        />
        <ul className="list-none p-0 m-0">
          <li>
            <Link
              to="/"
              className="flex items-center p-4 border-b border-gray-200 hover:bg-green-50 transition-colors duration-200 gap-3 text-gray-800 font-medium no-underline"
            >
              <FiHome className="w-6 h-6 text-green-500" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/wallet"
              className="flex items-center p-4 border-b border-gray-200 hover:bg-green-50 transition-colors duration-200 gap-3 text-gray-800 font-medium no-underline"
            >
              <FiCreditCard className="w-6 h-6 text-green-500" />
              Wallet: ₹{walletBalance.toFixed(2)}
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="flex items-center p-4 border-b border-gray-200 hover:bg-green-50 transition-colors duration-200 gap-3 text-gray-800 font-medium no-underline"
            >
              <FiPackage className="w-6 h-6 text-green-500" />
              My Orders
            </Link>
          </li>
          <li>
            <Link
              to="/refer"
              className="flex items-center p-4 border-b border-gray-200 hover:bg-green-50 transition-colors duration-200 gap-3 text-gray-800 font-medium no-underline"
            >
              <FiShare2 className="w-6 h-6 text-green-500" />
              Refer
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              rel="noopener noreferrer"
              className="flex items-center p-4 border-b border-gray-200 hover:bg-green-50 transition-colors duration-200 gap-3 text-gray-800 font-medium no-underline"
            >
              <FiPhone className="w-6 h-6 text-green-500" />
              Contact Us
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="flex items-center p-4 border-b border-gray-200 hover:bg-green-50 transition-colors duration-200 gap-3 text-gray-800 font-medium no-underline"
            >
              <FiInfo className="w-6 h-6 text-green-500" />
              About
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Header;