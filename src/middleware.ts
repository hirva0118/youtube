import { NextRequest, NextResponse } from "next/server";

export function middleware(request:NextRequest){
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/signin' || path === '/signup'
    const isPrivatePath = path === '/' 

    const accessToken = request.cookies.get("accessToken")?.value;

    if(accessToken && isPublicPath){
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if(!accessToken && isPrivatePath){
        return NextResponse.redirect(new URL("/signin",request.nextUrl))
    }

    return NextResponse.next();
}

export const config ={
    matcher:[
        "/","/signin","/signup"
    ]
}