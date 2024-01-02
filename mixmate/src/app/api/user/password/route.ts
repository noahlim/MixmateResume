// // POST /api/user.js
// import * as cfg from "../../database/config";
// import * as dbRtns from "../../database/db_routines.js";

import { NextRequest, NextResponse } from 'next/server'
import { Result, isSet, isNotSet, readRequestBody } from '@/app/_utilities/_server/util';
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection } from '@/app/_utilities/_server/database/config';

//GET method : Fetch user password from the database
export async function GET(req: NextRequest, res: NextResponse) {

  //fetching the nickname query from the request url
  //http://localhost:3000/api/user/password/?nickname=Harry
  //and the nickname variable value will be "Harry"
  const nickname = req.nextUrl.searchParams.get('nickname');
  let result = new Result();

  // // Get user info by nickname
  let db = await dbRtns.getDBInstance();
  let userInfo = await dbRtns.findOne(db, userCollection, {
    nickname: nickname,
  });
  if (isSet(userInfo)) {
    result.setTrue();
    result.data = { password: userInfo.password };
  } else result.setFalse("User do not exist");

  let response = NextResponse
  return response.json(result);

}

//POST method : Update the password
export async function POST(req: NextRequest, res: NextResponse) {
  if (req.body) {
    const body = await readRequestBody(req.body);

    
    if(!body){
      return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
    }
    
    let result = new Result(true);

    // Get user info by nickname
    let db = await dbRtns.getDBInstance();
    let userInfo = await dbRtns.findOne(db, userCollection, { nickname: body.nickname });

    // Validate current password against received current password
    if (isSet(userInfo) && userInfo.password !== body.password)
      result.setFalse('Invalid session or wrong password');

    // Validate received new password
    if (isNotSet(body.newPassword))
      result.setFalse('New password not received');

    if (!result.isOk) {
      return NextResponse.json(result, { status: 409 });
    }
    // Update database

    // {
    //   acknowledged: true,
    //   modifiedCount: 1,
    //   upsertedId: null,
    //   upsertedCount: 0,
    //   matchedCount: 1
    // }
    const response = await dbRtns.updateOne(db, userCollection, { _id: userInfo._id }, { password: body.newPassword });
    if (response.acknowledged)
      result.setTrue('New password has been saved.');
    else
      result.setFalse("Failed to update the password.");
    // Done
    return NextResponse.json(result, { status: 201 });


  } else {
    return NextResponse.json({ error: 'Failed to update the password.' }, { status: 400 });
  }
}

