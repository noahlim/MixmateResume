import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, userFavouriteCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
export const POST = withApiAuthRequired(async function postFavourite(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
    return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
  }
  if (req.body) {
    const body = await readRequestBody(req.body);

    if (!body) {
      return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
    }
    else {
      if (!body.recipe)
        return NextResponse.json({ error: 'No recipe data passed' }, { status: 404 });
    }
    let result = new Result(true);
    const { user } = await getSession();
 
    try {
      // Validate if user exist
      let db = await dbRtns.getDBInstance();
      //user.sub is  unique id of each user
      let userExist = await dbRtns.findOne(db, userCollection, { sub: user.sub });

      if (isNotSet(userExist)) {
        return NextResponse.json({ error: 'User information not found' }, { status: 404 });
      }
      //adding extra fields to the favourite recipe documents
      const favouriteRecipe = body.recipe;
      delete favouriteRecipe._id;
      favouriteRecipe.sub = user.sub;
      favouriteRecipe.created_at = new Date().toISOString();
      favouriteRecipe.nickname = user.nickname;

      let favouriteExist = await dbRtns.findOne(db, userFavouriteCollection, { sub: body.user.sub, idDrink: body.recipe.idDrink });

      if (isSet(favouriteExist)) {
        result.setFalse("The recipe is already on your favourite list.")
        return NextResponse.json(result, { status: 201 });
      }
      await dbRtns.addOne(db, userFavouriteCollection, favouriteRecipe);

      result.setTrue(`The recipe has been added to your favourite!`);

    } catch (error) {
      return NextResponse.json({ error: 'Error saving the recipe to the favourite list' }, { status: 400 });
    }
    return NextResponse.json(result, { status: 201 });

  }
}
)

export const GET = withApiAuthRequired(async function GET(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
    return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
  }

  try {

    const { user } = await getSession();
   
    let db = await dbRtns.getDBInstance();

    let response = await dbRtns.findAll(db, userFavouriteCollection, { sub: user.sub }, {});

    //response is the object deleted
    const result = new Result(true);
    result.data = response;
    result.message = response.length > 0 ? `${response.length} recipes found!` : "No reciped found."
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 400 });

  }
});
