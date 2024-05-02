import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, userIngredientCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";


export const GET = withApiAuthRequired(async function getAllUserIngredients(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
    return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
  }

  try {

    const { user } = await getSession();

    if (user.sub !== req.nextUrl.searchParams.get('userId')) {
      return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 400 });
    }

    let db = await dbRtns.getDBInstance();

    let userIngredientDocument = await dbRtns.findOne(db, userIngredientCollection, { sub: user.sub });
    if (isNotSet(userIngredientDocument)) {
      return NextResponse.json({ error: 'No ingredients found' }, { status: 404 });
    }
    const result = new Result(true);

    result.data = userIngredientDocument.ingredients;
    //response is the object deleted
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 400 });

  }
});

export const POST = withApiAuthRequired(async function postUserIngredient(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
    return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
  }

  try {

    const { user } = await getSession();

    const body = await readRequestBody(req.body);
    if (!body.ingredient) {
      return NextResponse.json({ error: 'No data passed' }, { status: 404 });
    }
    if (user.sub !== body.userId) {
      return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 400 });
    }

    let db = await dbRtns.getDBInstance();

    let userIngredientDocument = await dbRtns.findOne(db, userIngredientCollection, { sub: user.sub });
    if (isNotSet(userIngredientDocument)) {
      const newUserIngredientDocument = { sub: user.sub, ingredients: [body.ingredient], created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      await dbRtns.addOne(db, userIngredientCollection, newUserIngredientDocument);
    }else{
      userIngredientDocument.ingredients.push(body.ingredient);
      await dbRtns.updateOne(db, userIngredientCollection, { sub: user.sub }, { ingredients: userIngredientDocument.ingredients, updated_at: new Date().toISOString()});
    }
    const result = new Result(true);

    result.data = userIngredientDocument.ingredients;
    //response is the object deleted
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 400 });

  }
});

