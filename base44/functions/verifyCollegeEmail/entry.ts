import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const ACADEMIC_DOMAINS = [".edu", ".ac.in", ".edu.in", ".ac.uk", ".edu.au", ".ac.nz", ".edu.sg", ".ac.kr", ".ac.jp"];

function isAcademicEmail(email) {
  if (!email || typeof email !== "string") return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return ACADEMIC_DOMAINS.some((d) => domain.endsWith(d));
}

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const email = (body.email || "").toString().trim().toLowerCase();
    if (!email) return Response.json({ error: "Email is required" }, { status: 400 });
    if (!isAcademicEmail(email)) {
      return Response.json({ error: "Please enter a college-issued email (e.g. name@university.edu or .ac.in)" }, { status: 400 });
    }

    const otp = genOtp();
    const expires = Date.now() + 10 * 60 * 1000;

    await base44.entities.VerificationRequest.create({
      email,
      otp,
      expires,
      verified: false,
    });

    const appName = "Ascend";
    const subject = `${appName} — Your verification code`;
    const bodyText = `Hi,\n\nYour Ascend verification code is: ${otp}\n\nEnter this code in the app to verify your student status. It expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.\n\n— The Ascend team`;

    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        subject,
        body: bodyText,
      });
    } catch (sendErr) {
      return Response.json({
        error: "We couldn't send the verification email to that address. College email delivery may require a connected custom domain on a paid plan. Please try a different college email or contact support.",
      }, { status: 502 });
    }

    return Response.json({ sent: true, email });
  } catch (error) {
    return Response.json({ error: error.message || "Failed to send verification code" }, { status: 500 });
  }
}