import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Clock, CheckCircle, XCircle, Package, ExternalLink } from "lucide-react";
import { updatePageSEO } from "../utils/seoUtils";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Update SEO for orders page
    updatePageSEO('orders');
    
    // Load orders from localStorage
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
    
    // Sort orders by latest date first
    const sortedOrders = savedOrders.sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );
    
    setOrders(sortedOrders);
  };

  // Function to get status color and icon
  const getStatusDisplay = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: <Clock className="w-4 h-4" />
        };
      case 'processing':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: <Package className="w-4 h-4" />
        };
      case 'completed':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'cancelled':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: <XCircle className="w-4 h-4" />
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <Clock className="w-4 h-4" />
        };
    }
  };

  // Format date for display
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? "Just now" : `${diffMinutes} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Function to open link in new tab
  const openLink = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Header />
      <div className="mt-20 p-4">

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              You haven't placed any orders yet. Start exploring our services!
            </p>
            <a
              href="/"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusDisplay = getStatusDisplay(order.status);
              
              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.serviceLogo}
                        alt={order.serviceName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/ic/logo.svg';
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {order.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {order.serviceName} • {order.serviceType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{order.amount}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.bgColor} ${statusDisplay.color}`}>
                        {statusDisplay.icon}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    
                    {order.targetUrl && (
                      <button
                        onClick={() => openLink(order.targetUrl)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Target
                      </button>
                    )}
                  </div>

                  {order.description && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600">{order.description}</p>
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Estimated delivery: {order.estimatedDelivery}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Order Statistics */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'completed').length}
              </p>
              <p className="text-xs text-green-700">Completed</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'processing').length}
              </p>
              <p className="text-xs text-blue-700">Processing</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </p>
              <p className="text-xs text-yellow-700">Pending</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-600">{orders.length}</p>
              <p className="text-xs text-gray-700">Total Orders</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;