function safeMath(value, disallowZero, message) {
  if (typeof value !== "number" || Number.isNaN(value) || disallowZero && value === 0) throw new TypeError(message + ": " + JSON.stringify(value));
  return value;
}

const a = 1;
const b = 2;
const c = 3;
const d = safeMath(safeMath(a, false, "the dividend is invalid") / safeMath(b, true, "the divider is invalid"), false, "the dividend is invalid") / safeMath(c, true, "the divider is invalid");
