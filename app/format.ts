export const formatGrams = (grams: number) => {
  if (grams < 1000) {
    return `${grams} g`;
  }
  const kilos = grams / 1000;
  return `${kilos.toFixed(1)} kg`;
};

export const formatTimeHtml = (timestamp: number) => {
  const date = new Date(timestamp);
  return /* HTML */ `<time
    title="${date.toLocaleString()}"
    datetime="${date.toISOString()}"
    >${formatTime(timestamp)}
  </time>`;
};

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: undefined,
  });
};
