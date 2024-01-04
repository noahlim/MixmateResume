import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, recipeCollection, userFavouriteCollection } from "@/app/_utilities/_server/database/config";
export async function POST(req: NextRequest, res: NextResponse) {
  if (req.body) {
    const body = await readRequestBody(req.body);

    if (!body) {
      return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
    }
    else {
      if (!body.user)
        return NextResponse.json({ error: 'No user data passed' }, { status: 404 });
      if (!body.recipeId)
        return NextResponse.json({ error: 'No recipe data passed' }, { status: 404 });
    }
    let result = new Result(true);
    
    // Validate if user exist
    let db = await dbRtns.getDBInstance();

    //user.sub is  unique id of each user
    let userExist = await dbRtns.findOne(db, userCollection, { sub: body.user.sub });

    if (isNotSet(userExist)) {
      return NextResponse.json({ error: 'User information not found' }, { status: 404 });
    }

    let recipe = await dbRtns.findOne(db, recipeCollection, {idDrink : body.recipeId})
    if (isNotSet(userExist)) {
      return NextResponse.json({ error: 'Recipe information not found' }, { status: 404 });
    }
    const user = body.user;
    
    const favouriteRecipe = recipe;
    favouriteRecipe.sub = user.sub;
    favouriteRecipe.created_at = new Date().toISOString();
    favouriteRecipe.nickname = user.nickname;
    try {
      // Hash the password
      body.updatedOn = "";
      // Save the user with the hashed password
      await dbRtns.addOne(db, userFavouriteCollection, favouriteRecipe);

      result.setTrue(`User [${body.nickname} added!`);

    } catch (error) {
      // Handle potential errors in the hashing process
      return NextResponse.json({ error: 'Error saving the recipe to the favourite list' }, {status:400});
    }
    return NextResponse.json(result, { status: 201 });
   
  }
}
