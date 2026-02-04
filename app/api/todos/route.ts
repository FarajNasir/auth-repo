import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/server";

/* =======================
   GET → fetch todos
======================= */
export async function GET() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ todos: data });
}

/* =======================
   POST → insert todo
======================= */
export async function POST(req: Request) {
  const { title, status, priority } = await req.json();
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("todos").insert({
    title,
    status,          // e.g. "pending"
    priority,        // e.g. "low"
    is_done: false,
    user_id: user.id,
    user_name: user.email, // ya name if stored
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Todo added" });
}
