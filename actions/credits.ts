"use server";
import { createClient } from "@/utils/supabase/server";
import { getPolar } from "@/utils/polar";
import { findCreditPack } from "@/constants/creditPacks";

export const getCredits = async (): Promise<number | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("get_credits");
  if (error) {
    console.error("get_credits error:", error);
    return null;
  }

  return data as number;
};

export const spendCredits = async (
  amount: number,
): Promise<{ success: boolean; balance: number | null; error?: string }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      balance: null,
      error: "Please log in to use AI features.",
    };
  }

  const { data, error } = await supabase.rpc("use_credit", {
    _amount: amount,
  });

  if (error) {
    console.error("use_credit error:", error);
    return {
      success: false,
      balance: null,
      error:
        error.message?.includes("Insufficient credits")
          ? "Not enough credits for this generation."
          : "Unable to spend credits. Please try again.",
    };
  }

  return { success: true, balance: data as number };
};

export const createCreditCheckout = async (
  packId: string,
): Promise<{ success: boolean; url?: string; error?: string }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please log in to buy credits." };
  }

  const pack = findCreditPack(packId);
  if (!pack) {
    return { success: false, error: "Invalid credit pack." };
  }

  const productId = process.env.POLAR_PRODUCT_ID;
  const polar = getPolar();
  if (!productId || !polar) {
    return {
      success: false,
      error: "Credit purchases are not configured yet.",
    };
  }

  try {
    const checkout = await polar.checkouts.create({
      products: [productId],
      prices: {
        [productId]: [
          {
            amountType: "fixed",
            priceAmount: pack.priceAmountCents,
            priceCurrency: "usd",
          },
        ],
      },
      metadata: {
        user_id: user.id,
        credits: pack.credits,
      },
      customerEmail: user.email ?? undefined,
      successUrl: `${process.env.NEXT_PUBLIC_URL}/credits?status=success&checkout_id={CHECKOUT_ID}`,
      allowDiscountCodes: false,
    });

    return { success: true, url: checkout.url };
  } catch (error: any) {
    console.error("createCreditCheckout error:", error);
    return {
      success: false,
      error: error?.message || "Failed to create checkout.",
    };
  }
};
