import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, userFavouriteCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
export async function POST(req: NextRequest, res: NextResponse) {
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
      if (!body.user)
        return NextResponse.json({ error: 'No user data passed' }, { status: 404 });
      if (!body.recipe)
        return NextResponse.json({ error: 'No recipe data passed' }, { status: 404 });
    }
    let result = new Result(true);
    const user = body.user;

    try {
      // Validate if user exist
      let db = await dbRtns.getDBInstance();
      //user.sub is  unique id of each user
      let userExist = await dbRtns.findOne(db, userCollection, { sub: body.user.sub });

      if (isNotSet(userExist)) {
        return NextResponse.json({ error: 'User information not found' }, { status: 404 });
      } 
      //adding extra fields to the favourite recipe documents
      const favouriteRecipe = body.recipe;
      delete favouriteRecipe._id;
      favouriteRecipe.sub = user.sub;
      favouriteRecipe.created_at = new Date().toISOString();
      favouriteRecipe.nickname = user.nickname;
      favouriteRecipe.sub = user.sub;

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
