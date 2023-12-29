// // POST /api/user.js
// import * as cfg from "../../database/config";
// import * as dbRtns from "../../database/db_routines.js";

import { NextRequest, NextResponse } from 'next/server'
import { Result, isSet, readRequestBody } from '@/app/_utilities/_server/util';
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection } from '@/app/_utilities/_server/database/config';

//GET method : Fetch user data from the database
export async function GET(req: NextRequest, res: NextResponse) {

  //fetching the nickname query from the request url
  //http://localhost:3000/api/user?nickname=Harry&password=password
  //and the nickname variable value will be "Harry"
  const nickname = req.nextUrl.searchParams.get('nickname');
  const password = req.nextUrl.searchParams.get('password');
  console.log(password);
  let result = new Result();

  // // Get user info by nickname
  let db = await dbRtns.getDBInstance();
  let userInfo = await dbRtns.findOne(db, userCollection, {
    nickname: nickname,
  });
  console.log(userInfo);
  if (isSet(userInfo)) {
    if (userInfo.password !== password) {
      result.setFalse("Invalid password.");
      return NextResponse.json(result);
    }
    result.setTrue();
    result.data = userInfo;
  } else result.setFalse("User does not exist");

  return NextResponse.json(result);

}

//POST method : Add new user to the database
export async function POST(req: NextRequest, res: NextResponse) {
  if (req.body) {
    const body = await readRequestBody(req.body);

    let result = new Result(true);

    // Validate if user already exist
    let db = await dbRtns.getDBInstance();
    let userExist = await dbRtns.findOne(db, userCollection, { nickname: body.nickname });
    console.log(userExist);
    if (isSet(userExist)) {
      result.setFalse('Nickname already in use');
      return NextResponse.json(result, { status: 409 });
    }

    // Save new user
    if (result.isOk) {
      delete body.passwordConfirm;
      await dbRtns.addOne(db, userCollection, body);
      result.setTrue('User [ ' + body.nickname + ' ] added!');
    }
    return NextResponse.json(result, { status: 201 });


  } else {
    return NextResponse.json({ error: 'Failed to add user' }, { status: 400 });
  }
}

