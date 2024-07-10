import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, sharedRecipeCollection, recipeReviewCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

const isValidMixmateUrl = (url) => {
    try {
        // Create a URL object to parse the input
        const parsedUrl = new URL(url);

        // Check if the protocol is http or https
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return false;
        }

        // Check if the hostname matches the required domain
        if (parsedUrl.hostname !== 'mixmatebucket.s3.us-east-2.amazonaws.com') {
            return false;
        }

        // If all checks pass, return true
        return true;
    } catch (error) {
        // If URL parsing fails, it's not a valid URL
        return false;
    }
}

const validateRecipe = (recipe) => {
    let result = new Result(true);
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
        result.setFalse('No ingredients passed');
        return result;
    }
    const ingredients = recipe.ingredients.filter((ing) => !ing.ingredient || !ing.measure);
    if (ingredients.length > 0) {
        result.setFalse('All ingredients must have both ingredient and measure');
        return result;
    }

    if (isNotSet(recipe.strInstructions) || recipe.strInstructions.trim() === '') {
        result.setFalse('No instructions passed');
        return result;
    }

    if (isNotSet(recipe.strDrink) || recipe.strDrink.trim() === '') {
        result.setFalse('No recipe name passed');
        return result;
    }

    if (isNotSet(recipe.strCategory) || recipe.strCategory.trim() === '') {
        result.setFalse('No recipe category passed');
        return result;
    }

    if (isNotSet(recipe.strAlcoholic) || recipe.strAlcoholic.trim() === '') {
        result.setFalse('No recipe alcoholic type passed');
        return result;
    }

    if (isNotSet(recipe.strGlass) || recipe.strGlass.trim() === '') {
        result.setFalse('No recipe glass type passed');
        return result;
    }

    if (isNotSet(recipe.visibility) || recipe.visibility.trim() === '') {
        result.setFalse('No recipe visibility passed');
        return result;
    }

    return result;
}
export const GET = withApiAuthRequired(async function getAllUserCustomRecipe(req: NextRequest) {
    if (!rateLimit(req, 100, 15 * 60 * 1000)) {
        // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 });
    }

    let result = new Result();
    try {

        const isVisible = req.nextUrl.searchParams.get('publicflag') === 'true';
        const isSocial = req.nextUrl.searchParams.get('socialflag') === 'true';
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Invalid session." }, { status: 400 });
        }

        let db = await dbRtns.getDBInstance();

        let criteria;
        if (!isSocial) {
            criteria = isVisible ? { sub: user.sub, visibility: "public" } : { sub: user.sub };
        } else {
            criteria = { visibility: "public" };
        }

        let allRecipes = await dbRtns.findAll(db, sharedRecipeCollection, criteria, {});
        let totalCount = await dbRtns.count(db, sharedRecipeCollection, criteria);
        let updatedRecipes = [];
        if (allRecipes.length > 0) {
            allRecipes.sort((a, b) => b.created_at.localeCompare(a.created_at));
            updatedRecipes = await Promise.all(
                allRecipes.map(async (recipe) => {
                    const updatedRecipe = { ...recipe };
                    if (isNotSet(updatedRecipe.strDrinkThumb) || !isValidMixmateUrl(updatedRecipe.strDrinkThumb)) {
                        updatedRecipe.strDrinkThumb = "https://mixmatebucket.s3.us-east-2.amazonaws.com/not-found-icon.png";
                    }
                    const reviews = await dbRtns.findAll(db, recipeReviewCollection, { recipeId: updatedRecipe._id.toString() }, {});
                    updatedRecipe.reviews = reviews.sort((a, b) => b.created_at.localeCompare(a.created_at));
                    return updatedRecipe;
                })
            );
        }


        const data = { allRecipes: updatedRecipes, length: totalCount };
        result.data = data;
        result.message = totalCount > 0 ? `${totalCount} recipes found!` : "No recipes found.";       
        return NextResponse.json(result, { status: 200 });
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
            const isRecipeValid = validateRecipe(body.recipe);
            if (!isRecipeValid.isOk) {
                return NextResponse.json({ error: isRecipeValid.message }, { status: 404 });
            }

            let fileName = body.filename;
            if (!isValidMixmateUrl(fileName)) {
                return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
            }

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
            body.recipe.label = body.recipe.strDrink
            await dbRtns.addOne(db, sharedRecipeCollection, body.recipe);

            result.setTrue(`The recipe has been added!`);

        } catch (error) {
            return NextResponse.json({ error: 'Error saving the recipe' }, { status: 400 });
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
        let result = new Result(true);

        try {

            const { user } = await getSession();

            const body = await readRequestBody(req.body);
            if (!body) {
                return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
            }
            else {
                if (!body.recipe)
                    return NextResponse.json({ error: 'No recipe data passed' }, { status: 404 });

            }
            if (!user) {
                return NextResponse.json({ error: "Invalid session." }, { status: 400 });
            }
            // Validate if user exist
            const isRecipeValid = validateRecipe(body.recipe);
            if (!isRecipeValid.isOk) {
                return NextResponse.json({ error: isRecipeValid.message }, { status: 404 });
            }

            let db = await dbRtns.getDBInstance();
            const tempId = body.recipe._id;

            const recipeObject = await dbRtns.findOne(db, sharedRecipeCollection, { _id: new ObjectId(tempId) });
            if (recipeObject.sub !== user.sub) {
                return NextResponse.json({ error: "Current user is not authorized to update this recipe." }, { status: 401 });
            }

            if (!isValidMixmateUrl(body.recipe.strDrinkThumb)) {
                return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
            }
            delete body.recipe._id;
            body.recipe.updated_at = new Date().toISOString();
            await dbRtns.updateOne(db, sharedRecipeCollection, { _id: new ObjectId(tempId) }, body.recipe);

            result.setTrue(`The recipe has updated.`);

        } catch (error) {
            return NextResponse.json({ error: 'Error saving the recipe' }, { status: 400 });
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
        //the shared list do not match    
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