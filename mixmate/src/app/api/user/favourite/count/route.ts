import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { NextRequest, NextResponse } from "next/server";
import { userFavouriteCollection } from "@/app/_utilities/_server/database/config";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { isSet, Result } from "@/app/_utilities/_server/util";

export const GET = withApiAuthRequired(async (req: NextRequest) => {
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    let result = new Result();

    try {
        const session = await getSession();
        let db = await dbRtns.getDBInstance();
        //if user id is provided, get the recipes by the user who made the call only, if not get all
        let recipeCount = await dbRtns.count(db, userFavouriteCollection, {sub: session.user.sub});

        if (isSet(recipeCount)) {
            result.setTrue(`${recipeCount} recipes found`);
            result.data = recipeCount;
        }
        else
            result.setFalse('Recipes not found');

        // Done
        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 400 });
    }
});
