import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  const { email } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await setDoc(doc(db, "otpRequests", email), {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  // TODO: send email (nodemailer later)
  console.log("OTP:", otp);

  return Response.json({ success: true });
}
