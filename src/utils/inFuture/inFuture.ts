export function inFuture(amount: number, unit: "hr" | "day"): Date {
  const result = new Date();

  switch (unit) {
    case "hr":
      result.setHours(result.getHours() + amount);
      break;
    case "day":
      result.setDate(result.getDate() + amount);
      break;
    default:
      throw new Error("Invalid unit. Use 'hr' for hours or 'day' for days.");
  }

  return result;
}
