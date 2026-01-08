import jwt from "jsonwebtoken";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function POST(req) {
  const { email, otp } = await req.json();
  const ref = doc(db, "otpRequests", email);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return Response.json({ error: "OTP expired" }, { status: 400 });
  }

  const data = snap.data();
  if (data.otp !== otp || Date.now() > data.expiresAt) {
    return Response.json({ error: "Invalid OTP" }, { status: 400 });
  }

  await deleteDoc(ref);

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return Response.json({ token });
}
