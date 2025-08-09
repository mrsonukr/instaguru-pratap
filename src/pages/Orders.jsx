import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Package } from "lucide-react";
import { updatePageSEO } from "../utils/seoUtils";
import { useLanguage } from "../context/LanguageContext";
import { getTranslation } from "../data/translations";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    // Update SEO for orders page
    updatePageSEO('orders');
    
    // Load orders from localStorage
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    setOrders(savedOrders);
  };

  return (
    <>
      <Header />
      <div className="mt-20 p-4">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {getTranslation('noOrdersYet', language)}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {getTranslation('noOrdersMessage', language)}
          </p>
          <a
            href="/"
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            {getTranslation('browseServices', language)}
          </a>
        </div>
      </div>
    </>
  );
};

export default Orders;