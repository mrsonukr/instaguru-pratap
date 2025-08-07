import React from "react";
import WalletOption from "./WalletOption";
import SectionLabel from "./SectionLabel";

const PaymentMethods = ({ selectedPaymentMethod, onMethodSelect, showUpiDiscount = false, showPhonePeDiscount = false }) => {
  return (
    <>
      {/* PAY WITH UPI */}
      <SectionLabel text="PAY WITH" icon="/ic/upi.png" />
      <div className="flex flex-col py-5 flex-grow">
        <WalletOption
          icon="/ic/paytm.svg"
          label="PayTM"
          value="paytm"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
        <WalletOption
          icon="/ic/phonepe.svg"
          label={
            <div className="flex items-center gap-2">
              <span>Phone Pe</span>
              {showPhonePeDiscount && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold">
                  ₹3 OFF
                </span>
              )}
            </div>
          }
          value="phonepe"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
        <WalletOption
          icon="/ic/gpay.svg"
          label="Google Pay"
          value="gpay"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
        <WalletOption
          icon="/ic/upi.svg"
          label={
            <div className="flex items-center gap-2">
              <span>Other UPI</span>
              {showUpiDiscount && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-semibold">
                  ₹2 OFF
                </span>
              )}
            </div>
          }
          value="upi"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
        <WalletOption
          icon={<QRCodeIcon />}
          label="Scan QR Code"
          value="qrcode"
          selectedMethod={selectedPaymentMethod}
          onSelect={onMethodSelect}
        />
      </div>
    </>
  );
};

// QR Code SVG icon component
const QRCodeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-600"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="5" y="5" width="3" height="3" fill="currentColor"/>
    <rect x="16" y="5" width="3" height="3" fill="currentColor"/>
    <rect x="5" y="16" width="3" height="3" fill="currentColor"/>
    <rect x="14" y="14" width="2" height="2" fill="currentColor"/>
    <rect x="17" y="14" width="2" height="2" fill="currentColor"/>
    <rect x="14" y="17" width="2" height="2" fill="currentColor"/>
    <rect x="19" y="17" width="2" height="2" fill="currentColor"/>
    <rect x="17" y="19" width="2" height="2" fill="currentColor"/>
  </svg>
);

export default PaymentMethods;