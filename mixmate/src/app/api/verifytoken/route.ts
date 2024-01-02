import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { jwtSecretKey } from "@/app/_utilities/_server/database/config";
import { readRequestBody } from "@/app/_utilities/_server/util";
import { Result } from "@/app/_utilities/_server/util";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
export async function POST(req: NextRequest, res: NextResponse) {

    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
         return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await readRequestBody(req.body);

    let verifiedToken;
    try {
        verifiedToken = jwt.verify(body.token, jwtSecretKey) as { [key: string]: boolean };
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return NextResponse.json({ error: 'Your log in session expired. Please log in again.' }, { status: 440 });
        }
        //when the secret key does not match
        else if (error.name === "JsonWebTokenError") {
            return NextResponse.json({ error: 'Invalid attempt.' }, { status: 401 });
        }
        else {
            return NextResponse.json({ error: 'Network error' }, { status: 500 })
        }
    }
    const result = new Result(true);
    result.data = { tokenValidity: true }

    return NextResponse.json(result, { status: 201 });
}