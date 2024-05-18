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
      const newUserIngredientDocument = { sub: user.sub, ingredients: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      await dbRtns.addOne(db, userIngredientCollection, newUserIngredientDocument);
      userIngredientDocument = newUserIngredientDocument;
    }

    const result = new Result(true);

    result.data = userIngredientDocument;
    result.message = `${userIngredientDocument.ingredients.length} ingredients fetched successfully.`;
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
      const newUserIngredientDocument = {
        sub: user.sub, ingredients: [{
          strIngredient1: body.ingredient, strIngredientThumb: `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
            body.ingredient
          )}.png`
        }], created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      };
      await dbRtns.addOne(db, userIngredientCollection, newUserIngredientDocument);
    } else {
      // Check if the ingredient already exists
      if (userIngredientDocument.ingredients.some(ingredient => ingredient.strIngredient1.toLowerCase() === body.ingredient.toLowerCase())) {
        return NextResponse.json({ error: 'Ingredient already exists.' }, { status: 400 });
      }

      userIngredientDocument.ingredients.push({
        strIngredient1: body.ingredient, strIngredientThumb: `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
          body.ingredient
        )}.png`
      });
      await dbRtns.updateOne(db, userIngredientCollection, { sub: user.sub }, { ingredients: userIngredientDocument.ingredients, updated_at: new Date().toISOString() });
    }
    const result = new Result(true);

    result.data = userIngredientDocument.ingredients;
    result.message = "Ingredient added successfully";
    //response is the object deleted
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 400 });

  }
});

export const DELETE = withApiAuthRequired(async function deleteSocialRecipe(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
  }

  const userId = req.nextUrl.searchParams.get('userId');
  const ingredient = req.nextUrl.searchParams.get('ingredient');

  if (!ingredient) {
      return NextResponse.json({ error: 'Body is Empty' }, { status: 400 });
  }
  
  try {
  const { user } = await getSession();

  if (!userId || userId !== user.sub) {
    return NextResponse.json({ error: 'Invalid user data.' }, { status: 400 });
  }
      let db = await dbRtns.getDBInstance();
      let response = await dbRtns.findOne(db, userIngredientCollection, { sub: userId });
      if (!response) {
          return NextResponse.json({ error: "User does not exist." }, { status: 404 })
      }
     
      const updatedIngredientList = response.ingredients.filter(ing => ing.strIngredient1 !== ingredient);  
      console.log(updatedIngredientList);
      response = await dbRtns.updateOne(db, userIngredientCollection, { sub: userId }, { ingredients: updatedIngredientList, updated_at: new Date().toISOString() }); 
      
      if (response) {
          const result = new Result(true);
          result.message = "Selected recipe has been deleted successfully.";
          return NextResponse.json(result, { status: 200 });
      }
  } catch (err) {
      return NextResponse.json({ error: err }, { status: 400 });

  }
})