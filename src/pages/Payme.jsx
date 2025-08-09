import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import NoCopyText from "../components/ui/NoCopyText";
import PaymentHeader from "../components/payment/PaymentHeader";
import PaymentMethods from "../components/payment/PaymentMethods";
import PaymentPopup from "../components/payment/PaymentPopup";

// ✅ Define the base UPI URL ONCE — change here only
const BASE_UPI_URL =
  "pay?ver=01&mode=01&pa=netc.34161FA820328AA2D24366C0@mairtel&purpose=00&mc=4784&pn=NETC%20FASTag%20Recharge&orgid=159753&qrMedium=04";

  
const Payme = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("1.00");
  const [amountError, setAmountError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("phonepe");
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [displayAmount, setDisplayAmount] = useState(amount);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = atob(token);
        const tokenParts = decodedToken.split("-");
        const [encodedAmount] = tokenParts;
        const parsedAmount = parseInt(encodedAmount, 10);

        if (parsedAmount && parsedAmount >= 30) {
          setAmount(parsedAmount.toString());
        } else {
          setAmountError("Invalid payment amount");
          setTimeout(() => navigate("/addfund"), 2000);
        }
      } catch {
        setAmountError("Invalid payment token");
        setTimeout(() => navigate("/addfund"), 2000);
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    let timer;
    if (showPopup && selectedPaymentMethod === "qrcode" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            closePopup();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showPopup, selectedPaymentMethod, timeLeft]);

  useEffect(() => {
    if (selectedPaymentMethod === "upi") {
      setDisplayAmount((parseFloat(amount) - 2).toString());
    } else if (selectedPaymentMethod === "phonepe") {
      setDisplayAmount((parseFloat(amount) - 3).toString());
    } else {
      setDisplayAmount(amount);
    }
  }, [selectedPaymentMethod, amount]);

  const handleBack = () => {
    if (token) {
      const existingTransactions = JSON.parse(
        localStorage.getItem("paymentTransactions") || "[]"
      );
      const filteredTransactions = existingTransactions.filter(
        (txn) => !(txn.paymentToken === token && txn.status === "initiated")
      );
      localStorage.setItem(
        "paymentTransactions",
        JSON.stringify(filteredTransactions)
      );
    }
    navigate("/wallet");
  };

  const generateQRCode = async () => {
    const qrLink = `upi:${BASE_UPI_URL}&am=${displayAmount}`;
    try {
      const qrDataUrl = await QRCode.toDataURL(qrLink, {
        width: 200,
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleContinue = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setShowPopup(true);
    setIsClosing(false);
    setTimeLeft(180);

    if (selectedPaymentMethod === "qrcode") {
      await generateQRCode();
      return;
    }

    let scheme = "upi";
    switch (selectedPaymentMethod.toLowerCase()) {
      case "paytm":
        scheme = "paytmmp";
        break;
      case "phonepe":
        scheme = "phonepe";
        break;
      case "gpay":
        scheme = "upi";
        break;
      default:
        scheme = "upi";
    }

    const redirect_url = `${scheme}:${BASE_UPI_URL}&am=${displayAmount}`;
    setTimeout(() => {
      window.location.href = redirect_url;
    }, 1000);
  };

  const closePopup = () => {
    if (typeof console !== "undefined" && console.clear) console.clear();
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
      setQrCodeDataUrl("");
      setTimeLeft(180);
    }, 300);
  };

  if (amountError) {
    return (
      <div className="px-5">
        <PaymentHeader onBack={handleBack} />
        <div className="text-center mt-8">
          <p className="text-red-600 font-semibold">{amountError}</p>
          <p className="text-gray-500 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <NoCopyText>
      <div className="px-5 flex flex-col">
        <PaymentHeader onBack={handleBack} />

        <div className="flex items-center justify-between my-4">
          <div className="flex gap-3 items-center">
            <img src="/ic/bill.svg" alt="Add Money" />
            <p>Add Money</p>
            {selectedPaymentMethod === "upi" && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold">
                ₹2 OFF
              </span>
            )}
            {selectedPaymentMethod === "phonepe" && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold">
                ₹3 OFF
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {((selectedPaymentMethod === "upi" && parseFloat(amount) > 2) || 
              (selectedPaymentMethod === "phonepe" && parseFloat(amount) > 3)) && (
              <span className="text-sm text-gray-500 line-through">₹{amount}</span>
            )}
            <span className="font-medium">₹{displayAmount}</span>
          </div>
        </div>

        <PaymentMethods
          selectedPaymentMethod={selectedPaymentMethod}
          onMethodSelect={setSelectedPaymentMethod}
          showUpiDiscount={parseFloat(amount) > 2}
          showPhonePeDiscount={parseFloat(amount) > 3}
        />

        <div className="mt-auto pb-6">
          <button
            onClick={handleContinue}
            disabled={!selectedPaymentMethod}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              selectedPaymentMethod
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>

        <PaymentPopup
          showPopup={showPopup}
          isClosing={isClosing}
          selectedPaymentMethod={selectedPaymentMethod}
          qrCodeDataUrl={qrCodeDataUrl}
          timeLeft={timeLeft}
          amount={displayAmount}
          onClose={closePopup}
        />
      </div>
    </NoCopyText>
  );
};

export default Payme;
