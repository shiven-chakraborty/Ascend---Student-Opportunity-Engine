import React, { useState } from "react";
import { BadgeCheck, Mail, Loader2, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { base44 } from "@/api/base44Client";

export default function VerificationPanel({ profile, onVerified }) {
  const [step, setStep] = useState("idle"); // idle | sending | otp | verifying | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (profile.verified) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-2xl p-4">
          <BadgeCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">You're a verified student ✓</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Verified via college email · {profile.verificationEmail || "—"}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Your verified badge builds trust with opportunity providers and improves your match visibility. You cannot lose this badge unless your college email changes.
        </p>
      </div>
    );
  }

  const sendCode = async () => {
    setError("");
    setStep("sending");
    try {
      const res = await base44.functions.invoke("verifyCollegeEmail", { email });
      if (res?.data?.error) throw new Error(res.data.error);
      setStep("otp");
    } catch (e) {
      setError(e?.response?.data?.error || e?.data?.error || e?.message || "Failed to send code");
      setStep("idle");
    }
  };

  const confirm = async () => {
    setError("");
    setStep("verifying");
    try {
      const res = await base44.functions.invoke("confirmCollegeOtp", { email, otp });
      if (res?.data?.verified) {
        await onVerified({ verified: true, verificationMethod: "college_email", verificationEmail: email });
        setStep("done");
      } else {
        throw new Error(res?.data?.error || "Invalid code");
      }
    } catch (e) {
      setError(e?.response?.data?.error || e?.data?.error || e?.message || "Verification failed");
      setStep("otp");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-2xl p-4">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-amber-800 dark:text-amber-300">Not verified yet</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            Verify with your college-issued email to earn the verified badge. You can't claim it manually.
          </p>
        </div>
      </div>

      {step !== "otp" ? (
        <div className="space-y-3">
          <div>
            <Label className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> College-issued email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu / .ac.in"
              className="mt-1.5"
              disabled={step === "sending"}
            />
            <p className="text-[11px] text-muted-foreground mt-1">We'll send a 6-digit code to this email to confirm it's yours.</p>
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <Button onClick={sendCode} disabled={step === "sending" || !email.trim()} className="w-full sm:w-auto">
            {step === "sending" ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending code…</> : <><Mail className="w-4 h-4 mr-2" /> Send verification code</>}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <Label>Enter the 6-digit code sent to {email}</Label>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} className="mt-2">
              <InputOTPGroup>
                {[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <div className="flex items-center gap-2">
            <Button onClick={confirm} disabled={step === "verifying" || otp.length < 6}>
              {step === "verifying" ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying…</> : "Verify"}
            </Button>
            <Button variant="ghost" onClick={() => { setStep("idle"); setOtp(""); setError(""); }}>Use a different email</Button>
          </div>
        </div>
      )}
    </div>
  );
}