import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
 
     // Set the 'token' cookie to a past date, effectively removing it
    const cookie = 'token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';

    return NextResponse.json(null, {
        status: 200,
        headers: {
            'Set-Cookie': cookie
        }
    });


}