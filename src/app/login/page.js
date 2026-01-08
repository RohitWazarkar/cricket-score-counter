"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  async function sendOtp() {
    await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email })
    });
    setStep(2);
  }

  async function verifyOtp() {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    localStorage.setItem("token", data.token);
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-4">
        <h2 className="text-xl font-bold text-black text-center">Login</h2>

        {step === 1 && (
          <>
            <input
              className="w-full border p-2 text-black"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button onClick={sendOtp} className="btn w-full">
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              className="w-full border p-2 text-black"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp} className="btn w-full">
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
}
