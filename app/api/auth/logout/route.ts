import {NextRequest, NextResponse} from "next/server"
import {supabaseServer} from "@/lib/server"

export async function POST(){
    const supabse=await supabaseServer()

    const {error}=await supabse.auth.signOut();
    if(error){
       return NextResponse.json(
         {error:error.message},
        {status:400}
       )
    }

    return NextResponse.json(
        {message:"Logout successfull"}
    )
}