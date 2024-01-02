import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken"
import { readRequestBody, Result } from "@/app/_utilities/_server/util";
import { jwtSecretKey } from "@/app/_utilities/_server/database/config";
import { isSet } from "@/app/_utilities/_client/utilities";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection } from "@/app/_utilities/_server/database/config";
import bcrypt from "bcrypt"
export async function POST(req: NextRequest, res: NextResponse) {
    const body = await readRequestBody(req.body);
    let result = new Result(true);
    // // Get user info by nickname
    let db = await dbRtns.getDBInstance();
    let userInfo = await dbRtns.findOne(db, userCollection, {
        nickname: body.nickname,
    });
    if (isSet(userInfo)) {
        const match = await bcrypt.compare(body.password, userInfo.password);
        if (!match) {
            result.setFalse("Invalid password.");
            return NextResponse.json(result, { status: 409 });
        }
        result.setTrue("Log in was successful.");
        result.data = userInfo;
    } else {
        result.setFalse("User does not exist")
        return NextResponse.json(result, { status: 401 });
    };

    const token = {
        token: jwt.sign({
            type: "JWT",
            nickname: body.nickname,
            password: body.password,
        }, jwtSecretKey, {
            expiresIn: "3h",
            issuer: "Mixmate"
        })
    }
    delete userInfo.password;
    delete userInfo._id;

    result.data =  userInfo 
    const cookie = `token=${token.token}; HttpOnly; Path=/; Max-Age=${3 * 60 * 60}`;

    return NextResponse.json(result, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': cookie
        }
    });


}