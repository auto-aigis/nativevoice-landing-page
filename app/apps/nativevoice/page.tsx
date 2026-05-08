"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./_components/AuthContext";
import {
  submitRewrite,
  completeOnboarding,
  APIError,
  RewriteResponse,
} from "./_lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, LogOut, Settings, BarChart3 } from "lucide-react";

const CONTEXT_OPTIONS = [
  { value: "manager", label: "Message to my manager" },
  { value: "linkedin", label: "LinkedIn post" },
  { value: "job_application", label: "Job application email" },
  { value: "slack", label: "Peer Slack message" },
  { value: "performance", label: "Performance review" },
];

interface TooltipStep {
  id: string;
  title: string;
  description: string;
  elementId: string;
}

const TOOLTIP_STEPS: TooltipStep[] = [
  {
    id: "paste-area",
    title: "Paste your text here",
    description: "Share any professional communication you want to rewrite — up to 2,000 characters",
    elementId: "text-input",
  },
  {
    id: "context-selector",
    title: "Choose your context",
    description: "Select the type of communication to get the best rewrite for that setting",
    elementId: "context-select",
  },
  {
    id: "submit-button",
    title: "Click to rewrite",
    description: "Our AI will rewrite your text with cultural and tone improvements",
    elementId: "submit-button",
  },
  {
    id: "diff-view",
    title: "Compare and learn",
    description: "See side-by-side changes with explanations for each modification",
    elementId: "diff-view",
  },
];

function Tooltip({
  step,
  onClose,
  onNext,
  isLast,
}: {
  step: TooltipStep;
  onClose: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const el = document.getElementById(step.elementId);
    setElement(el);
    if (el) {
      const rect = el.getBoundingClientRect();
      setPos({
        top: rect.bottom + 10,
        left: Math.max(10, rect.left),
      });
    }
  }, [step]);

  if (!element) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 pointer-events-none" />
      <div
        className="fixed bg-white rounded-lg shadow-lg p-4 z-50 max-w-xs pointer-events-auto"
        style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
      >
        <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Skip
          </Button>
          <Button size="sm" onClick={onNext}>
            {isLast ? "Got it!" : "Next"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rewrite, setRewrite] = useState<RewriteResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [tooltipStep, setTooltipStep] = useState<number | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/apps/nativevoice/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !user.onboarding_completed && tooltipStep === null) {
      setTooltipStep(0);
    }
  }, [user]);

  const handleTooltipNext = async () => {
    if (tooltipStep === null || tooltipStep >= TOOLTIP_STEPS.length - 1) {
      await completeOnboarding();
      setTooltipStep(null);
    } else {
      setTooltipStep(tooltipStep + 1);
    }
  };

  const handleTooltipClose = async () => {
    await completeOnboarding();
    setTooltipStep(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !context) {
      setError("Please enter text and select a context");
      return;
    }

    if (text.length > 2000) {
      setError("Text must be under 2,000 characters");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await submitRewrite(text, context);
      setRewrite(result);
      setTooltipStep(3);
    } catch (err) {
      if (err instanceof APIError && err.status === 429) {
        setShowPaywall(true);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to rewrite text"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    if (rewrite?.rewritten_text) {
      await navigator.clipboard.writeText(rewrite.rewritten_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">NativeVoice</h1>
          <div className="flex items-center gap-2">
            {user.tier === "pro" && (
              <span className="text-xs font-semibold px-2 py-1 bg-primary text-primary-foreground rounded">
                PRO
              </span>
            )}
            {user.tier === "free" && (
              <span className="text-xs text-muted-foreground">
                {user.monthly_rewrite_count} of 5 rewrites used
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/apps/nativevoice/dashboard")}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/apps/nativevoice/settings")}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                router.push("/apps/nativevoice/login");
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {showPaywall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h2 className="text-lg font-bold mb-2">Upgrade to Pro</h2>
              <p className="text-sm text-muted-foreground mb-4">
                You've used all 5 rewrites this month. Upgrade to Pro for unlimited rewrites!
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPaywall(false)}
                >
                  Maybe later
                </Button>
                <Button
                  onClick={() => {
                    router.push("/apps/nativevoice/pricing");
                  }}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        )}

        {tooltipStep !== null && (
          <Tooltip
            step={TOOLTIP_STEPS[tooltipStep]}
            onClose={handleTooltipClose}
            onNext={handleTooltipNext}
            isLast={tooltipStep === TOOLTIP_STEPS.length - 1}
          />
        )}

        <div className="grid gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Rewrite Your Text</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Your Text</label>
                <Textarea
                  id="text-input"
                  ref={textInputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste any professional communication you'd like to rewrite..."
                  className="mt-2 min-h-32"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {text.length} / 2,000 characters
                </p>
              </div>

              <div>
                <label htmlFor="context-select" className="text-sm font-medium">
                  Communication Context
                </label>
                <Select value={context} onValueChange={setContext}>
                  <SelectTrigger id="context-select" className="mt-2">
                    <SelectValue placeholder="Select context..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTEXT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">
                  {error}
                </div>
              )}

              <Button
                id="submit-button"
                type="submit"
                disabled={submitting || !text.trim() || !context}
                className="w-full"
              >
                {submitting ? "Rewriting..." : "Rewrite Text"}
              </Button>
            </form>
          </div>

          {rewrite && (
            <div
              id="diff-view"
              className="border rounded-lg p-6 bg-card"
            >
              <h3 className="text-lg font-bold mb-4">Your Rewritten Text</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Original
                  </h4>
                  <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                    {rewrite.original_text}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Rewritten
                  </h4>
                  <p className="text-sm whitespace-pre-wrap bg-green-50 p-3 rounded text-green-900">
                    {rewrite.rewritten_text}
                  </p>
                </div>
              </div>

              {rewrite.annotations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3">Why We Made These Changes</h4>
                  <div className="space-y-3">
                    {rewrite.annotations.map((ann, i) => (
                      <div key={i} className="border-l-2 border-blue-500 pl-3">
                        <p className="text-xs font-mono bg-blue-50 p-2 rounded mb-1">
                          "{ann.original}" → "{ann.rewritten}"
                        </p>
                        <p className="text-xs text-muted-foreground">{ann.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={copyToClipboard}
                className="w-full"
                variant="outline"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Rewritten Text
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
