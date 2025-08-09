import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Header from "../components/Header";
import { calculateWalletBalance, getWalletSummary } from "../utils/walletUtils";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [walletSummary, setWalletSummary] = useState(null);
  const { language } = useLanguage();

  // Use the utility function to calculate wallet balance
  const walletAmount = calculateWalletBalance();

  // Function to update transaction status from processing to failed after 5 minutes
  const checkAndUpdateProcessingTransactions = () => {
    const paymentTransactions = JSON.parse(localStorage.getItem("paymentTransactions") || "[]");
    let hasUpdates = false;

    const updatedTransactions = paymentTransactions.map(txn => {
      if (txn.status === "processing") {
        const processingTime = new Date(txn.updatedAt || txn.date);
        const now = new Date();
        const timeDiff = (now - processingTime) / (1000 * 60); // difference in minutes

        // Change from 10 minutes to 5 minutes
        if (timeDiff >= 5) {
          hasUpdates = true;
          return {
            ...txn,
            status: "failed",
            updatedAt: new Date().toISOString(),
            description: `Payment Failed - ₹${txn.amount}`
          };
        }
      }
      return txn;
    });

    if (hasUpdates) {
      localStorage.setItem("paymentTransactions", JSON.stringify(updatedTransactions));
      return true;
    }
    return false;
  };

  useEffect(() => {
    const loadTransactions = () => {
      // Check and update processing transactions first
      checkAndUpdateProcessingTransactions();

      const baseTransactions = [];

      // Get welcome bonus transaction
      const welcomeBonusTxn = localStorage.getItem("welcomeBonusTxn");
      const welcomeBonus = welcomeBonusTxn ? JSON.parse(welcomeBonusTxn) : null;

      // Get payment transactions
      const paymentTransactions = JSON.parse(localStorage.getItem("paymentTransactions") || "[]");

      // Combine all transactions
      const allTxns = [
        ...(welcomeBonus ? [welcomeBonus] : []),
        ...baseTransactions,
        ...paymentTransactions
      ];

      // Sort transactions by latest date first
      const sortedTxns = allTxns.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(sortedTxns);
      
      // Update wallet summary
      setWalletSummary(getWalletSummary());
    };

    loadTransactions();

    // Set up interval to check processing transactions every minute
    const interval = setInterval(() => {
      if (checkAndUpdateProcessingTransactions()) {
        loadTransactions(); // Reload if any updates were made
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // New function for relative time formatting
  const formatRelativeTime = (isoString) => {
    const now = new Date();
    const dateObj = new Date(isoString);
    const diffMs = now - dateObj;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const isToday = dateObj.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = dateObj.toDateString() === yesterday.toDateString();

    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 5) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    if (isToday) {
      return dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (isYesterday) {
      return `Yesterday, ${dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return dateObj.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionIcon = (txn) => {
    if (txn.type === "payment_initiated") {
      switch (txn.status) {
        case "initiated":
          return <Clock className="w-5 h-5 text-blue-500" />;
        case "cancelled":
          return <XCircle className="w-5 h-5 text-red-500" />;
        case "expired":
          return <Clock className="w-5 h-5 text-orange-500" />;
        case "processing":
          return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
        case "failed":
          return <XCircle className="w-5 h-5 text-red-500" />;
        case "completed":
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        default:
          return <Clock className="w-5 h-5 text-blue-500" />;
      }
    } else if (txn.type === "credit") {
      return <ArrowRightIcon className="w-5 h-5 text-green-600 rotate-[135deg]" />;
    } else if (txn.type === "debit") {
      return <ArrowRightIcon className="w-5 h-5 text-red-500 -rotate-45" />;
    }
    return <ArrowRightIcon className="w-5 h-5 text-gray-500" />;
  };

  const getTransactionColor = (txn) => {
    if (txn.type === "payment_initiated") {
      switch (txn.status) {
        case "initiated":
          return "text-blue-600";
        case "cancelled":
          return "text-red-500";
        case "expired":
          return "text-orange-500";
        case "processing":
          return "text-yellow-600";
        case "failed":
          return "text-red-500";
        case "completed":
          return "text-green-600";
        default:
          return "text-blue-600";
      }
    } else if (txn.type === "credit") {
      return "text-green-600";
    } else if (txn.type === "debit") {
      return "text-red-500";
    }
    return "text-gray-600";
  };

  const getStatusBadge = (txn) => {
    if (txn.type === "payment_initiated") {
      const statusColors = {
        initiated: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
        expired: "bg-orange-100 text-orange-800",
        processing: "bg-yellow-100 text-yellow-800",
        failed: "bg-red-100 text-red-800",
        completed: "bg-green-100 text-green-800"
      };
      
      const statusLabels = {
        initiated: getTranslation('pending', language),
        cancelled: getTranslation('cancelled', language),
        expired: getTranslation('expired', language),
        processing: getTranslation('processing', language),
        failed: getTranslation('failed', language),
        completed: getTranslation('completed', language)
      };

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[txn.status] || statusColors.initiated}`}>
          {statusLabels[txn.status] || "Pending"}
        </span>
      );
    }
    return null;
  };

  // Professional transaction description formatting
  const getTransactionDescription = (txn) => {
    if (txn.type === "payment_initiated") {
      return getTranslation('paymentRequest', language);
    } else if (txn.type === "credit") {
      return txn.description || getTranslation('credit', language);
    } else if (txn.type === "debit") {
      return txn.description || getTranslation('debit', language);
    }
    return txn.description || getTranslation('transaction', language);
  };

  return (
    <>
      <Header />
      <div className="mt-20"></div>
      <div className="p-4 w-full mx-auto">
        <div className="bg-green-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-2">{getTranslation('wallet', language)}</h2>
              <p className="text-3xl font-bold text-gray-800">
                ₹{walletAmount.toFixed(2)}
              </p>
              {walletSummary && (
                <p className="text-xs text-gray-500 mt-1">
                </p>
              )}
            </div>
            <Link
              to="/addfund"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              <PlusCircleIcon className="w-5 h-5" /> {getTranslation('addFunds', language)}
            </Link>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            {getTranslation('transactionHistory', language)}
          </h3>
          <ul className="space-y-4">
            {transactions.length === 0 ? (
              <li className="text-gray-500">{getTranslation('noTransactionsYet', language)}</li>
            ) : (
              transactions.map((txn) => (
                <li
                  key={txn.id}
                  className="flex items-center justify-between bg-green-100 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(txn)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {getTransactionDescription(txn)}
                        </p>
                        {getStatusBadge(txn)}
                      </div>
                      <p className="text-xs text-gray-600">
                        {formatRelativeTime(txn.date)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${getTransactionColor(txn)}`}>
                    {txn.type === "credit" ? "+" : txn.type === "debit" ? "-" : ""}₹{txn.amount}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Wallet;