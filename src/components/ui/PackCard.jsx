import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ShoppingBag } from "lucide-react";
import COLOR_VARIANTS from "../../utils/colorVariants";
import { getServiceAvailabilityStatus, isServiceAffordable, calculateWalletBalance } from "../../utils/walletUtils";
import { Link } from "react-router-dom";

const PackCard = ({ color = "red", title, description, price, link, packId }) => {
  const variant = COLOR_VARIANTS[color] || COLOR_VARIANTS.red;
  
  // Check service availability based on wallet balance
  const walletBalance = calculateWalletBalance();
  const availabilityStatus = getServiceAvailabilityStatus(price);
  const affordable = isServiceAffordable(price, walletBalance);
  const isOutOfStock = availabilityStatus === 'out_of_stock';

  // If out of stock (affordable), show disabled state
  if (isOutOfStock) {
    return (
      <div className={`flex items-center ${variant.cardBg} mt-4 rounded-lg p-4 w-full opacity-60 cursor-not-allowed`}>
        <div className="flex flex-col flex-grow pr-4 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 truncate">{description}</p>
        </div>

        <div className="flex-shrink-0 bg-gray-400 text-white text-sm px-4 py-2 rounded-full flex items-center gap-1">
          <ShoppingBag className="w-4 h-4" />
          Out of Stock
        </div>
      </div>
    );
  }

  return (
    <Link
      to={link}
      className={`flex items-center ${variant.cardBg} mt-4 rounded-lg p-4 w-full transition no-underline`}
    >
      <div className="flex flex-col flex-grow pr-4 min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {title}
        </h3>
        <p className="text-xs text-gray-600 mt-1 truncate">{description}</p>
        {affordable && (
          <p className="text-xs text-green-600 mt-1 font-semibold">
            ✓ You can afford this
          </p>
        )}
      </div>

      <div
        className={`flex-shrink-0 text-white text-sm px-4 py-2 rounded-full flex items-center gap-1 ${variant.buttonBg} ${variant.buttonHover}`}
      >
        ₹{price}
        <ArrowRightIcon className="w-4 h-4" />
      </div>
    </Link>
  );
};

export default PackCard;
