// Console utility functions

/**
 * Clear browser console programmatically
 */
export const clearConsole = () => {
  try {
    // Method 1: Standard console.clear()
    if (typeof console !== 'undefined' && console.clear) {
      console.clear();
      return true;
    }
    
    // Method 2: Alternative for older browsers
    if (typeof console !== 'undefined' && console.log) {
      console.log('\x1Bc'); // ANSI escape sequence
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('Could not clear console:', error);
    return false;
  }
};

/**
 * Clear console and show custom message
 */
export const clearConsoleWithMessage = (message = 'Console cleared') => {
  const cleared = clearConsole();
  if (cleared && message) {
    console.log(`%c${message}`, 'color: green; font-weight: bold;');
  }
  return cleared;
};

/**
 * Clear console on specific events
 */
export const setupConsoleClear = () => {
  // Clear console on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      clearConsole();
    }
  });
  
  // Clear console on focus
  window.addEventListener('focus', () => {
    clearConsole();
  });
};

/**
 * Disable console methods in production
 */
export const disableConsoleInProduction = () => {
  if (process.env.NODE_ENV === 'production') {
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;
  }
};