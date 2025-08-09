import React, { useState } from "react";
import COLOR_VARIANTS from "../../utils/colorVariants";
import { hasSufficientFunds, calculateWalletBalance } from "../../utils/walletUtils";
import Popup from "../ui/Popup";
import { useLanguage } from "../../context/LanguageContext";
import { getTranslation } from "../../data/translations";

const PurchaseForm = ({
  color = "green",
  serviceData = {},
  filter = "Followers",
  onSubmit,
  packPrice = 0,
}) => {
  const { language } = useLanguage();
  const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS.red;
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  if (
    !serviceData ||
    !serviceData.label ||
    !serviceData.placeholder ||
    !serviceData.logo ||
    !serviceData.filters
  ) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 font-semibold">
          {getTranslation('invalidServiceData', language)}
        </p>
      </div>
    );
  }

  const config = serviceData;
  const filterConfig = config.filters?.[filter] || {
    label: config.label,
    placeholder: config.placeholder,
  };

  // Get the proper label for this filter
  const filterLabel = getTranslation(`${config.slug}.label`, language);
  const translatedFilterConfig = {
    ...filterConfig,
    label: filterLabel || config.label,
    placeholder: config.placeholder // Placeholder is already translated in serviceData
  };

  // Get current wallet balance
  const walletBalance = calculateWalletBalance();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Check if user has sufficient funds
      const sufficientFunds = hasSufficientFunds(packPrice);
      if (!sufficientFunds) {
        setShowPopup(true);
      } else if (onSubmit) {
        onSubmit(input);
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-4 p-4 rounded-lg ${variant.cardBg} max-w-full w-full mx-auto my-4 box-border sm:p-6`}
      >
        <label
          htmlFor="profileInput"
          className="text-gray-800 font-semibold flex items-center gap-2"
        >
          <img
            src={config.logo}
            className="w-8 h-8 rounded-full bg-cover"
            alt={`${config.name} icon`}
          />
          {translatedFilterConfig.label}
        </label>
        <input
          id="profileInput"
          type="text"
          placeholder={translatedFilterConfig.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          className={`px-3 py-2 rounded border-[1.5px] ${variant.borderColor} focus:outline-none w-full box-border`}
        />
        
        
        <button
          type="submit"
          className={`text-center text-white w-full px-6 py-2 rounded-full gap-2 ${variant.buttonBg} ${variant.buttonHover}`}
        >
          {getTranslation('continue', language)}
        </button>
      </form>
      <Popup isVisible={showPopup} onClose={handleClosePopup} requiredAmount={packPrice} />
    </>
  );
};

export default PurchaseForm;