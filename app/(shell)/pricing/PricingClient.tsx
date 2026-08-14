"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

const FREE_FEATURES = [
  "Search any stock or ETF",
  "Live & delayed price quotes",
  "Price charts (1D / 1W / 1M / 1Y)",
  "Company profiles & key stats",
  "Financial news feed",
  "Save up to 3 stocks to your watchlist",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Unlimited watchlist items (free = 3)",
  "Portfolio tracking & live value",
  "Priority support",
];

export default function PricingClient() {
  const router = useRouter();
  const params = useSearchParams();
  const success = params.get("success") === "true";
  const canceled = params.get("canceled") === "true";

  const { isPro, isAuthenticated, plan, isLoading } = useSubscription();
  const queryClient = useQueryClient();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // On success redirect: verify session with Stripe and upgrade plan in DB
  useEffect(() => {
    const sessionId = params.get("session_id");
    if (success && sessionId) {
      fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["subscription"] });
      });
    }
  }, [success, params, queryClient]);

  // Clear query params after 5s
  useEffect(() => {
    if (success || canceled) {
      const t = setTimeout(() => router.replace("/pricing"), 5000);
      return () => clearTimeout(t);
    }
  }, [success, canceled, router]);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirectTo=/pricing");
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setCheckoutLoading(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/customer-portal", { method: "POST" });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setPortalLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Status banners */}
      {success && (
        <div className="mb-6 rounded-xl bg-success-50 border border-success-200 px-4 py-3 text-sm font-medium text-success-700">
          Payment successful — welcome to Marketcap Pro! Your watchlist is now unlocked.
        </div>
      )}
      {canceled && (
        <div className="mb-6 rounded-xl bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm text-neutral-600">
          Checkout canceled. No charge was made.
        </div>
      )}

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Simple, transparent pricing</h1>
        <p className="mt-2 text-neutral-500">
          Start free. Upgrade when you&apos;re ready to build your watchlist.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Free plan */}
        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-7">
          <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-neutral-400">Free</div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold text-neutral-900">$0</span>
            <span className="mb-1 text-neutral-400">/mo</span>
          </div>
          <p className="mt-2 text-sm text-neutral-500">Browse markets. No credit card needed.</p>

          <ul className="mt-6 flex-1 space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-neutral-700">
                <Check size={16} className="mt-0.5 shrink-0 text-neutral-400" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {!isLoading && plan === "free" ? (
              <div className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2.5 text-center text-sm font-medium text-neutral-500">
                Current plan
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="w-full rounded-full border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Get started free
              </button>
            )}
          </div>
        </div>

        {/* Pro plan */}
        <div className="relative flex flex-col rounded-2xl border-2 border-brand-500 bg-white p-7">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
              <Zap size={11} fill="currentColor" />
              Most popular
            </span>
          </div>

          <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-brand-600">Pro</div>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold text-neutral-900">$15</span>
            <span className="mb-1 text-neutral-400">/mo</span>
          </div>
          <p className="mt-2 text-sm text-neutral-500">Full access — save stocks and track your portfolio.</p>

          <ul className="mt-6 flex-1 space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-neutral-700">
                <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            {!isLoading && isPro ? (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="w-full rounded-full bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
              >
                {portalLoading ? "Loading…" : "Manage subscription"}
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={checkoutLoading || isLoading}
                className="w-full rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
              >
                {checkoutLoading
                  ? "Redirecting to Stripe…"
                  : isAuthenticated
                    ? "Upgrade to Pro"
                    : "Sign up and upgrade"}
              </button>
            )}
          </div>

          {!isPro && (
            <p className="mt-3 text-center text-xs text-neutral-400">
              Test card: 4242 4242 4242 4242 · any future date · any CVC
            </p>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 border-t border-neutral-100 pt-8">
        <h2 className="mb-4 text-sm font-semibold text-neutral-500 uppercase tracking-wide">FAQ</h2>
        <div className="space-y-4">
          {[
            ["Can I cancel any time?", "Yes. Cancel from the Stripe billing portal — access continues until the end of your billing period."],
            ["Is my payment info secure?", "All payments are handled by Stripe. We never see or store your card details."],
            ["What happens to my watchlist if I downgrade?", "Your saved stocks stay in the database — you just won't be able to add more once you're over the 3-stock free limit."],
          ].map(([q, a]) => (
            <div key={q}>
              <p className="text-sm font-medium text-neutral-900">{q}</p>
              <p className="mt-1 text-sm text-neutral-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
