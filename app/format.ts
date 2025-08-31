export const formatGrams = (grams: number) => {
  if (grams < 1000) {
    return `${grams} g`;
  }
  const kilos = grams / 1000;
  return `${kilos.toFixed(1)} kg`;
};

export const formatTimeHtml = (
  timestamp: number,
  relative: boolean = false
) => {
  const date = new Date(timestamp);
  return /* HTML */ `<time
    title="${date.toLocaleString()}"
    datetime="${date.toISOString()}"
    >${formatTime(timestamp, relative)}
  </time>`;
};

export const formatTime = (timestamp: number, relative: boolean = false) => {
  const date = new Date(timestamp);
  if (!relative) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: undefined,
    });
  }

  return [
    date.getUTCHours() > 0 ? date.getUTCHours() : "0",
    date.getUTCMinutes().toString().padStart(2, "0"),
    date.getUTCSeconds().toString().padStart(2, "0"),
  ].join(":");
};
