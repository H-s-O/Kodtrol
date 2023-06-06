/**
 * @function log
 * @description Sends data to Kodtrol's console window.
 * @param {...*} args The data to log; each argument will be cast to a string.
 * @example
 * log("Hello World")
 * // Displays "Hello World" in the console window
 * 
 * log(1, 2, 3, "four", 5)
 * // Displays "1 2 3 four 5" in the console window
 */
export default function log(...args) {
  __logCallback(args);
};
