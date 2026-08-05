"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Coins, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CREDIT_PACKS } from "@/constants/creditPacks";
import { getCredits, createCreditCheckout } from "@/actions/credits";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";

export default function CreditsPage() {
  const user = useAuth((store) => store.user);
  const searchParams = useSearchParams();
  const [credits, setCredits] = useState<number | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCredits = async () => {
    const balance = await getCredits();
    setCredits(balance);
  };

  useEffect(() => {
    if (user) loadCredits();
    else setCredits(null);
  }, [user]);

  const paidSuccessfully = searchParams.get("status") === "success";

  const handleBuy = async (packId: string) => {
    setBuying(packId);
    setError(null);
    try {
      const result = await createCreditCheckout(packId);
      if (result.success && result.url) {
        window.location.assign(result.url);
        return;
      }
      setError(result.error || "Failed to create checkout");
      toast.error(result.error || "Failed to create checkout");
    } catch (error: any) {
      const message = error?.message || "Failed to create checkout";
      setError(message);
      toast.error(message);
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-12 mt-6 md:mt-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-border mb-4">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Credit Top-Up
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold heading-primary mb-4">
            Buy More Credits
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Top up your credits to keep generating recipes (1 credit) and meal
            plans (10 credits).
          </p>
        </div>

        {paidSuccessfully && (
          <div className="mb-8 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-semibold">Payment successful!</p>
              <p className="text-success/80">
                Your credits should arrive within a few seconds. If not, the
                webhook may need a moment.
              </p>
            </div>
          </div>
        )}

        {!user ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                <a href="/login" className="font-medium text-primary underline">
                  Log in
                </a>{" "}
                to buy credits.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4">
              <Coins className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Your balance:
              </span>
              <span className="text-lg font-semibold text-foreground">
                {credits === null ? "—" : `${credits} credits`}
              </span>
            </div>

            {error && (
              <p className="mb-6 rounded-lg border border-error/20 bg-error/5 p-3 text-sm text-error">
                {error}
              </p>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              {CREDIT_PACKS.map((pack) => (
                <Card
                  key={pack.id}
                  className={`relative flex flex-col ${pack.popular ? "border-primary ring-2 ring-primary/30" : ""}`}
                >
                  {pack.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                      Most popular
                    </span>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {pack.label} Pack
                    </CardTitle>
                    <CardDescription>{pack.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4">
                    <div>
                      <span className="text-3xl font-bold">
                        ${(pack.priceAmountCents / 100).toFixed(2)}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        for {pack.credits} credits
                      </span>
                    </div>
                    <Button
                      className="mt-auto w-full"
                      onClick={() => handleBuy(pack.id)}
                      disabled={buying !== null}
                    >
                      {buying === pack.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redirecting to checkout...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Buy {pack.credits} credits
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
