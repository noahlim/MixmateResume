import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, sharedRecipeCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "@/app/_utilities/_client/constants";
export const GET = withApiAuthRequired(async function getAllUserCustomRecipe(req: NextRequest) {
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    let result = new Result();
    try {
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Invalid session." }, { status: 400 });
        }
        let db = await dbRtns.getDBInstance();
        let recipes = await dbRtns.findAll(db, sharedRecipeCollection, { sub: user.sub }, {});

        //deleting user Id in the recipes before returning to the server for security reason
        const updatedRecipes = recipes.map((recipe) => {
            delete recipe.sub;
            return recipe;
        })
        if (updatedRecipes && updatedRecipes.length > 0) {
            result.setTrue("Recipes Fetched.");
            result.data = updatedRecipes;
        } else result.setFalse("Recipes not found");

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Error fetching the recipes from the custom recipes collection.' }, { status: 400 });

    }
});


export const POST = withApiAuthRequired(async function postRecipeOnSocial(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    if (req.body) {
        const body = await readRequestBody(req.body);

        if (!body) {
            return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
        }
        else {
            if (!body.recipe)
                return NextResponse.json({ error: 'No recipe data passed' }, { status: 404 });
        }
        let result = new Result(true);
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Invalid session." }, { status: 400 });
        }
        try {
            // let isImageUploaded = null;
            let fileName = body.filename;
            // if (body.filename && body.image) {
            //     const image = Buffer.from(body.image, 'base64').toString();
         
            //     const formData = new FormData();
            //     formData.append("file", image);

            //     await makeRequest(
            //         API_ROUTES.image,
            //         REQ_METHODS.post,
            //         formData,
            //         (response) => {
            //             if(response.message === "File has been added to the storage."){
            //                 isImageUploaded = true;
            //                 fileName = response.data;
            //             }
            //         }
            //     );
            // }
            // Validate if user exist
            let db = await dbRtns.getDBInstance();
            //user.sub is  unique id of each user
            let userExist = await dbRtns.findOne(db, userCollection, { sub: user.sub });

            if (isNotSet(userExist)) {
                return NextResponse.json({ error: 'User information not found' }, { status: 404 });
            }
            body.recipe.sub = user.sub;
            body.recipe.created_at = new Date().toISOString();
            body.recipe.visibility = "private";
            body.recipe.nickname = user.nickname;
            body.recipe.strDrinkThumb = fileName;

            await dbRtns.addOne(db, sharedRecipeCollection, body.recipe);

            result.setTrue(`The recipe has been added to your favourite!`);

        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: 'Error saving the recipe to the favourite list' }, { status: 400 });
        }
        return NextResponse.json(result, { status: 201 });

    }
}
)


export const PUT = withApiAuthRequired(async function postRecipeOnSocial(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    if (req.body) {
        const body = await readRequestBody(req.body);

        if (!body) {
            return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
        }
        else {
            if (!body.recipe)
                return NextResponse.json({ error: 'No recipe data passed' }, { status: 404 });
        }
        let result = new Result(true);
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Invalid session." }, { status: 400 });
        }
        try {
            // Validate if user exist
            let db = await dbRtns.getDBInstance();
            //user.sub is  unique id of each user
            let userExist = await dbRtns.findOne(db, userCollection, { sub: user.sub });

            if (isNotSet(userExist)) {
                return NextResponse.json({ error: 'User information not found' }, { status: 404 });
            }
            //await dbRtns.addOne(db, sharedRecipeCollection, body.recipe);            
            await dbRtns.updateOne(db, sharedRecipeCollection, { _id: new ObjectId(body.recipe._id) }, body.recipe);

            result.setTrue(`The recipe has updated.`);

        } catch (error) {
            return NextResponse.json({ error: 'Error saving the recipe to the favourite list' }, { status: 400 });
        }
        return NextResponse.json(result, { status: 201 });

    }
}
)