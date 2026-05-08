"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../_components/AuthContext";
import { getAPIKeyStatus, saveAPIKey, createPortalSession } from "../_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/apps/nativevoice/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadAPIKeyStatus();
    }
  }, [user]);

  const loadAPIKeyStatus = async () => {
    try {
      const status = await getAPIKeyStatus();
      setHasKey(status.has_key);
      setMaskedKey(status.masked_key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load API key status");
    }
  };

  const handleSaveAPIKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("API key cannot be empty");
      return;
    }

    setLoading2(true);
    setError("");
    setSuccess("");

    try {
      const result = await saveAPIKey(apiKey);
      setSuccess("API key saved successfully");
      setMaskedKey(result.masked_key);
      setHasKey(true);
      setApiKey("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save API key");
    } finally {
      setLoading2(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const { portal_url } = await createPortalSession();
      window.location.href = portal_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open billing portal");
      setLoadingPortal(false);
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

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <div className="space-y-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">OpenAI API Key</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your OpenAI API key to power the text rewrites. Your key is encrypted and never shared.
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSaveAPIKey} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="text-sm font-medium">
                  API Key
                </label>
                <div className="relative mt-2">
                  <Input
                    id="apiKey"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_live_..."
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get your key from{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>

              {hasKey && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                  <p>
                    Current key:{" "}
                    <code className="font-mono text-xs">{maskedKey}</code>
                  </p>
                </div>
              )}

              <Button type="submit" disabled={loading2}>
                {loading2 ? "Saving..." : "Save API Key"}
              </Button>
            </form>
          </div>

          {user.tier === "pro" && (
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Subscription</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your Pro subscription, billing address, and payment method.
              </p>
              <Button
                onClick={handleManageSubscription}
                disabled={loadingPortal}
              >
                {loadingPortal ? "Loading..." : "Manage Subscription"}
              </Button>
            </div>
          )}

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Account</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Display Name</p>
                <p className="font-medium">{user.display_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tier</p>
                <p className="font-medium capitalize">
                  {user.tier === "pro" ? "Pro" : "Free"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
