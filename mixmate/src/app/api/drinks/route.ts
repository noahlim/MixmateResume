import { NextResponse, NextRequest } from "next/server";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { recipeCollection, ingredientCollection } from '@/app/_utilities/_server/database/config';
import { Result, fetchFromCocktailDbApi } from "@/app/_utilities/_server/util";
import { API_DRINK_ROUTES } from "@/app/_utilities/_client/constants";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
export async function GET(req: NextRequest, res: NextResponse) {

    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    //http://localhost:3000/api/drinks?criteria=categories
    const criteria = req.nextUrl.searchParams.get('criteria');
    let result = new Result(true);
    try {
        if (criteria)
            switch (criteria) {
                case API_DRINK_ROUTES.alcoholicTypes: {
                    const response = await fetchFromCocktailDbApi("list.php?a=list");
                    result = response;
                    break;
                }
                case API_DRINK_ROUTES.allRecipes: {
                    let db = await dbRtns.getDBInstance();
                    let allRecipes = await dbRtns.findAll(db, recipeCollection, {}, {});

                    const sortedRecipes = allRecipes.sort((a, b) => {
                        const drinkA = a.strDrink.toUpperCase();
                        const drinkB = b.strDrink.toUpperCase();
                        if (drinkA < drinkB) {
                            return -1;
                        }
                        if (drinkA > drinkB) {
                            return 1;
                        }
                        return 0;
                    });
                    result.data = sortedRecipes;
                    break;
                }
                case API_DRINK_ROUTES.drinkCategories: {
                    const response = await fetchFromCocktailDbApi("list.php?c=list");

                    result = response;
                    break;
                }
                case API_DRINK_ROUTES.glassTypes: {
                    const response = await fetchFromCocktailDbApi("list.php?g=list");
                    result = response;
                    break;
                }
                case API_DRINK_ROUTES.ingredients: {
                    let db = await dbRtns.getDBInstance();
                    let allIngredients = await dbRtns.findAll(db, ingredientCollection, {}, {});

                    const sortedIngredients = allIngredients.sort((a, b) => {
                        const ingredientA = a.strIngredient1.toUpperCase();
                        const ingredientB = b.strIngredient1.toUpperCase();
                        if (ingredientA < ingredientB) {
                            return -1;
                        }
                        if (ingredientA > ingredientB) {
                            return 1;
                        }
                        return 0;
                    });

                    result.data = sortedIngredients;
                    break;
                }
                case API_DRINK_ROUTES.filteredDrinks: {
                    const category = req.nextUrl.searchParams.get('category');
                    const glass = req.nextUrl.searchParams.get('glass');
                    const ingredient = req.nextUrl.searchParams.get('ingredient');
                    const alcoholicType = req.nextUrl.searchParams.get('alcoholic');
                    const recipeName = req.nextUrl.searchParams.get('recipename');

                    type Criteria = {
                        [key: string]: string;
                    };
                    const criteria: Criteria = {};
                    if (category) criteria.strCategory = category;
                    if (glass) criteria.strGlass = glass;
                    if (alcoholicType) criteria.strAlcoholic = alcoholicType;
                    if (recipeName) criteria.strDrink = recipeName;

                    // Filter by ingredient
                    if (ingredient) {
                        criteria['ingredients.ingredient'] = ingredient;
                    }

                    let db = await dbRtns.getDBInstance();
                    let filteredDrinks = await dbRtns.findAll(db, recipeCollection, criteria, {});
                    result.data = filteredDrinks;
                    break;

                }
                default: {
                    return NextResponse.json({ error: "Invalid search criteria passed in" }, { status: 400 });
                }
            }

        else
            return NextResponse.json({ error: " Criteria was not passed in" }, { status: 400 });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
}

