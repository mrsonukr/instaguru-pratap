import siteConfig from '../config/siteConfig';

/**
 * Calculate current wallet balance from transactions
 */
export const calculateWalletBalance = () => {
  const transactions = [];

  // Get welcome bonus transaction
  const welcomeBonusTxn = localStorage.getItem("welcomeBonusTxn");
  const welcomeBonus = welcomeBonusTxn ? JSON.parse(welcomeBonusTxn) : null;

  // Get payment transactions
  const paymentTransactions = JSON.parse(localStorage.getItem("paymentTransactions") || "[]");

  // Combine all transactions
  const allTxns = [
    ...(welcomeBonus ? [welcomeBonus] : []),
    ...paymentTransactions
  ];

  // Calculate balance
  const balance = allTxns.reduce((sum, txn) => {
    if (txn.type === "credit") {
      return sum + txn.amount;
    } else if (txn.type === "debit") {
      return sum - txn.amount;
    }
    return sum;
  }, 0);

  return Math.max(0, balance); // Ensure balance is never negative
};

/**
 * Check if a service is affordable based on wallet balance
 */
export const isServiceAffordable = (servicePrice, walletBalance = null) => {
  const balance = walletBalance !== null ? walletBalance : calculateWalletBalance();
  return balance >= servicePrice;
};

/**
 * Get service availability status based on wallet balance
 * Services that are affordable (price <= wallet balance) are marked as "Out of Stock"
 */
export const getServiceAvailabilityStatus = (servicePrice, originalStatus = 'available') => {
  // Get current wallet balance
  const walletBalance = calculateWalletBalance();
  
  // Check if service is affordable
  const affordable = isServiceAffordable(servicePrice, walletBalance);
  
  // If service is affordable, mark as "Out of Stock"
  if (affordable) {
    return 'out_of_stock';
  }
  
  // Return original status for services that cost more than wallet balance
  return originalStatus;
};

/**
 * Update service availability in local storage for testing
 */
export const updateServiceAvailability = (serviceId, status) => {
  const serviceAvailability = JSON.parse(localStorage.getItem("serviceAvailability") || "{}");
  serviceAvailability[serviceId] = {
    status,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem("serviceAvailability", JSON.stringify(serviceAvailability));
};

/**
 * Get stored service availability from local storage
 */
export const getStoredServiceAvailability = (serviceId) => {
  const serviceAvailability = JSON.parse(localStorage.getItem("serviceAvailability") || "{}");
  return serviceAvailability[serviceId]?.status || 'available';
};

/**
 * Process all services and update their availability based on wallet balance
 */
export const processServiceAvailability = (services) => {
  const walletBalance = calculateWalletBalance();
  
  return services.map(service => ({
    ...service,
    packs: service.packs.map(pack => {
      const originalStatus = getStoredServiceAvailability(pack.id);
      const newStatus = getServiceAvailabilityStatus(pack.price, originalStatus);
      
      // Update in local storage for testing
      updateServiceAvailability(pack.id, newStatus);
      
      return {
        ...pack,
        availability: newStatus,
        isAffordable: isServiceAffordable(pack.price, walletBalance)
      };
    })
  }));
};

/**
 * Check if user has sufficient funds for a purchase
 */
export const hasSufficientFunds = (requiredAmount) => {
  const walletBalance = calculateWalletBalance();
  return walletBalance >= requiredAmount;
};

/**
 * Get wallet balance summary for display
 */
export const getWalletSummary = () => {
  const balance = calculateWalletBalance();
  const transactions = [];

  // Get all transactions for summary
  const welcomeBonusTxn = localStorage.getItem("welcomeBonusTxn");
  const welcomeBonus = welcomeBonusTxn ? JSON.parse(welcomeBonusTxn) : null;
  const paymentTransactions = JSON.parse(localStorage.getItem("paymentTransactions") || "[]");

  const allTxns = [
    ...(welcomeBonus ? [welcomeBonus] : []),
    ...paymentTransactions
  ];

  return {
    balance,
    totalTransactions: allTxns.length,
    lastUpdated: new Date().toISOString()
  };
};