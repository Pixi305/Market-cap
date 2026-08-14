import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Raw body needed for webhook signature verification
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const userId = sub.metadata?.supabase_user_id;

      if (!userId) {
        // Fall back to looking up user by stripe_customer_id in profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();
        if (!profile) break;

        await supabase
          .from("subscriptions")
          .update({
            plan: sub.status === "active" ? "pro" : "free",
            status: sub.status,
            stripe_customer_id: customerId,
            stripe_subscription_id: sub.id,
            current_period_end: new Date((sub as { current_period_end?: number }).current_period_end! * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", profile.id);
        break;
      }

      await supabase
        .from("subscriptions")
        .update({
          plan: sub.status === "active" ? "pro" : "free",
          status: sub.status,
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          current_period_end: new Date((sub as { current_period_end?: number }).current_period_end! * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!profile) break;

      await supabase
        .from("subscriptions")
        .update({
          plan: "free",
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
