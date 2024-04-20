import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, sharedRecipeCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
export const GET = withApiAuthRequired(async function getAllUserCustomRecipe(req: NextRequest) {
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    let result = new Result();

    try {
        const userId = req.nextUrl.searchParams.get('userid');
        const pageNumber = parseInt(req.nextUrl.searchParams.get('index'));

        const { user } = await getSession();
        //get shared recipes only for the authenticated users
        if (userId) {

            if (!user || user.sub !== userId) {
                return NextResponse.json({ error: "Invalid session." }, { status: 400 });
            }
            let db = await dbRtns.getDBInstance();
            //get 10 documents per page
            let recipes = await dbRtns.findAll(db, sharedRecipeCollection, { sub: user.sub }, {}, pageNumber ? pageNumber : 1, 10);

            //deleting user Id in the recipes before returning to the server for security reason
            const updatedRecipes = recipes.map((recipe) => {
                delete recipe.sub;
                return recipe;
            })
            result.setTrue("Recipes Fetched.");
            result.data = updatedRecipes;
            result.message = updatedRecipes.length > 0 ? `${updatedRecipes.length} recipes found!` : "No reciped found."


            return NextResponse.json(result, { status: 200 });
            //get all shared recipes
        } else {
            if (!user) {
                return NextResponse.json({ error: "Invalid session." }, { status: 400 });
            }
            let db = await dbRtns.getDBInstance();
            //get 10 documents per page

            let recipes = await dbRtns.findAll(db, sharedRecipeCollection, {visibility:"public"}, {}, pageNumber ? pageNumber : 0, 10);

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

        }
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
            body.recipe.strAuthor = user.nickname;
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


export const PUT = withApiAuthRequired(async function putRecipeOnSocial(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    if (req.body) {
        const body = await readRequestBody(req.body);
        console.log(body);
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

            const id = body.recipe._id;
            console.log(body);
            delete body.recipe._id;

            const bruh = await dbRtns.updateOne(db, sharedRecipeCollection, { _id: new ObjectId(id) }, body.recipe);

            delete body.recipe._id;
            await dbRtns.updateOne(db, sharedRecipeCollection, { _id: new ObjectId(body.recipe._id) }, body.recipe);

            result.setTrue(`The recipe has updated.`);

        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: 'Error saving the recipe to the favourite list' }, { status: 400 });
        }
        return NextResponse.json(result, { status: 201 });

    }
}
)

export const DELETE = withApiAuthRequired(async function deleteSocialRecipe(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    const drinkId = new ObjectId(req.nextUrl.searchParams.get('_id'));
    console.log(drinkId);

    if (!drinkId) {
        return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
    }
    const { user } = await getSession();


    try {
        let db = await dbRtns.getDBInstance();
        let response = await dbRtns.findOne(db, sharedRecipeCollection, { _id: drinkId });
        if (!response) {
            return NextResponse.json({ error: 'Selected recipe does not exist on your list.' }, { status: 404 })
        }
        //when the unique id of the user and the id of the user who created
        //the favourite list do not match    
        if (user.sub !== response.sub) {
            return NextResponse.json({ error: "The user is not authorized to delete this recipe." }, { status: 401 });
        }

        //response is the object deleted
        response = await dbRtns.deleteOne(db, sharedRecipeCollection, { _id: drinkId });
        if (response) {
            const result = new Result(true);
            result.message = "Selected recipe has been deleted successfully";
            return NextResponse.json(result, { status: 200 });
        }
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 400 });

    }
})