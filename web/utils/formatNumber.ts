const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}k`;
  }
  if (num >= 1000000) {
    return `${Math.floor(num / 1000000)}m`;
  }
  if (num >= 1000000000) {
    return `${Math.floor(num / 1000000000)}b`;
  }
  return num.toString();
};

export default formatNumber;
