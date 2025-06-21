const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

// Database configuration
const DBURL = process.env.DBURL;
const DB = process.env.DB;
const RECIPECOLLECTION = process.env.RECIPECOLLECTION;
const INGREDIENTCOLLECTION = process.env.INGREDIENTCOLLECTION;

// TheCocktailDB API base URL
const COCKTAIL_DB_BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

async function fetchFromCocktailDbApi(parameter) {
  try {
    const response = await fetch(`${COCKTAIL_DB_BASE_URL}/${parameter}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`API Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching from API: ${error.message}`);
    return null;
  }
}

async function seedRecipes() {
  const client = new MongoClient(DBURL);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const db = client.db(DB);
    const recipeCollection = db.collection(RECIPECOLLECTION);
    const ingredientCollection = db.collection(INGREDIENTCOLLECTION);

    // Clear existing data
    console.log("Clearing existing recipes and ingredients...");
    await recipeCollection.deleteMany({});
    await ingredientCollection.deleteMany({});

    // Fetch and seed ingredients first
    console.log("Fetching ingredients from TheCocktailDB...");
    const ingredientsData = await fetchFromCocktailDbApi("list.php?i=list");

    if (ingredientsData && ingredientsData.drinks) {
      const ingredients = ingredientsData.drinks.map((item, index) => ({
        _id: index + 1,
        strIngredient1: item.strIngredient1,
        strDescription: item.strDescription || "",
        strType: item.strType || "",
        strAlcohol: item.strAlcohol || "",
        strABV: item.strABV || "",
      }));

      await ingredientCollection.insertMany(ingredients);
      console.log(`✅ Seeded ${ingredients.length} ingredients`);
    }

    // Fetch and seed recipes
    console.log("Fetching recipes from TheCocktailDB...");

    // Get popular cocktails (you can modify this to get different categories)
    const popularDrinks = [
      "margarita",
      "mojito",
      "daiquiri",
      "martini",
      "manhattan",
      "old_fashioned",
      "negroni",
      "gin_tonic",
      "whiskey_sour",
      "cosmopolitan",
      "bloody_mary",
      "pina_colada",
      "sex_on_the_beach",
      "long_island_ice_tea",
      "screwdriver",
      "moscow_mule",
      "paloma",
      "aperol_spritz",
      "espresso_martini",
    ];

    let totalRecipes = 0;

    for (const drink of popularDrinks) {
      console.log(`Fetching recipes for: ${drink}`);
      const recipeData = await fetchFromCocktailDbApi(`search.php?s=${drink}`);

      if (recipeData && recipeData.drinks) {
        const recipes = recipeData.drinks.map((drink) => {
          // Convert ingredients from strIngredient1, strIngredient2, etc. to an array
          const ingredients = [];
          for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
              ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure ? measure.trim() : "To taste",
              });
            }
          }

          return {
            idDrink: drink.idDrink,
            strDrink: drink.strDrink,
            strDrinkAlternate: drink.strDrinkAlternate || null,
            strTags: drink.strTags || null,
            strVideo: drink.strVideo || null,
            strCategory: drink.strCategory,
            strIBA: drink.strIBA || null,
            strAlcoholic: drink.strAlcoholic,
            strGlass: drink.strGlass,
            strInstructions: drink.strInstructions,
            strInstructionsES: drink.strInstructionsES || null,
            strInstructionsDE: drink.strInstructionsDE || null,
            strInstructionsFR: drink.strInstructionsFR || null,
            strInstructionsIT: drink.strInstructionsIT || null,
            strInstructionsZH_HANS: drink.strInstructionsZH_HANS || null,
            strInstructionsZH_HANT: drink.strInstructionsZH_HANT || null,
            strDrinkThumb: drink.strDrinkThumb,
            strIngredient1: drink.strIngredient1,
            strIngredient2: drink.strIngredient2,
            strIngredient3: drink.strIngredient3,
            strIngredient4: drink.strIngredient4,
            strIngredient5: drink.strIngredient5,
            strIngredient6: drink.strIngredient6,
            strIngredient7: drink.strIngredient7,
            strIngredient8: drink.strIngredient8,
            strIngredient9: drink.strIngredient9,
            strIngredient10: drink.strIngredient10,
            strIngredient11: drink.strIngredient11,
            strIngredient12: drink.strIngredient12,
            strIngredient13: drink.strIngredient13,
            strIngredient14: drink.strIngredient14,
            strIngredient15: drink.strIngredient15,
            strMeasure1: drink.strMeasure1,
            strMeasure2: drink.strMeasure2,
            strMeasure3: drink.strMeasure3,
            strMeasure4: drink.strMeasure4,
            strMeasure5: drink.strMeasure5,
            strMeasure6: drink.strMeasure6,
            strMeasure7: drink.strMeasure7,
            strMeasure8: drink.strMeasure8,
            strMeasure9: drink.strMeasure9,
            strMeasure10: drink.strMeasure10,
            strMeasure11: drink.strMeasure11,
            strMeasure12: drink.strMeasure12,
            strMeasure13: drink.strMeasure13,
            strMeasure14: drink.strMeasure14,
            strMeasure15: drink.strMeasure15,
            strImageSource: drink.strImageSource || null,
            strImageAttribution: drink.strImageAttribution || null,
            strCreativeCommonsConfirmed:
              drink.strCreativeCommonsConfirmed || null,
            dateModified: drink.dateModified || null,
            ingredients: ingredients,
            // Add metadata for your app
            source: "thecocktaildb",
            seededAt: new Date().toISOString(),
            visibility: "public",
          };
        });

        await recipeCollection.insertMany(recipes);
        totalRecipes += recipes.length;
        console.log(`✅ Added ${recipes.length} recipes for ${drink}`);

        // Add a small delay to be respectful to the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Also fetch some random cocktails
    console.log("Fetching random cocktails...");
    for (let i = 0; i < 10; i++) {
      const randomData = await fetchFromCocktailDbApi("random.php");
      if (randomData && randomData.drinks && randomData.drinks[0]) {
        const drink = randomData.drinks[0];

        // Check if recipe already exists
        const existing = await recipeCollection.findOne({
          idDrink: drink.idDrink,
        });
        if (!existing) {
          const ingredients = [];
          for (let j = 1; j <= 15; j++) {
            const ingredient = drink[`strIngredient${j}`];
            const measure = drink[`strMeasure${j}`];
            if (ingredient && ingredient.trim()) {
              ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure ? measure.trim() : "To taste",
              });
            }
          }

          const recipe = {
            idDrink: drink.idDrink,
            strDrink: drink.strDrink,
            strDrinkAlternate: drink.strDrinkAlternate || null,
            strTags: drink.strTags || null,
            strVideo: drink.strVideo || null,
            strCategory: drink.strCategory,
            strIBA: drink.strIBA || null,
            strAlcoholic: drink.strAlcoholic,
            strGlass: drink.strGlass,
            strInstructions: drink.strInstructions,
            strInstructionsES: drink.strInstructionsES || null,
            strInstructionsDE: drink.strInstructionsDE || null,
            strInstructionsFR: drink.strInstructionsFR || null,
            strInstructionsIT: drink.strInstructionsIT || null,
            strInstructionsZH_HANS: drink.strInstructionsZH_HANS || null,
            strInstructionsZH_HANT: drink.strInstructionsZH_HANT || null,
            strDrinkThumb: drink.strDrinkThumb,
            strIngredient1: drink.strIngredient1,
            strIngredient2: drink.strIngredient2,
            strIngredient3: drink.strIngredient3,
            strIngredient4: drink.strIngredient4,
            strIngredient5: drink.strIngredient5,
            strIngredient6: drink.strIngredient6,
            strIngredient7: drink.strIngredient7,
            strIngredient8: drink.strIngredient8,
            strIngredient9: drink.strIngredient9,
            strIngredient10: drink.strIngredient10,
            strIngredient11: drink.strIngredient11,
            strIngredient12: drink.strIngredient12,
            strIngredient13: drink.strIngredient13,
            strIngredient14: drink.strIngredient14,
            strIngredient15: drink.strIngredient15,
            strMeasure1: drink.strMeasure1,
            strMeasure2: drink.strMeasure2,
            strMeasure3: drink.strMeasure3,
            strMeasure4: drink.strMeasure4,
            strMeasure5: drink.strMeasure5,
            strMeasure6: drink.strMeasure6,
            strMeasure7: drink.strMeasure7,
            strMeasure8: drink.strMeasure8,
            strMeasure9: drink.strMeasure9,
            strMeasure10: drink.strMeasure10,
            strMeasure11: drink.strMeasure11,
            strMeasure12: drink.strMeasure12,
            strMeasure13: drink.strMeasure13,
            strMeasure14: drink.strMeasure14,
            strMeasure15: drink.strMeasure15,
            strImageSource: drink.strImageSource || null,
            strImageAttribution: drink.strImageAttribution || null,
            strCreativeCommonsConfirmed:
              drink.strCreativeCommonsConfirmed || null,
            dateModified: drink.dateModified || null,
            ingredients: ingredients,
            source: "thecocktaildb",
            seededAt: new Date().toISOString(),
            visibility: "public",
          };

          await recipeCollection.insertOne(recipe);
          totalRecipes++;
          console.log(`✅ Added random recipe: ${drink.strDrink}`);
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(`\n🎉 Seeding completed successfully!`);
    console.log(`📊 Total recipes added: ${totalRecipes}`);

    // Get final counts
    const recipeCount = await recipeCollection.countDocuments();
    const ingredientCount = await ingredientCollection.countDocuments();

    console.log(`📈 Database now contains:`);
    console.log(`   - ${recipeCount} recipes`);
    console.log(`   - ${ingredientCount} ingredients`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

// Run the seed function
seedRecipes().catch(console.error);
