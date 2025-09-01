const { writeFileSync } = require("fs");
const { join } = require("path");

const pinkRamp = {
  50: "#fff1f6",
  100: "#ffd6e5",
  200: "#ffb9d4",
  300: "#ff9bc3",
  400: "#ff78b4",
  500: "#ff4ba4",
  600: "#e10087",
  700: "#a20060",
  800: "#650039",
  900: "#33001b",
  950: "#1e0010",
};

const neutralRamp = {
  0: { 100: "#fff", 80: "rgba(255, 255, 255, 0.8)" },
  400: "#b8b4b6",
  600: "#8e898a",
  1000: { 100: "#000", 80: "rgba(0, 0, 0, 0.8)" },
};

const RAMPS = {
  pink: pinkRamp,
  neutral: neutralRamp,
};

// flip ramps for dark mode automatically
const flipRampForDarkMode = (rampName, ramp) => {
  const newRamp = {};
  Object.entries(ramp).forEach(([key, value]) => {
    newKey = 1000 - parseInt(key);
    if (!ramp[newKey]) {
      throw `missing color ${rampName}-${newKey} for dark mode`;
    }
    newRamp[newKey] = value;
  });
  return newRamp;
};

function toCssVars(obj, rampName) {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === "object") {
        return Object.entries(value)
          .map(([shade, color]) => {
            const name =
              shade == 100
                ? `${rampName}-${key}`
                : `${rampName}-${key}-A${shade}`;
            return `  --${name}: ${color};`;
          })
          .join("\n");
      }
      return `  --${rampName}-${key}: ${value};`;
    })
    .join("\n");
}

const cssVars = `
:root {
${Object.entries(RAMPS)
  .map(([rampName, rampObj]) => toCssVars(rampObj, rampName))
  .join("\n")}
}
`;

const darkModeCssVars = `
:root.dark-mode {
${Object.entries(RAMPS)
  .map(([rampName, rampObj]) =>
    toCssVars(flipRampForDarkMode(rampName, rampObj), rampName)
  )
  .join("\n")}
}
`;

const file = darkModeCssVars + cssVars;

const outPath = join(__dirname, "../static/css/colors.css");
writeFileSync(outPath, file);
console.log("colors.css generated at", outPath);
