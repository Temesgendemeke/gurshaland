import { Polar } from "@polar-sh/sdk";

export function getPolar(): Polar | null {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) return null;

  return new Polar({
    accessToken,
    server:
      process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
  });
}
