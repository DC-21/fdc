export function unStringfy(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
