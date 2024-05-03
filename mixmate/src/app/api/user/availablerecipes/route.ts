import { NextResponse, NextRequest } from "next/server";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userIngredientCollection, recipeCollection } from '@/app/_utilities/_server/database/config';
import { Result } from "@/app/_utilities/_server/util";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { API_DRINK_ROUTES } from "@/app/_utilities/_client/constants";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
export const GET = withApiAuthRequired(async function getAvailableRecipes(req: NextRequest) {

    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    let result = new Result();
    try {

        const { user } = await getSession();
        const userId = req.nextUrl.searchParams.get('userId');
        if (!userId || userId !== user.sub) {
            return NextResponse.json({ error: 'Invalid user data.' }, { status: 400 });
        }

        let db = await dbRtns.getDBInstance();
        let ingredientsFetched = await dbRtns.findOne(
            db,
            userIngredientCollection,
            { sub: user.sub }
        );

        if (!ingredientsFetched) {
            return NextResponse.json({ error: 'User not found.' }, { status: 400 });
        }

        let ingredientsArray = ingredientsFetched.ingredients.map(ingredient => ingredient.strIngredient1);

        console.log(ingredientsArray);
        let filteredRecipes = await dbRtns.findAll(db, recipeCollection, {"ingredients.ingredient": {"$in": ingredientsArray}}, {}, 0, 
        0);
        
        // let filteredRecipes = recipes.filter((recipe) =>
        //     ingredientsFetched.ingredients.some((fetchedIngredient) =>
        //         recipe.ingredients.some(
        //             (recipeIngredient) =>
        //                 recipeIngredient.ingredient === fetchedIngredient.strIngredient1
        //         )
        //     )
        // );

        result.data = filteredRecipes;
        console.log(filteredRecipes.length);
    } catch (ex) {
        return NextResponse.json({ error: ex.message }, { status: 400 });

    }

    return NextResponse.json(result, { status: 200 });

}
)
