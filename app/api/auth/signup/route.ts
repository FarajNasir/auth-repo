import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/server";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  const supabase = await supabaseServer();

  // 1) Signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user = data.user;
  console.log("user data = ",user)

  if (!user) {
    return NextResponse.json(
      { error: "User not created" },
      { status: 400 }
    );
  }

  // 2) Insert into public.users table
  const { error: insertError } = await supabase.from("users").insert({
    id: user.id,
    name,
    email,
  });

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message },
      { status: 400 }
    );
  }

   // 3️⃣ 🔥 IMPORTANT: force logout after signup
  await supabase.auth.signOut();

  return NextResponse.json({
    message: "Signup successful. Please login.",
  });
}

