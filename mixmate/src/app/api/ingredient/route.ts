import { NextResponse, NextRequest } from "next/server";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { ingredientCollection } from '@/app/_utilities/_server/database/config';
import { Result, fetchFromCocktailDbApi } from "@/app/_utilities/_server/util";

import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
export async function GET(req: NextRequest, res: NextResponse) {

    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    let result = new Result(true);
    try {
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
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
}

