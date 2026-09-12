import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const email = (body.email || "").toString().trim().toLowerCase();
    const otp = (body.otp || "").toString().trim();
    if (!email || !otp) return Response.json({ error: "Email and code are required" }, { status: 400 });

    const requests = await base44.entities.VerificationRequest.filter({ email }, "-created_date", 10);
    const now = Date.now();
    const match = requests.find((r) => r.otp === otp && !r.verified && r.expires > now);

    if (!match) {
      return Response.json({ verified: false, error: "Invalid or expired code. Please try again." }, { status: 400 });
    }

    await base44.entities.VerificationRequest.update(match.id, { verified: true });
    return Response.json({ verified: true, email });
  } catch (error) {
    return Response.json({ error: error.message || "Failed to verify code" }, { status: 500 });
  }
}