import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import Skeleton from "../ui/Skeleton";

const PaymentPopup = ({
  showPopup,
  isClosing,
  selectedPaymentMethod,
  qrCodeDataUrl,
  timeLeft,
  amount,
  onClose,
}) => {
  const [loadedImages, setLoadedImages] = useState({});
  const [showAppNotInstalled, setShowAppNotInstalled] = useState(false);

  const handleClose = () => {
    // Clear browser console
    if (typeof console !== "undefined" && console.clear) {
      console.clear();
    }

    onClose();

    // Page refresh ONLY in Safari after closing popup
    setTimeout(() => {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isSafari) {
        window.location.reload();
      }
    }, 300);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleImageLoad = (imageName) => {
    setLoadedImages((prev) => ({ ...prev, [imageName]: true }));
  };

  // Effect to show "app not installed" message after 3 seconds
  useEffect(() => {
    if (showPopup && selectedPaymentMethod !== "qrcode") {
      const timer = setTimeout(() => {
        setShowAppNotInstalled(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        setShowAppNotInstalled(false);
      };
    } else {
      setShowAppNotInstalled(false);
    }
  }, [showPopup, selectedPaymentMethod]);

  const PaymentIcon = ({ src, alt, className, imageName }) => (
    <div className="relative inline-block">
      {!loadedImages[imageName] && (
        <Skeleton
          className={`absolute inset-0 ${className} rounded transition-all duration-200`}
        />
      )}
      <img
        loading="lazy"
        src={src}
        alt={alt}
        onLoad={() => handleImageLoad(imageName)}
        className={`${className} transition-opacity duration-300 ease-in-out ${
          loadedImages[imageName] ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "opacity", backfaceVisibility: "hidden" }}
      />
    </div>
  );

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div
        className={`bg-white w-full rounded-t-3xl transform transition-transform duration-300 ease-out ${
          isClosing ? "translate-y-full" : "translate-y-0"
        }`}
      >
        {/* iPhone-style handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedPaymentMethod === "qrcode"
                ? "Scan QR Code"
                : "Processing Payment"}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content based on payment method */}
          {selectedPaymentMethod === "qrcode" ? (
            <div className="text-center py-4">
              {qrCodeDataUrl ? (
                <>
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block mb-4">
                    <img
                      src={qrCodeDataUrl}
                      alt="Payment QR Code"
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-red-600 mb-4">
                    {formatTime(timeLeft)} Time Remaining
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    Scan this QR code with any UPI app to pay ₹{amount}
                  </p>
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <img className="h-4" src="/ic/paytm.svg" alt="" />
                    <img className="h-6" src="/ic/phonepe.svg" alt="" />
                    <img className="h-6" src="/ic/gpay.svg" alt="" />
                    <img className="h-4" src="/ic/upi.svg" alt="" />
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="flex justify-center mb-4">
                    <ThreeDot
                      color="#3b7aff"
                      size="medium"
                      text=""
                      textColor=""
                    />
                  </div>
                  <p className="text-gray-600">Generating QR Code...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <ThreeDot color="#3b7aff" size="large" text="" textColor="" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Processing Payment</h4>
              <p className="text-gray-600 mb-4">
                {showAppNotInstalled ? (
                  <>
                    Unable to open{" "}
                    {selectedPaymentMethod === "paytm"
                      ? "PayTM"
                      : selectedPaymentMethod === "phonepe"
                      ? "PhonePe"
                      : selectedPaymentMethod === "gpay"
                      ? "Google Pay"
                      : "UPI"}{" "}
                   
                  </>
                ) : (
                  <>
                    Redirecting to{" "}
                    {selectedPaymentMethod === "paytm"
                      ? "PayTM"
                      : selectedPaymentMethod === "phonepe"
                      ? "PhonePe"
                      : selectedPaymentMethod === "gpay"
                      ? "Google Pay"
                      : "UPI"}{" "}
                    app...
                  </>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {showAppNotInstalled
                  ? "You can select a different payment method from the options above."
                  : "If the app doesn't open automatically, please check your installed apps."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
