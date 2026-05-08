"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../_components/AuthContext";
import { getRewriteHistory, getRewriteDetail, RewriteHistory, RewriteResponse } from "../_lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [history, setHistory] = useState<RewriteHistory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<RewriteResponse | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/apps/nativevoice/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const data = await getRewriteHistory();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    }
  };

  const handleViewDetail = async (id: string) => {
    setFetching(true);
    setError("");
    try {
      const detail = await getRewriteDetail(id);
      setSelectedDetail(detail);
      setSelectedId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load detail");
    } finally {
      setFetching(false);
    }
  };

  const CONTEXT_LABELS: Record<string, string> = {
    manager: "Message to my manager",
    linkedin: "LinkedIn post",
    job_application: "Job application email",
    slack: "Peer Slack message",
    performance: "Performance review",
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
        {selectedDetail ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Rewrite Detail</h1>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDetail(null);
                  setSelectedId(null);
                }}
              >
                Back to History
              </Button>
            </div>

            <div className="border rounded-lg p-6 bg-card space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Context</h3>
                <p className="text-sm">{CONTEXT_LABELS[selectedDetail.context_type] || selectedDetail.context_type}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Date</h3>
                <p className="text-sm">
                  {new Date(selectedDetail.created_at).toLocaleString()}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Original
                  </h4>
                  <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                    {selectedDetail.original_text}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Rewritten
                  </h4>
                  <p className="text-sm whitespace-pre-wrap bg-green-50 p-3 rounded text-green-900">
                    {selectedDetail.rewritten_text}
                  </p>
                </div>
              </div>

              {selectedDetail.annotations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Why We Made These Changes</h4>
                  <div className="space-y-3">
                    {selectedDetail.annotations.map((ann, i) => (
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
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Rewrite History</h1>
            <p className="text-sm text-muted-foreground">
              Your last 10 rewrites. Click on any to view the full diff.
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">
                {error}
              </div>
            )}

            {history.length === 0 ? (
              <div className="border rounded-lg p-6 text-center">
                <p className="text-muted-foreground">No rewrites yet. Start by creating one!</p>
                <Link href="/apps/nativevoice">
                  <Button className="mt-4">Go to Rewriter</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleViewDetail(item.id)}
                    disabled={fetching && selectedId === item.id}
                    className="w-full text-left border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          {CONTEXT_LABELS[item.context_type] || item.context_type}
                        </p>
                        <p className="text-sm line-clamp-2">
                          {item.original_text}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
