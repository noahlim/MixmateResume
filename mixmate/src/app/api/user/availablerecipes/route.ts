import { NextResponse, NextRequest } from "next/server";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, recipeCollection } from '@/app/_utilities/_server/database/config';
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
        let userFetched = await dbRtns.findOne(
            db,
            userCollection,
            { sub: new ObjectId(user.sub) }
        );

        if (!userFetched) {
            return NextResponse.json({ error: 'User not found?.' }, { status: 400 });
        }

        let recipes = await dbRtns.findAll(db, recipeCollection, {}, {});
        let filteredRecipes = recipes.filter((recipe) =>
            userFetched.ingredients.some((ingredient) =>
                Object.keys(recipe).some(
                    (key) =>
                        key.startsWith("strIngredient") && recipe[key] === ingredient
                )
            )
        );

        result.data = filteredRecipes;
    } catch (ex) {
        return NextResponse.json({ error: ex.message }, { status: 400 });

    }

    return NextResponse.json(result, { status: 200 });

}
)
    