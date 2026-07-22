import { getServiceClient } from "./serviceClient";

export type AdminAuthResult =
  | { ok: true; email: string }
  | { ok: false; status: number; error: string };

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies a request came from a signed-in Supabase Auth user whose email is
 * on the server-only ADMIN_EMAILS allowlist. The client sends its Supabase
 * session access token as `Authorization: Bearer <token>` — this never trusts
 * a client-supplied email or role, only the token, which is checked against
 * Supabase Auth via the service-role client.
 */
export async function requireAdmin(req: Request): Promise<AdminAuthResult> {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) {
    return { ok: false, status: 401, error: "Missing bearer token." };
  }

  const service = getServiceClient();
  if (!service) {
    return { ok: false, status: 503, error: "Admin API is not configured on this server." };
  }

  const { data, error } = await service.auth.getUser(token);
  if (error || !data?.user?.email) {
    return { ok: false, status: 401, error: "Invalid or expired session." };
  }

  const email = data.user.email.toLowerCase();
  const allowed = getAdminEmails();
  if (allowed.length === 0 || !allowed.includes(email)) {
    return { ok: false, status: 403, error: "This account is not authorized as an admin." };
  }

  return { ok: true, email };
}
