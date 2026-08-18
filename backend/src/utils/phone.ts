// export function normalizeEthiopianPhone(input: string): string | null {
//   const cleaned = input.replace(/[\s\-\(\)]/g, "");
//   const ethioRegex = /^(?:\+251|251|0)?([97]\d{8})$/;
//   const match = cleaned.match(ethioRegex);

//   if (!match) return null;
//   return `+251${match[1]}`;
// }
// backend/src/utils/phone.ts
export function normalizeEthiopianPhone(raw: string | undefined | null): string | null {
  if (!raw) return null;

  // Remove spaces, dashes, parentheses, and leading plus
  let cleaned = String(raw).replace(/[\s\-\(\)\+]/g, "").trim();

  // If starts with 2519... or 2517... (e.g. 251911100101) -> +251911100101
  if (cleaned.startsWith("251") && (cleaned.length === 12)) {
    return `+${cleaned}`;
  }

  // If starts with 09... or 07... (e.g. 0911100101) -> +251911100101
  if (cleaned.startsWith("0") && (cleaned.length === 10)) {
    return `+251${cleaned.slice(1)}`;
  }

  // If starts with 9... or 7... (9 digits: 911100101) -> +251911100101
  if ((cleaned.startsWith("9") || cleaned.startsWith("7")) && cleaned.length === 9) {
    return `+251${cleaned}`;
  }

  return null;
}