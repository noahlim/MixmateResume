import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { NextRequest, NextResponse } from "next/server";
import { sharedRecipeCollection } from "@/app/_utilities/_server/database/config";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { ObjectId } from "mongodb";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { isSet, Result } from "@/app/_utilities/_server/util";

export const GET = withApiAuthRequired(async function getCustomRecipeById(req: NextRequest) {
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    let result = new Result();

    try {
        const params = req.nextUrl.pathname.toString().split("/");
        if (params.length < 5 || params[4] === "") {
            return NextResponse.json({ error: "Id was not passed in the query." }, { status: 400 });
        }
        let db = await dbRtns.getDBInstance();
        const recipeId = params[4];
        let recipeInfo = await dbRtns.findOne(db, sharedRecipeCollection, { _id: new ObjectId(recipeId) });
        if (isSet(recipeInfo)) {
            result.setTrue();
            result.data = recipeInfo;
        }
        else
            result.setFalse('Recipe not found');

        // Done
        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 400 });
    }
});