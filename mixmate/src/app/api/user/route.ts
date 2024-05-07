import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection } from "@/app/_utilities/_server/database/config";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

//After logging in with Auth0 library, checks if the user is on our mongodb,
//if so skip, if not add it to the database
export const POST = withApiAuthRequired(async function postIngredient(req: NextRequest) {

    let result = new Result(true);

    const body = await readRequestBody(req.body);
    if (!body.ingredient) {
        return NextResponse.json({ error: 'No data passed' }, { status: 404 });
    }

    try {

        const { user } = await getSession();
        if (user.sub !== body.userId) {
            return NextResponse.json({ error: 'User information does not match.' }, { status: 400 });
        }
        // Validate if user exist
        let db = await dbRtns.getDBInstance();

        //body.sub is unique id of each user
        let userExist = await dbRtns.findOne(db, userCollection, { sub: body.sub });
        if (isSet(userExist)) {
            const tempIngredientsArray = userExist.ingredients;
            const duplicatedIngredient = tempIngredientsArray.find(ingredient => ingredient.strIngredient1 === body.ingredient.strIngredient1);
            if (duplicatedIngredient) {
                return NextResponse.json({ error: 'Ingredient already exists' }, { status: 400 });
            }
            tempIngredientsArray.push(body.ingredients);
            await dbRtns.updateOne(db, userCollection, { sub: body.sub }, { ingredients: tempIngredientsArray });

        } else {
            return NextResponse.json({ error: 'No associated user data found.' }, { status: 400 });
        }

        result.message = 'Ingredient added successfully';
        return NextResponse.json(result, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
})
export const DELETE = withApiAuthRequired(async function deleteIngredient(req: NextRequest) {
    let result = new Result(true);
    if (!req.body) {
        return NextResponse.json({ error: 'No data passed' }, { status: 404 });
    }
    const body = await readRequestBody(req.body);

    try {
        const {user} = await getSession();
        if(body.userId !== user.sub){
            return NextResponse.json({ error: 'Not authorized to update the ingredients list' }, { status: 400 });
        }
        // Validate if user exist
        let db = await dbRtns.getDBInstance();

        //body.sub is unique id of each user
        let userExist = await dbRtns.findOne(db, userCollection, { sub: body.sub });
        if (isSet(userExist)) {
            const tempIngredientsArray = userExist.ingredients;
            tempIngredientsArray.pop(body.ingredient);
            await dbRtns.updateOne(db, userCollection, { sub: body.sub }, { ingredients: tempIngredientsArray });
        } else {
            return NextResponse.json({ error: 'No associated user data found.' }, { status: 400 });
        }

        return NextResponse.json(result, { status: 201 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
})


export const GET =  withApiAuthRequired(async function getUser(req: NextRequest) {
    
    let result = new Result();
    try {

        const { user } = await getSession();
        const userId = req.nextUrl.searchParams.get('userId');
        if (!userId || userId !== user.sub) {
            return NextResponse.json({ error: 'Invalid user data.' }, { status: 400 });
        }

        let db = await dbRtns.getDBInstance();
        let userFetched = await dbRtns.findOne(
            db,
            userCollection,
            { _id: new ObjectId(user.sub) }
        );

        if (!userFetched) {
            return NextResponse.json({ error: 'User not found.' }, { status: 400 });
        }

        result.data = userFetched;
    } catch (ex) {
        return NextResponse.json({ error: 'User not found.' }, { status: 400 });

    }

    return NextResponse.json(result, { status: 200 });

})