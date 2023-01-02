export const convertObjectWithDates = (obj: any) => {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Date) {
      result[key] = result[key].toISOString();
    } else if (typeof result[key] === "object") {
      result[key] = convertObjectWithDates(result[key]);
    }
  });
  return result;
};
