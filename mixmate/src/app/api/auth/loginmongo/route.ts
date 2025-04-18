import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, userIngredientCollection } from "@/app/_utilities/_server/database/config";
import { getSession } from "@auth0/nextjs-auth0";
//After logging in with Auth0 library, checks if the user is on our mongodb,
//if so skip, if not add it to the database
export async function POST(req: NextRequest, res: NextResponse) {

    let result = new Result(true);
    if (!req.body) {
        return NextResponse.json({ error: 'No user data passed' }, { status: 404 });
    }
    const body = await readRequestBody(req.body);

    try {
        const { user } = await getSession();

        // Validate if user exist
        let db = await dbRtns.getDBInstance();

        //body.sub is unique id of each user
        let userExist = await dbRtns.findOne(db, userCollection, { sub: body.sub });
        if (isSet(userExist)) {
            result.setTrue("user already exists");
            return NextResponse.json(result, { status: 200 });

        } else {
            body.created_at = body.updated_at;
            body.ingredients = [];
            const newUserIngredientDocument = { sub: user.sub, ingredients: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
            await dbRtns.addOne(db, userIngredientCollection, newUserIngredientDocument);
            await dbRtns.addOne(db, userCollection, body);
        }

        return NextResponse.json(result, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
