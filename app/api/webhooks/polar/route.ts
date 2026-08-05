import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    console.error("POLAR_WEBHOOK_SECRET is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const rawBody = await request.text();

  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event: any;
  try {
    event = validateEvent(rawBody, headers, secret);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return new Response("Invalid webhook signature", { status: 401 });
    }
    console.error("Invalid webhook payload:", error);
    return new Response("Invalid webhook payload", { status: 400 });
  }

  if (event.type === "order.paid") {
    const order = event.data;
    const metadata = order?.metadata ?? {};
    const userId: string | undefined = metadata?.user_id;
    const credits: number | undefined = metadata?.credits;

    if (userId && typeof credits === "number" && credits > 0) {
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      const { data, error } = await supabase.rpc("add_credits", {
        _user_id: userId,
        _amount: credits,
        _order_id: order.id,
      });

      if (error) {
        console.error("add_credits error:", error);
        return new Response("Failed to credit user", { status: 500 });
      }

      console.log(
        `order.paid: credited ${credits} credits to user ${userId} (balance ${data}, order ${order.id})`,
      );
    } else {
      console.warn(
        "order.paid without user_id/credits metadata:",
        order?.id,
        metadata,
      );
    }
  }

  return new Response("OK", { status: 200 });
}
