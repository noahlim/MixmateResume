import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, sharedRecipeCollection, recipeReviewCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
export const GET = withApiAuthRequired(async function getAllUserCustomRecipe(req: NextRequest) {
    if (!rateLimit(req, 100, 15 * 60 * 1000)) {
        // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 });
    }

    let result = new Result();
    try {
        const userId = req.nextUrl.searchParams.get('userid');

        const pageNumber = parseInt(req.nextUrl.searchParams.get('index'));
        const isVisible = req.nextUrl.searchParams.get('publicflag') === 'true';
        const { user } = await getSession();
        if (userId) {
            if (!user || user.sub !== userId) {
                return NextResponse.json({ error: "Invalid session." }, { status: 400 });
            }
            let db = await dbRtns.getDBInstance();
            const criteria = isVisible ? { sub: userId, visibility: "public" } : { sub: userId };

            let recipes = await dbRtns.findAllWithPagination(db, sharedRecipeCollection, criteria, {}, pageNumber ? pageNumber : 0, 5);

            let totalCount = await dbRtns.count(db, sharedRecipeCollection, criteria);


            const updatedRecipes = await Promise.all(
                recipes.map(async (recipe) => {
                    const updatedRecipe = { ...recipe };

                    const reviews = await dbRtns.findAll(db, recipeReviewCollection, { recipeId: updatedRecipe._id.toString() }, {});
                    updatedRecipe.reviews = reviews;

                    return updatedRecipe;
                })
            );

            const data = { recipes: updatedRecipes, length: totalCount };
            result.data = data;
            result.message = totalCount > 0 ? `${totalCount} recipes found!` : "No recipes found.";
            return NextResponse.json(result, { status: 200 });
        } else {
            if (!user) {
                return NextResponse.json({ error: "Invalid session." }, { status: 400 });
            }
            let db = await dbRtns.getDBInstance();
            let recipes = await dbRtns.findAllWithPagination(db, sharedRecipeCollection, { visibility: "public" }, {}, pageNumber ? pageNumber : 0, 5);
            const totalCount = await dbRtns.count(db, sharedRecipeCollection, { visibility: "public" });

            if (recipes.length > 0) {
                const updatedRecipes = await Promise.all(
                    recipes.map(async (recipe) => {
                        const updatedRecipe = { ...recipe };

                        const reviews = await dbRtns.findAll(db, recipeReviewCollection, { recipeId: updatedRecipe._id.toString() }, {});
                        updatedRecipe.reviews = reviews;

                        return updatedRecipe;
                    })
                );

                const data = { recipes: updatedRecipes, length: totalCount };
                result.data = data;
                result.message = totalCount > 0 ? `${totalCount} recipes found!` : "No recipes found.";
            } else {
                result.message = "No recipes found.";
                const data = { recipes: [], length: 0 };
                result.data = data;
            }
            return NextResponse.json(result, { status: 200 });
        }
    } catch (err) {
        console.log(err);
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
            body.recipe.updated_at = new Date().toISOString();
            body.recipe.reviews = [];
            body.recipe.nickname = user.email_verified ? user.name : user.nickname;
            body.recipe.strAuthor = user.email_verified ? user.name : user.nickname;
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
        if (!body) {
            return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
        }
        else {
            if (!body.recipe)
                return NextResponse.json({ error: 'No recipe data passed' }, { status: 404 });
            if (!body.userId)
                return NextResponse.json({ error: 'No user id passed' }, { status: 404 });
        }
        let result = new Result(true);
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Invalid session." }, { status: 400 });
        }
        if (user.sub !== body.userId) {
            return NextResponse.json({ error: "The user is not authorized to update this recipe." }, { status: 401 });
        }
        try {
            // Validate if user exist
            let db = await dbRtns.getDBInstance();
            //user.sub is  unique id of each user
            let userExist = await dbRtns.findOne(db, userCollection, { sub: user.sub });

            if (isNotSet(userExist)) {
                return NextResponse.json({ error: 'User information not found' }, { status: 404 });
            }

            delete body.recipe._id;
            body.recipe.updated_at = new Date().toISOString();
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