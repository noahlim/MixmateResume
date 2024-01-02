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
    let result = new Result();
    // // Get user info by nickname
    let db = await dbRtns.getDBInstance();
    let userInfo = await dbRtns.findOne(db, userCollection, {
        nickname: body.nickname,
    });
    if (isSet(userInfo)) {
    const match = await bcrypt.compare(userInfo.password, body.password);
    
        if (match) {
            result.setFalse("Invalid password.");
            return NextResponse.json(result);
        }
        result.setTrue();
        result.data = userInfo;
    } else result.setFalse("User does not exist");


    const token = {
        token: jwt.sign({
            type: "JWT",
            nickname: body.nickname,
            password: body.password,
        }, jwtSecretKey, {
            expiresIn: "3h",
            issuer: "Harry"
        })
    }
    delete userInfo.password;
    delete userInfo._id;

    result.data = {token:token, userInfo:userInfo}

    return NextResponse.json(result, {status:200})
  
}