import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/server";

export async function POST(req:Request){
    const {email,password}=await req.json()
    const supabse=await supabaseServer()

    // login 
    const {data,error}=await supabse.auth.signInWithPassword({
        email,
        password
    });

    if(error){
        return NextResponse.json(
            {error:error.message},
            {status:401}
        )
    }

    const user=data.user
    const session=data.session

    if(!user || !session){
        return NextResponse.json(
            {error:"Invalid login"},
            {status:401}
        )
    }

    return NextResponse.json({
        message:"login successful",
        user,
        session
    })
}