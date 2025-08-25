exports.formatGrams = (grams) => {
  if (grams < 1000) {
    return `${grams} g`;
  }
  const kilos = grams / 1000;
  return `${kilos.toFixed(1)} kg`;
};

exports.formatTimeHtml = (timestamp) => {
  const date = new Date(timestamp);
  return /* HTML */ `<time
    title="${date.toLocaleString()}"
    datetime="${date.toISOString()}"
    >${exports.formatTime(timestamp)}
  </time>`;
};

exports.formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    seconds: undefined,
  });
};
