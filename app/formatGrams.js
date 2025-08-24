exports.formatGrams = (grams) => {
  if (grams < 1000) {
    return `${grams} g`;
  }
  const kilos = grams / 1000;
  return `${kilos.toFixed(1)} kg`;
};
