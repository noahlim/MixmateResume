// import { NextResponse, NextRequest } from "next/server";
// import { jwtSecretKey } from "@/app/_utilities/_server/database/config";
// import { readRequestBody } from "@/app/_utilities/_server/util";
// import { Result } from "@/app/_utilities/_server/util";
// import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
// export async function GET(req: NextRequest, res: NextResponse) {

//     //rate limiting
//     if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
//         return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
//     }

//     const tokenCookie = req.cookies.getAll().find(cookie => cookie.name === 'token');
//     let token;
//     if (tokenCookie)
//         token = tokenCookie.value; 
//     try {
//       jwt.verify(token, jwtSecretKey) as { [key: string]: boolean };
//     } catch (error) {
//         if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
//             return NextResponse.json({ error: 'Unauthorized: Invalid or expired token.' }, { status: 401 });
//         } else {
//             return NextResponse.json({ error: 'Network error' }, { status: 500 });
//         }
//     }
//     const result = new Result(true);
//     result.data = { tokenValidity: true }
//     result.setTrue("Session verified");
    

//     return NextResponse.json(result, { status: 201 });
// }

