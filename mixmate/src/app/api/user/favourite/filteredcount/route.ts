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
    let criteria;
    const result = new Result(true);

    //add extra validation to collection name for security

    const validFilters = ["Ingredient", "Alcoholic Type", "Category", "Glass", "Recipe Name"];
    if (!validFilters.includes(filterType)) {
        return NextResponse.json({ error: "Invalid filter passed in" }, { status: 400 });
    }



    try {
        let db = await dbRtns.getDBInstance();
        if (filterType && filterCriteria) {

            const user = await getSession();
            switch (filterType) {
                case "Ingredient": {
                    const query = {
                        ingredients: {
                            $elemMatch: { ingredient: filterCriteria }
                        },
                        sub: user.sub
                    };
                    let filteredCount = await dbRtns.count(db, userFavouriteCollection, query);
                    result.data = filteredCount;
                    if (filteredCount === 0) {
                        result.message = "No recipes found!";
                    } else {
                        result.message = `${filteredCount} recipes found!`
                    }
                    return NextResponse.json(result, { status: 200 });
                }
                case "Recipe Name": {
                    const regexQuery = new RegExp(filterCriteria, 'i'); // 'i' for case-insensitive
                    const query = {
                        strDrink: { $regex: regexQuery },
                        sub: user.sub
                    }
                    let filteredCount = await dbRtns.count(db, userFavouriteCollection, query);
                    result.data = filteredCount;

                    if (filteredCount === 0) {
                        result.message = "No recipes found!";
                    } else {
                        result.message = `${filteredCount} recipes found!`
                    }
                    return NextResponse.json(result, { status: 200 });
                }
                case "Glass": {
                    criteria = { strGlass: filterCriteria, sub: user.sub };
                    break;
                }
                case "Alcoholic Type": {
                    console.log(filterCriteria);
                    console.log(filterType);
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
            const filteredCount = await dbRtns.count(db, userFavouriteCollection, criteria);
            if (filteredCount === 0) {
                result.message = "No recipes found!";
            } else {
                result.message = `${filteredCount} recipes found!`
            }
            result.data = filteredCount;
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
