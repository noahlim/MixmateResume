import { NextResponse, NextRequest } from "next/server";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userIngredientCollection, recipeCollection, userCollection } from '@/app/_utilities/_server/database/config';
import { Result, isNotSet } from "@/app/_utilities/_server/util";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

export const GET = withApiAuthRequired(async function getAvailableRecipes(req: NextRequest) {

    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    let result = new Result();
    try {


        const { user } = await getSession();
        let db = await dbRtns.getDBInstance();

        let userExist = await dbRtns.findOne(db, userCollection, { sub: user.sub });

        if (isNotSet(userExist)) {
            return NextResponse.json({ error: 'User information not found' }, { status: 404 });
        }
        const singleIngredient = req.nextUrl.searchParams.get('singleIngredient');
        const ingredient = req.nextUrl.searchParams.get('ingredient');


        let ingredientsArray;

        if (ingredient && singleIngredient) {
            ingredientsArray = [ingredient];
        } else {
            const ingredientsFetched = await dbRtns.findOne(
                db,
                userIngredientCollection,
                { sub: user.sub }
            );
            if (!ingredientsFetched) {
                return NextResponse.json({ error: 'User not found.' }, { status: 400 });
            }
            ingredientsArray = ingredientsFetched.ingredients.map(ingredient => ingredient.strIngredient1);

        }

        let filteredRecipes = await dbRtns.findAll(db, recipeCollection, { "ingredients.ingredient": { "$in": ingredientsArray } }, {});

        filteredRecipes.sort((a, b) => {
            const drinkA = a.strDrink.toLowerCase();
            const drinkB = b.strDrink.toLowerCase();

            if (drinkA < drinkB) return -1;
            if (drinkA > drinkB) return 1;
            return 0;
        });
        result.setTrue(`${filteredRecipes.length} recipes found`);
        result.data = filteredRecipes;
    } catch (ex) {
        return NextResponse.json({ error: ex.message }, { status: 400 });

    }

    return NextResponse.json(result, { status: 200 });

}
)
