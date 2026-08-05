export interface CreditPack {
  id: string;
  credits: number;
  priceAmountCents: number;
  label: string;
  description: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "starter",
    credits: 100,
    priceAmountCents: 800,
    label: "Starter",
    description: "~100 AI recipe generations or 10 meal plans",
  },
  {
    id: "popular",
    credits: 300,
    priceAmountCents: 2000,
    label: "Popular",
    description: "~300 AI recipe generations or 30 meal plans",
    popular: true,
  },
  {
    id: "pro",
    credits: 1000,
    priceAmountCents: 5500,
    label: "Pro",
    description: "~1000 AI recipe generations or 100 meal plans",
  },
];

export const findCreditPack = (id: string): CreditPack | undefined =>
  CREDIT_PACKS.find((pack) => pack.id === id);
