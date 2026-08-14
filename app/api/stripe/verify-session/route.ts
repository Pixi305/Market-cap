import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await request.json() as { sessionId: string };
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

  // Retrieve and verify the session directly from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (session.payment_status !== "paid" || session.mode !== "subscription") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  // Confirm the session belongs to this user's customer
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (session.customer !== profile?.stripe_customer_id) {
    return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
  }

  const sub = session.subscription as { id: string; status: string; current_period_end?: number } | null;

  await supabase
    .from("subscriptions")
    .update({
      plan: "pro",
      status: "active",
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: sub?.id ?? null,
      current_period_end: sub?.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  await supabase
    .from("profiles")
    .update({ is_pro: true })
    .eq("id", user.id);

  return NextResponse.json({ plan: "pro", status: "active" });
}
