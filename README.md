# babel-plugin-safe-math

A little babel plugin made for my friend [@zh99998](https://github.com/zh99998) who always complains about the wake type system of JavaScript causing mystery bugs in her projects.

## before

``` js
const a = 1;
const b = 0;
const c = a / b; // NaN
```

## after

``` js
function safeMath(value, disallowZero, message) {
  if (typeof value !== "number" || Number.isNaN(value) || disallowZero && value === 0) throw new TypeError(message + ": " + JSON.stringify(value));
  return value;
}

const a = 1;
const b = 0;
const c = safeMath(a, false, "the dividend is invalid") / safeMath(b, true, "the divider is invalid"); // TypeError: the divider is invalid: 0
```
