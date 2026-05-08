const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class APIError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail);
    this.name = "APIError";
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new APIError(response.status, data.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  tier: "free" | "pro";
  monthly_rewrite_count: number;
  onboarding_completed: boolean;
}

export interface Subscription {
  tier: "free" | "pro";
  status: "active" | "inactive" | "canceled";
  current_period_end: string | null;
}

export interface Annotation {
  original: string;
  rewritten: string;
  reason: string;
}

export interface RewriteResponse {
  id: string;
  original_text: string;
  rewritten_text: string;
  annotations: Annotation[];
  context_type: string;
  created_at: string;
}

export interface RewriteHistory {
  id: string;
  context_type: string;
  original_text: string;
  created_at: string;
}

export async function registerUser(
  email: string,
  password: string,
  display_name: string
): Promise<{ user_id: string; email: string }> {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, display_name }),
  });
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user_id: string; email: string }> {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser(): Promise<void> {
  await apiFetch("/api/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiFetch<User>("/api/auth/me");
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function getSubscription(): Promise<Subscription> {
  return apiFetch("/api/auth/subscription");
}

export async function submitRewrite(
  text: string,
  context_type: string
): Promise<RewriteResponse> {
  return apiFetch("/api/rewrite", {
    method: "POST",
    body: JSON.stringify({ text, context_type }),
  });
}

export async function getRewriteHistory(): Promise<RewriteHistory[]> {
  return apiFetch("/api/rewrites");
}

export async function getRewriteDetail(rewrite_id: string): Promise<RewriteResponse> {
  return apiFetch(`/api/rewrites/${rewrite_id}`);
}

export async function getAPIKeyStatus(): Promise<{ has_key: boolean; masked_key: string }> {
  return apiFetch("/api/settings/api-key");
}

export async function saveAPIKey(api_key: string): Promise<{ message: string; masked_key: string }> {
  return apiFetch("/api/settings/api-key", {
    method: "POST",
    body: JSON.stringify({ api_key }),
  });
}

export async function createCheckoutSession(
  billing_interval: "month" | "year"
): Promise<{ checkout_url: string }> {
  return apiFetch("/api/payments/create-checkout", {
    method: "POST",
    body: JSON.stringify({ billing_interval }),
  });
}

export async function createPortalSession(): Promise<{ portal_url: string }> {
  return apiFetch("/api/payments/portal", {
    method: "POST",
  });
}

export async function completeOnboarding(): Promise<{ message: string }> {
  return apiFetch("/api/onboarding/complete", {
    method: "POST",
  });
}
