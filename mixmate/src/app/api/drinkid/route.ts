import { NextRequest, NextResponse } from 'next/server'
import { Result, isSet, isNotSet, readRequestBody } from '@/app/_utilities/_server/util';
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { recipeCollection } from '@/app/_utilities/_server/database/config';
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";

//GET method : Fetch drink info from the database
export async function GET(req: NextRequest, res: NextResponse) {
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    //fetching the drink query from the request url
    //http://localhost:3000/api/user/password/?drinkid=123123
    //and the drinkId variable value will be '123123'
    const drinkId = req.nextUrl.searchParams.get('drinkid');

    if (isNotSet(drinkId))
        return NextResponse.json({ error: "Drink info was not passed in" }, { status: 400 });

    let result = new Result();

    let db = await dbRtns.getDBInstance();
    let recipeInfo = await dbRtns.findOne(db, recipeCollection, {
        idDrink: drinkId,
    });
    if (isSet(recipeInfo)) {
        result.setTrue("Drink found!");
        result.data = recipeInfo;
    } else result.setFalse("User do not exist");

    return NextResponse.json(result, { status: 200 });
}