import jwt from "jsonwebtoken";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = jwt.verify(token, process.env.JWT_SECRET);
  const { match, matchMeta } = await req.json();

  const matchId = Date.now().toString();

  await setDoc(
    doc(db, "users", user.email, "matches", matchId),
    {
      match,
      matchMeta,
      updatedAt: Date.now()
    }
  );


  return Response.json({ success: true });
}
