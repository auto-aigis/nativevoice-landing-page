"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../_components/AuthContext";
import { createCheckoutSession, getSubscription } from "../_lib/api";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");
  const [currentTier, setCurrentTier] = useState<"free" | "pro">("free");
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/apps/nativevoice/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setCurrentTier(user.tier);
    }
  }, [user]);

  const handleCheckout = async (period: "month" | "year") => {
    setLoading2(true);
    setError("");
    try {
      const { checkout_url } = await createCheckoutSession(period);
      window.location.href = checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setLoading2(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link href="/apps/nativevoice" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Rewriter
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground">
            Start free. Upgrade anytime to unlock unlimited rewrites.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingPeriod("month")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              billingPeriod === "month"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("year")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              billingPeriod === "year"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            Annual <span className="text-xs ml-1">(Save 25%)</span>
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-8 bg-card">
            <h2 className="text-xl font-bold mb-2">Free</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Perfect for getting started
            </p>
            <div className="text-3xl font-bold mb-6">
              $0<span className="text-lg text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm">5 rewrites per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm">All 5 context templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm">Rewrite history</span>
              </li>
            </ul>
            <Button
              disabled={currentTier === "free"}
              variant="outline"
              className="w-full"
            >
              {currentTier === "free" ? "Current Plan" : "Downgrade"}
            </Button>
          </div>

          <div className="border-2 border-primary rounded-lg p-8 bg-card relative">
            <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded">
              MOST POPULAR
            </div>
            <h2 className="text-xl font-bold mb-2">Pro</h2>
            <p className="text-sm text-muted-foreground mb-6">
              For serious learners
            </p>
            <div className="text-3xl font-bold mb-6">
              {billingPeriod === "month" ? (
                <>
                  $10<span className="text-lg text-muted-foreground">/month</span>
                </>
              ) : (
                <>
                  $90<span className="text-lg text-muted-foreground">/year</span>
                </>
              )}
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm">Unlimited rewrites</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm">All 5 context templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm">Full rewrite history</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            <Button
              disabled={loading2 || currentTier === "pro"}
              onClick={() => handleCheckout(billingPeriod)}
              className="w-full"
            >
              {loading2
                ? "Processing..."
                : currentTier === "pro"
                  ? "Current Plan"
                  : "Get Pro"}
            </Button>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center">
          <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            <div>
              <h4 className="font-semibold text-sm mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, cancel your subscription anytime from your settings. No questions asked.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Do I keep my history?</h4>
              <p className="text-sm text-muted-foreground">
                Your rewrite history is saved forever, regardless of your subscription status.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">How do rewrites work?</h4>
              <p className="text-sm text-muted-foreground">
                We use GPT-4o to rewrite your text with cultural and tone improvements for natural fluency.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Is my data private?</h4>
              <p className="text-sm text-muted-foreground">
                Your texts are encrypted and used only for rewrites. We never share your data.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
