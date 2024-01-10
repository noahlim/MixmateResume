import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { NextRequest, NextResponse } from "next/server";
import { userFavouriteCollection } from "@/app/_utilities/_server/database/config";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { ObjectId } from "mongodb";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Result } from "@/app/_utilities/_server/util";
//http://localhost:3000/api/user/favourite/123
export const DELETE = withApiAuthRequired(async function deleteFavourite(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    try {
        const params = req.nextUrl.pathname.toString().split("/");
        if (params.length < 5 || params[4] === "") {
            return NextResponse.json({ error: "Id was not passed in the query." }, { status: 400 });
        }
        const { user } = await getSession();
     
        const drinkId = params[4];

        const _id = new ObjectId(drinkId);
        let db = await dbRtns.getDBInstance();

        let response = await dbRtns.findOne(db, userFavouriteCollection, { _id: _id });
        if (!response) {
            return NextResponse.json({ error: 'Selected recipe does not exist on your list.' }, { status: 404 })
        }
        //when the unique id of the user and the id of the user who created
        //the favourite list do not match    
        if (user.sub !== response.sub) {
            return NextResponse.json({ error: "The user is not authorized to delete this recipe." }, { status: 401 });
        }

        //response is the object deleted
        response = await dbRtns.deleteOne(db, userFavouriteCollection, { _id: _id });
        if (response) {
            const result = new Result(true);
            result.message = "Selected recipe has been deleted successfully";
            return NextResponse.json(result, {status:204});
        }
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 400 });

    }
});
