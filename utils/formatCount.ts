export function formatCount(n: number | null | undefined): string {
  if (!n || n < 0) return "0";
  if (n < 1000) return String(n);
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
