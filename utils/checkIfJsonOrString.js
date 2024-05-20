export function processInput(value) {
  if (value !== undefined) {
    if (typeof owner === "string") {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error("Invalid JSON string:", value);
        return null;
      }
    } else {
      return value;
    }
  }
  return null;
}
