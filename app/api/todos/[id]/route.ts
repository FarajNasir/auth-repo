import { supabaseServer } from '@/lib/server';

import { NextResponse } from "next/server";

// update api 
export async function PATCH(req:Request,{params}:{params: Promise<{ id: string }>}){
    const { id } = await params
    const supabase=await supabaseServer()
    const body=await req.json()
    const {
        data:{user},
    }=await supabase.auth.getUser()

    if(!user){
        return NextResponse.json(
            {error:"Unauthorizes"},
            {status:401},
        )
    }
     const { error } = await supabase
    .from("todos")
    .update(body)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Todo updated" });
}

// delete todo
export async function DELETE(req:Request,{params}:{params: Promise<{ id: string }>}){
     const { id } = await params
    const supabase=await supabaseServer();

    const {data:{user}}=await supabase.auth.getUser()
    if(!user){
        return NextResponse.json({error:"Unauthorized"},{status:401})
    }

    const {error}=await supabase
    .from("todos")
    .delete()
    .eq("id",id)
    if(error){
        return NextResponse.json(
            {error:error.message},
            {status:400}
        )}
        return NextResponse.json(
            {message:"Todo deleted "},
        )
    }
