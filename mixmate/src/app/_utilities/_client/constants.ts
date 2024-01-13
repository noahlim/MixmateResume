import { AlertColor } from '@mui/material/Alert';

const END_POINT = "http://localhost:3000/api";
const MIXMATE_DOMAIN = 'localhost';

const SEVERITY: Record<string, AlertColor> = {
  Info: 'info',
  Success: 'success',
  Warning: 'warning',
  Error: 'error'
};
const MAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const S3_BUCKET_URL = (fileName) =>
  `https://mixmatebucket.s3.us-east-2.amazonaws.com/${fileName}`;

const APPLICATION_PAGE =
{
  root: '/',
  home: '/',
  mongo: '/mongo',
  profile: '/profile',
  recipes: '/recipes',
  myMixMate: '/mymixmate',
  favourites: '/favourites',
  myRecipes: '/myrecipes',
  social: '/social',
  sharedPublic: '/sharedpublic',
  resetPassword: '/resetpassword'
}

const API_ROUTES = {
  user: '/user',
  password: '/user/password',
  login: '/api/auth/login',
  tokenVerify: '/verifytoken',
  logout: '/api/auth/logout',
  userJson: '/api/auth/me',
  drinks: '/drinks',
  favourite: '/user/favourite',
  drinkbyid: '/drinkbyid',
  mongoLogin: '/auth/loginmongo',
  recipeReviews: '/social/recipereviews',
  recipeShare: '/social/recipeshare',
  image: '/image'
}

const API_DRINK_ROUTES = {
  alcoholicTypes: 'alcoholicTypes',
  glassTypes: 'glassTypes',
  ingredients: 'ingredients',
  allRecipes: 'allRecipes',
  drinkCategories: 'drinkCategories',
  filteredDrinks: 'filteredDrinks'
}
const REQ_METHODS = {
  get: "GET" as "GET",
  post: "POST" as "POST",
  delete: "DELETE" as "DELETE",
  put: "PUT" as "PUT"
}
const ingredientsByAlcoholic = {
  Alcoholic: [
    "Light rum",
    "Applejack",
    "Gin",
    "Dark rum",
    "Sweet Vermouth",
    "Strawberry schnapps",
    "Scotch",
    "Apricot brandy",
    "Triple sec",
    "Southern Comfort",
    "Orange bitters",
    "Brandy",
    "Lemon vodka",
    "Blended whiskey",
    "Dry Vermouth",
    "Amaretto",
    "Champagne",
    "Coffee liqueur",
    "Bourbon",
    "Tequila",
    "Vodka",
    "Añejo Rum",
    "Añejo rum",
    "Aï¿½ejo rum",
    "Bitters",
    "Kahlua",
    "Dubonnet Rouge",
    "Irish whiskey",
    "Apple brandy",
    "Cherry brandy",
    "Creme de Cacao",
    "Grenadine",
    "Port",
    "Coffee brandy",
    "Red wine",
    "Rum",
    "Ricard",
    "Sherry",
    "Cognac",
    "Sloe gin",
    "Galliano",
    "Peach Vodka",
    "Ouzo",
    "Spiced rum",
    "Johnnie Walker",
    "Everclear",
    "Firewater",
    "Whiskey",
    "Absolut Citron",
    "Pisco",
    "Irish cream",
    "Chocolate liqueur",
    "Midori melon liqueur",
    "Sambuca",
    "Blackberry brandy",
    "Peppermint schnapps",
    "Creme de Cassis",
    "Lager",
    "Ale",
  ],
  Non_Alcoholic: [
    "Tea",
    "Sugar",
    "demerara Sugar",
    "Watermelon",
    "Lime juice",
    "Carbonated water",
    "Grapefruit juice",
    "Apple juice",
    "Pineapple juice",
    "Lemon juice",
    "Sugar syrup",
    "Milk",
    "Strawberries",
    "Chocolate syrup",
    "Yoghurt",
    "Mango",
    "Ginger",
    "Lime",
    "Cantaloupe",
    "Berries",
    "Grapes",
    "Kiwi",
    "Tomato juice",
    "Cocoa powder",
    "Chocolate",
    "Heavy cream",
    "Water",
    "Espresso",
    "Angelica root",
    "Orange",
    "Cranberries",
    "Apple cider",
    "Cranberry juice",
    "Egg yolk",
    "Egg",
    "Grape juice",
    "Peach nectar",
    "Lemon",
    "Lemonade",
    "Cider",
    "Sprite",
    "7-Up",
  ],
};
export { END_POINT, SEVERITY, MAIL_REGEX, APPLICATION_PAGE, MIXMATE_DOMAIN, ingredientsByAlcoholic, REQ_METHODS, API_ROUTES, API_DRINK_ROUTES, S3_BUCKET_URL }