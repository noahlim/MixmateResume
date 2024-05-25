import { NextResponse, NextRequest } from "next/server";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userFavouriteCollection } from '@/app/_utilities/_server/database/config';
import { Result } from "@/app/_utilities/_server/util";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { API_DRINK_ROUTES } from "@/app/_utilities/_client/constants";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
export const GET = withApiAuthRequired(async function getFilteredFavourites(req: NextRequest) {

    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    //http://localhost:3000/api/drinks/filter?db=social&filter=ingredient&criteria=lemon

    const filterType = req.nextUrl.searchParams.get('filter');
    const filterCriteria = req.nextUrl.searchParams.get('criteria');
    const pageIndex = req.nextUrl.searchParams.get('index');
    let criteria;
    const result = new Result(true);
    //add extra validation to collection name for security

    const validFilters = ["Ingredient", "Alcoholic Type", "Category", "Glass", "Recipe Name"];
    if (!validFilters.includes(filterType)) {
        return NextResponse.json({ error: "Invalid filter passed in" }, { status: 400 });
    }


    try {
        let db = await dbRtns.getDBInstance();
        const index = parseInt(pageIndex);
        if (filterType && filterCriteria) {

            const session = await getSession();
            const user = session.user;
            switch (filterType) {
                case "Ingredient": {
                    const query = {
                        ingredients: {
                            $elemMatch: { ingredient: filterCriteria }
                        },
                        sub: user.sub
                    };

                    let recipesByIngredients = await dbRtns.findAllWithPagination(db, userFavouriteCollection, query, {}, 5, index);
                    let length = await dbRtns.count(db, userFavouriteCollection, query);
                    const data = {
                        recipes: recipesByIngredients,
                        length: length
                    }
                    result.data = data;

                    if (recipesByIngredients.length === 0) {
                        result.message = "No recipes found!";
                    } else {
                        result.message = `${length} recipes found!`
                    }
                    return NextResponse.json(result, { status: 200 });
                }
                case "Recipe Name": {
                    const regexQuery = new RegExp(filterCriteria, 'i'); // 'i' for case-insensitive
                    const query = {
                        strDrink: { $regex: regexQuery },
                        sub: user.sub
                    };

                    let recipesByName = await dbRtns.findAllWithPagination(db, userFavouriteCollection, query, {}, index, 5);
                    let length = await dbRtns.count(db, userFavouriteCollection, query);
                    result.data = recipesByName;
                    if (recipesByName.length === 0) {
                        result.message = "No recipes found!";
                    } else {
                        result.message = `${length} recipes found!`
                    }
                    const data = {
                        recipes: recipesByName,
                        length: length
                    }
                    result.data = data;
                    return NextResponse.json(result, { status: 200 });
                }
                case "Glass": {
                    criteria = { strGlass: filterCriteria, sub: user.sub };
                    break;
                }
                case "Alcoholic Type": {
                    criteria = { strAlcoholic: filterCriteria, sub: user.sub };
                    break;
                }
                case "Category": {
                    criteria = { strCategory: filterCriteria, sub: user.sub };
                    break;
                } default: {
                    return NextResponse.json({ error: "Invalid criteria passed in." }, { status: 400 });
                }

            }
            const recipesFiltered = await dbRtns.findAllWithPagination(db, userFavouriteCollection, criteria, {}, index, 5);
            const length = await dbRtns.count(db, userFavouriteCollection, criteria);    
            if (length === 0) {
                result.message = "No recipes found!";
            } else {
                result.message = `${length} recipes found!`
            }
            const data = {
                recipes: recipesFiltered,
                length: length
            }
            result.data = data;
            return NextResponse.json(result, { status: 200 });
        }
        else
            return NextResponse.json({ error: "Criteria was not passed in" }, { status: 400 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Error occured while fetching the data from the database." }, { status: 400 });
    }
}
)
