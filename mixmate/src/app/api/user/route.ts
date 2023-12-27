// // POST /api/user.js
// import * as cfg from "../../database/config";
// import * as dbRtns from "../../database/db_routines.js";
 
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  // Accessing query parameters (since GET requests don't usually have a body)
  const query = req.nextUrl.searchParams.get('param1');
  console.log(query);

  let response = NextResponse
  return response.json({ message: 'Received query:'})
  
}

export async function POST(req: NextRequest, res: NextResponse) {
  // Accessing the request body
  const body = req.body;
  return NextResponse.json({ message: 'Received body:', body });
}
