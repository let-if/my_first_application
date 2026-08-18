// mobile/src/utils/phone.ts
export function normalizeEthiopianPhone(input: string): string | null {
  const cleaned = input.replace(/[\s\-\(\)]/g, "");

  // Match +251 9/7..., 251 9/7..., 09/07..., or 9/7...
  const ethioRegex = /^(?:\+251|251|0)?([79]\d{8})$/;
  const match = cleaned.match(ethioRegex);

  if (!match) {
    return null;
  }

  // Return standard E.164 format for Ethiopia
  return `+251${match[1]}`;
}

export function formatEthiopianPhoneDisplay(input: string): string {
  const normalized = normalizeEthiopianPhone(input);
  if (!normalized) return input;
  // +251 91 234 5678
  return `${normalized.slice(0, 4)} ${normalized.slice(4, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9)}`;
}