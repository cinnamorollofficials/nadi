/**
 * Custom JSON.stringify that handles BigInt values
 * @param {any} value - The value to stringify
 * @param {function} replacer - Optional replacer function (will be combined with BigInt handler)
 * @param {number|string} space - Optional space parameter for formatting
 * @returns {string} JSON string with BigInt values converted to strings
 */
export const safeStringify = (value, replacer = null, space = null) => {
  const bigIntReplacer = (key, val) => {
    if (typeof val === 'bigint') {
      return val.toString() + 'n';
    }
    return val;
  };

  // If a custom replacer is provided, combine it with the BigInt replacer
  const combinedReplacer = replacer 
    ? (key, val) => {
        const bigIntProcessed = bigIntReplacer(key, val);
        return replacer(key, bigIntProcessed);
      }
    : bigIntReplacer;

  return JSON.stringify(value, combinedReplacer, space);
};

/**
 * Safe JSON.parse that handles BigInt values (converts "123n" strings back to BigInt)
 * @param {string} text - The JSON string to parse
 * @param {function} reviver - Optional reviver function
 * @returns {any} Parsed object with BigInt values restored
 */
export const safeParse = (text, reviver = null) => {
  const bigIntReviver = (key, value) => {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  };

  // If a custom reviver is provided, combine it with the BigInt reviver
  const combinedReviver = reviver
    ? (key, val) => {
        const bigIntProcessed = bigIntReviver(key, val);
        return reviver(key, bigIntProcessed);
      }
    : bigIntReviver;

  return JSON.parse(text, combinedReviver);
};