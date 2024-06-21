import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { recipeCollection, sharedRecipeCollection, userCollection, userFavouriteCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
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
    try {
      const { user } = await getSession();

      if (body.userId !== user.sub) {
        return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 400 });
      }

      // Validate if user exist
      let db = await dbRtns.getDBInstance();
      //add userIngredientDocument which is a collection of ingredients for each user if not found
      let userFavoriteDocument = await dbRtns.findOne(db, userFavouriteCollection, { sub: user.sub });
      const favouriteRecipe = body.recipe;
      favouriteRecipe.sub = user.sub;
      favouriteRecipe.created_at = new Date().toISOString();

      if (isNotSet(userFavoriteDocument)) {
        const tempFavouriteDocument = {
          sub: user.sub, favorites: [favouriteRecipe], created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        };
        await dbRtns.addOne(db, userFavouriteCollection, tempFavouriteDocument);
        result.data = tempFavouriteDocument.favorites;
      } else {
        if (userFavoriteDocument.favorites.some(favorite => favorite._id === body.recipe._id.toString())) {
          return NextResponse.json({ error: `${body.recipe.strDrink} already exists in your list.` }, { status: 400 });
        }

        const recipe = body.recipe;
        userFavoriteDocument.favorites.push(recipe);
        await dbRtns.updateOne(db, userFavouriteCollection, { sub: user.sub }, { favorites: userFavoriteDocument.favorites, updated_at: new Date().toISOString() });
        result.data = userFavoriteDocument.favorites;

      }

      result.message = `${body.recipe.strDrink} was added to your list successfully.`;
      return NextResponse.json(result, { status: 200 })

    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: 'Error saving the recipe to the favourite list' }, { status: 400 });
    }
  }
}
)

export const GET = withApiAuthRequired(async function getAllFavourites(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
    return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
  }

  try {

    const { user } = await getSession();
    const pageNumber = parseInt(req.nextUrl.searchParams.get('index'));
  
    let db = await dbRtns.getDBInstance();


    //let recipes = await dbRtns.findAllWithPagination(db, userFavouriteCollection, { sub: user.sub }, {}, pageNumber ? pageNumber : 1, 5);
    let userFavouriteDocument = await dbRtns.findOne(db, userFavouriteCollection, { sub: user.sub });
    const result = new Result(true);

    if (isSet(userFavouriteDocument)) {
      let publicRecipes = await Promise.all(userFavouriteDocument.favorites.map(async (recipe) => {
        //check if the recipe is in the shared collection, 
        //only recipes in the shared collection has an author
        let collection = isSet(recipe.strAuthor) ? sharedRecipeCollection : recipeCollection;
        const foundRecipe = await dbRtns.findOne(db, collection, { _id: new ObjectId(recipe._id) });
        return foundRecipe;
      }));


      let recipes = publicRecipes.slice((pageNumber - 1) * 5, pageNumber * 5);


      const data = { recipes, allRecipes: publicRecipes, length: publicRecipes.length };

      //response is the object deleted
      result.data = data;
      result.message = userFavouriteDocument.favorites.length > 0 ? `${userFavouriteDocument.favorites.length} recipes found!` : "No reciped found."
      return NextResponse.json(result, { status: 200 })
    } else {
      const tempFavouriteDocument = {
        sub: user.sub, favorites: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      };
      await dbRtns.addOne(db, userFavouriteCollection, tempFavouriteDocument);
      result.data = tempFavouriteDocument.favorites;
      result.message = tempFavouriteDocument.favorites.length > 0 ? `${tempFavouriteDocument.favorites.length} recipes found!` : "No reciped found."
      return NextResponse.json(result, { status: 200 })
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err.message }, { status: 400 });

  }
});
export const DELETE = withApiAuthRequired(async function deleteFavourite(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
    return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
  }

  const drinkId = new ObjectId(req.nextUrl.searchParams.get('_id'));
  const userId = new ObjectId(req.nextUrl.searchParams.get('userId'));


  if (!drinkId) {
    return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
  }
  const { user } = await getSession();

  try {
    const { user } = await getSession();

    if (userId !== user.sub) {
      return NextResponse.json({ error: 'Unauthorized user access.' }, { status: 400 });
    }

    let db = await dbRtns.getDBInstance();

    let response = await dbRtns.findOne(db, userFavouriteCollection, { sub: userId });
    if (!response) {
      return NextResponse.json({ error: 'User does not exist.' }, { status: 404 })
    }
    //when the unique id of the user and the id of the user who created
    //the favourite list do not match    
    if (user.sub !== response.sub) {
      return NextResponse.json({ error: "The user is not authorized to delete this recipe." }, { status: 401 });
    }

    const updatedFavoriteList = response.favorites.filter(favorite => favorite._id !== drinkId);
    response = await dbRtns.updateOne(db, userFavouriteCollection, { sub: userId }, { favorites: updatedFavoriteList, updated_at: new Date().toISOString() });

    if (response) {
      const result = new Result(true);
      result.message = "Selected recipe has been deleted successfully";
      return NextResponse.json(result, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 400 });

  }

});
