import { NextResponse, NextRequest } from "next/server";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { recipeCollection, sharedRecipeCollection, userFavouriteCollection } from '@/app/_utilities/_server/database/config';
import { Result, findByIngredient, findByName } from "@/app/_utilities/_server/util";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { API_DRINK_ROUTES } from "@/app/_utilities/_client/constants";
export async function GET(req: NextRequest, res: NextResponse) {

    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    //http://localhost:3000/api/drinks/filter?db=social&filter=ingredient&criteria=lemon
    const collection = req.nextUrl.searchParams.get('type');
    const filterType = req.nextUrl.searchParams.get('filter');
    const filterCriteria = req.nextUrl.searchParams.get('criteria');
    const pageIndex = req.nextUrl.searchParams.get('index');
    let collectionName;
    let criteria;
    const result = new Result(true);

    //add extra validation to collection name for security
    if (collection === "social")
        collectionName = sharedRecipeCollection;
    else if (collection === "default")
        collectionName = recipeCollection;
    else
        return NextResponse.json({ error: "Invalid collection criteria passed in" }, { status: 400 });

    if (!(filterType === API_DRINK_ROUTES.ingredients
        || filterType === API_DRINK_ROUTES.alcoholicTypes
        || filterType === API_DRINK_ROUTES.drinkCategories
        || filterType === API_DRINK_ROUTES.glassTypes
        || filterType === "name"))
        return NextResponse.json({ error: "Invalid filter passed in" }, { status: 400 });


    try {
        let db = await dbRtns.getDBInstance();
        const index = parseInt(pageIndex);
        if (collectionName && filterType && filterCriteria) {

            switch (filterType) {
                case API_DRINK_ROUTES.ingredients: {
                    let recipesByIngredients = await findByIngredient(db, collectionName, filterCriteria,  {}, index, 5);
                    result.data = recipesByIngredients;
                    if (recipesByIngredients.length === 0) {
                        result.message = "No recipes found!";
                    } else {
                        result.message = `${recipesByIngredients.length} recipes found!`
                    }
                    return NextResponse.json(result, { status: 200 });
                }
                case "name": {
                    let recipesByName = await findByName(db, collectionName, filterCriteria, {}, index, 5);
                    if (recipesByName.length === 0) {
                        result.message = "No recipes found!";
                    } else {
                        result.message = `${recipesByName.length} recipes found!`
                    }
                    return NextResponse.json(result, { status: 200 });
                }
                case API_DRINK_ROUTES.glassTypes: {
                    criteria = { strGlass: filterCriteria };
                    break;
                }
                case API_DRINK_ROUTES.alcoholicTypes: {
                    criteria = { strAlcoholic: filterCriteria };
                    break;
                }
                case API_DRINK_ROUTES.drinkCategories: {
                    criteria = { strCategory: filterCriteria };
                    break;
                } default: {
                    return NextResponse.json({ error: "Invalid criteria passed in." }, { status: 400 });
                }

            }
            const recipesFiltered = await dbRtns.findAll(db, collectionName, criteria, {}, index, 5);
            if (recipesFiltered.length === 0) {
                result.message = "No recipes found!";
            } else {
                result.message = `${recipesFiltered.length} recipes found!`
            }
            return NextResponse.json(result, { status: 200 });
        }
        else
            return NextResponse.json({ error: "Criteria was not passed in" }, { status: 400 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Error occured while fetching the data from the database." }, { status: 400 });
    }
}

