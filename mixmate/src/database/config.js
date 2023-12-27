import { config } from "dotenv";
config();
export const atlas = process.env.DBURL;
export const appdb =  process.env.DB;
export const port = process.env.PORT;
export const graphql = process.env.GRAPHQLURL;
export const userCollection = process.env.USERCOLLECTION;
export const recipeCollection = process.env.RECIPECOLLECTION;
export const userRecipeCollection = process.env.USER_RECIPECOLLECTION;
export const userIngredientCollection = process.env.USER_INGREDIENTCOLLECTION;