import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, Clock } from "lucide-react";

const Timer = ({ onExpired }) => {
  // Example internal states (replace or update as needed)
  const [paymentState, setPaymentState] = useState("WAITING"); // WAITING, PROCESSING, SUCCESS, FAILED
  const [timeRemaining, setTimeRemaining] = useState(300); // seconds

  // Format timeRemaining as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const formattedTime = formatTime(timeRemaining);

  // Example timer countdown for demo, reduces timeRemaining by 1 every second if WAITING
  useEffect(() => {
    if (paymentState === "WAITING" && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentState === "WAITING" && timeRemaining === 0) {
      // Timer expired
      if (onExpired) {
        onExpired();
      }
    }
  }, [paymentState, timeRemaining, onExpired]);

  // Calculate time percentage for circular progress (assuming max 300 seconds)
  const timePercentage = (timeRemaining / 300) * 100;

  const renderStatusContent = () => {
    switch (paymentState) {
      case "WAITING":
        return (
          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 mb-2">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0066CC"
                  strokeWidth="2"
                  strokeDasharray={`${timePercentage}, 100`}
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Waiting for payment</p>
              <p className="text-xs text-gray-500 mt-1">Time remaining: {formattedTime}</p>
            </div>
          </div>
        );

      case "PROCESSING":
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-2 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-yellow-600">Processing payment</p>
              <p className="text-xs text-gray-500 mt-1">Please wait while we verify your payment</p>
            </div>
          </div>
        );

      case "SUCCESS":
        return (
          <div className="flex flex-col items-center animate-fadeIn">
            <div className="w-16 h-16 mb-2 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">Payment Successful!</p>
              <p className="text-sm text-gray-600 mt-1">Your transaction has been completed</p>
              <p className="text-xs text-gray-500 mt-3">
                Transaction ID: RZP{Date.now().toString().substring(5)}
              </p>
            </div>
          </div>
        );

      case "FAILED":
        return (
          <div className="flex flex-col items-center animate-fadeIn">
            <div className="w-16 h-16 mb-2 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600">Payment Failed</p>
              <p className="text-sm text-gray-600 mt-1">Your transaction could not be completed</p>
              <button
                onClick={() => setPaymentState("WAITING")}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="py-4 flex justify-center">{renderStatusContent()}</div>;
};

export default Timer;