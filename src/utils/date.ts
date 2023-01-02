export const convertObjectWithDates = (obj: any) => {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Date) {
      result[key] = result[key].toISOString();
    } else if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) => {
        if (item instanceof Date) {
          return item.toISOString();
        } else if (typeof item === "object") {
          return convertObjectWithDates(item);
        }
        return item;
      });
    } else if (typeof result[key] === "object") {
      result[key] = convertObjectWithDates(result[key]);
    }
  });
  return result;
};
