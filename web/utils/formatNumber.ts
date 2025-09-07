/**
 * Formats a number with optional abbreviation.
 * @param num The number to format
 * @param useAbbreviation Whether to use abbreviation (e.g., 1K, 1M, 1B)
 * @returns The formatted number as a string
 */
const formatNumber = (num: number, useAbbreviation: boolean = true) => {
  if (!useAbbreviation) {
    return num.toLocaleString();
  }

  if (num >= 1000000000) {
    const value = num / 1000000000;
    return value % 1 === 0
      ? `${Math.floor(value)}B`
      : `${Math.round(value * 10) / 10}B`;
  }
  if (num >= 1000000) {
    const value = num / 1000000;
    return value % 1 === 0
      ? `${Math.floor(value)}M`
      : `${Math.round(value * 10) / 10}M`;
  }
  if (num >= 1000) {
    const value = num / 1000;
    return value % 1 === 0
      ? `${Math.floor(value)}K`
      : `${Math.round(value * 10) / 10}K`;
  }
  return num.toString();
};

export default formatNumber;
