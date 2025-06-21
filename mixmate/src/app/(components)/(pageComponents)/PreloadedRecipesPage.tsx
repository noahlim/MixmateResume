"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  API_ROUTES,
  API_DRINK_ROUTES,
  REQ_METHODS,
  APPLICATION_PAGE,
  FILTER_CRITERIA,
} from "@/app/_utilities/_client/constants";
import {
  capitalizeWords,
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import {
  Pagination,
  Box,
  Chip,
  CardContent,
  Paper,
  Button,
} from "@mui/material";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import { useDispatch } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import FilterComponent from "@/app/(components)/FilterComponent";
import MarqueeAnimation from "@/app/(components)/(shapeComponents)/MarqueeAnimation";
import MyMixMateHeader from "@/app/(components)/MyMixMateHeader";
import { Space_Grotesk } from "next/font/google";
import RecipeComponent from "./RecipeComponent";
import AddEditRecipe_Component from "../AddEditRecipe_Component";
import { ToastMessage } from "interface/toastMessage";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
function DefaultRecipesComponent({ applicationPage }) {
  const { user, error, isLoading } = useUser();

  const [allRecipes, setAllRecipes] = useState([]);
  const [recipesFiltered, setRecipesFiltered] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGlasses, setSelectedGlasses] = useState<string[]>([]);
  const [selectedAlcoholic, setSelectedAlcohlic] = useState<string[]>([]);

  const [recipeName, setRecipeName] = useState<string>(null);
  const [selectedIngredientsList, setSelectedIngredientList] = useState<
    string[]
  >([]);
  const [selectedIngredientsInput, setSelectedIngredientsInput] =
    useState<string>("");
  const [isIngredientStringValid, setIsIngredientStringValid] =
    useState<boolean>(true);

  const [filterAndCriteria, setFilterAndCriteria] = useState<
    Array<{ filter: string; criteria: string }>
  >([]);

  const [filteringLogic, setFilteringLogic] = useState<string>("Or");
  const [openAddEditRecipeModal, setOpenAddEditRecipemodal] = useState(false);
  const [selectedRecipeIdAddEdit, setSelectedRecipeIdAddEdit] = useState(null);
  let modalAddEditRecipe_onOpen = (selectedRecipeId) => {
    setSelectedRecipeIdAddEdit(selectedRecipeId);
    setOpenAddEditRecipemodal(true);
  };
  let modalAddEditRecipe_onClose = () => {
    setSelectedRecipeIdAddEdit(null);
    setOpenAddEditRecipemodal(false);
  };
  const dispatch = useDispatch();

  //pagination
  const itemsPerPage = 5;
  const [pageIndex, setPageIndex] = useState(1);
  const [myRecipesFilterOnSocial, setMyRecipesFilterOnSocial] = useState(false);
  const handlePageIndexChange = (event, value) => {
    setPageIndex(value);
    setDisplayedRecipes(
      recipesFiltered?.slice((value - 1) * itemsPerPage, value * itemsPerPage)
    );
  };

  const [displayedRecipes, setDisplayedRecipes] = useState([]);

  const [pageHeader, setPageHeader] = useState(null);

  const updatePageHeader = () => {
    if (applicationPage === APPLICATION_PAGE.favourites) {
      setPageHeader(
        <MyMixMateHeader title="Favorites">
          The Favorites page is your personal collection where you can store and
          access your most beloved recipes with ease, ensuring that your mixes
          are always within reach whenever the craving strikes.
        </MyMixMateHeader>
      );
    } else if (applicationPage === APPLICATION_PAGE.social) {
      setPageHeader(
        <MyMixMateHeader title="Community Recipes">
          Embark on a mixing voyage of discovery through our vibrant community,
          where creative minds converge to share their inspired recipes,
          fostering a dynamic exchange of gastronomic artistry that transcends
          boundaries and ignites a passion for cocktail innovation.
        </MyMixMateHeader>
      );
    } else if (applicationPage === APPLICATION_PAGE.myRecipes) {
      setPageHeader(
        <MyMixMateHeader title="My Recipes">
          Explore your very own mixing canvas, a sanctuary where your inspired
          creations take center stage, allowing you to meticulously refine and
          perfect each recipe before unveiling your masterpieces to the world,
          leaving an indelible mark on the palates of fellow epicureans.
        </MyMixMateHeader>
      );
    } else {
      setPageHeader(
        <MyMixMateHeader title="Classic Recipes">
          Step into the world of mixology with confidence! This curated
          collection of classic and innovative cocktails serves as your personal
          recipe starter pack, providing a foundation for endless exploration
          and delicious experimentation.
        </MyMixMateHeader>
      );
    }
  };

  let loadAllRecipes = () => {
    dispatch(pageStateActions.setPageLoadingState(true));
    let apiRoute;
    let query;
    if (applicationPage === APPLICATION_PAGE.recipes) {
      query = { criteria: API_DRINK_ROUTES.allRecipes };
      apiRoute = API_ROUTES.drinks;
    } else if (applicationPage === APPLICATION_PAGE.favourites) {
      apiRoute = API_ROUTES.favourite;
      query = { index: pageIndex };
    } else if (applicationPage === APPLICATION_PAGE.myRecipes) {
      apiRoute = API_ROUTES.recipeShare;
      query = { publicflag: false, socialflag: false };
    } else if (applicationPage === APPLICATION_PAGE.social) {
      apiRoute = API_ROUTES.recipeShare;
      query = { publicflag: true, socialflag: true };
    }

    makeRequest(apiRoute, REQ_METHODS.get, query, (response) => {
      setAllRecipes(response.data.allRecipes);
      setRecipesFiltered(response.data.allRecipes);
      setDisplayedRecipes(response.data.allRecipes.slice(0, itemsPerPage));
    })
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
    // } else {
    //   dispatch(pageStateActions.setPageLoadingState(false));
    //   setRecipesFiltered(allRecipes);
    //   setDisplayedRecipes(allRecipes.slice(0, itemsPerPage));
    // }
  };

  const loadMyRecipes = () => {
    if (applicationPage === APPLICATION_PAGE.social) {
      if (!myRecipesFilterOnSocial) {
        const myRecipes = allRecipes
          .filter((recipe) => recipe.sub === user.sub)
          .sort((a, b) => b.created_at.localeCompare(a.created_at));
        setRecipesFiltered(myRecipes);
        setDisplayedRecipes(myRecipes.slice(0, itemsPerPage));
        setMyRecipesFilterOnSocial(true);
      } else {
        setRecipesFiltered(allRecipes || []);
        setDisplayedRecipes((allRecipes || []).slice(0, itemsPerPage));
        setMyRecipesFilterOnSocial(false);
      }
    } else {
      alert(
        "Invalid call, curate my recipes can only be called from community recipe page"
      );
    }
  };
  const loadFilteredRecipes = (
    newfilterAndCriteriaInput: Array<{ filter: string; criteria: string }>,
    filteringLogic: string = "Or"
  ) => {
    if (!allRecipes || allRecipes.length === 0) {
      loadAllRecipes();
      dispatch(pageStateActions.setPageLoadingState(false));
    } else if (newfilterAndCriteriaInput.length === 0) {
      setRecipesFiltered(allRecipes || []);
      setDisplayedRecipes((allRecipes || []).slice(0, itemsPerPage));
      dispatch(pageStateActions.setPageLoadingState(false));
    } else {
      let filteredRecipes;
      if (filteringLogic === "Or") {
        filteredRecipes = (allRecipes || []).filter((recipe) => {
          return newfilterAndCriteriaInput.some((filter) => {
            switch (filter.filter) {
              case FILTER_CRITERIA.category:
                return (
                  recipe.strCategory.toLowerCase() ===
                  filter.criteria.toLowerCase()
                );
              case FILTER_CRITERIA.alcoholic:
                return (
                  recipe.strAlcoholic.toLowerCase() ===
                  filter.criteria.toLowerCase()
                );
              case FILTER_CRITERIA.glass:
                return (
                  recipe.strGlass.toLowerCase() ===
                  filter.criteria.toLowerCase()
                );
              case FILTER_CRITERIA.ingredient:
                return recipe.ingredients.some((ing) =>
                  ing.ingredient
                    .toLowerCase()
                    .includes(filter.criteria.toLowerCase())
                );
              case FILTER_CRITERIA.recipeName:
                return recipe.strDrink
                  .toLowerCase()
                  .includes(filter.criteria.toLowerCase());
              default:
                return true;
            }
          });
        });
      } else if (filteringLogic === "And") {
        filteredRecipes = (allRecipes || []).filter((recipe) => {
          return newfilterAndCriteriaInput.every((filter) => {
            switch (filter.filter) {
              case FILTER_CRITERIA.category:
                return (
                  recipe.strCategory.toLowerCase() ===
                  filter.criteria.toLowerCase()
                );
              case FILTER_CRITERIA.alcoholic:
                return (
                  recipe.strAlcoholic.toLowerCase() ===
                  filter.criteria.toLowerCase()
                );
              case FILTER_CRITERIA.glass:
                return (
                  recipe.strGlass.toLowerCase() ===
                  filter.criteria.toLowerCase()
                );
              case FILTER_CRITERIA.ingredient:
                return recipe.ingredients.some(
                  (ing) =>
                    ing.ingredient.toLowerCase() ===
                    filter.criteria.toLowerCase()
                );
              case FILTER_CRITERIA.recipeName:
                return recipe.strDrink
                  .toLowerCase()
                  .includes(filter.criteria.toLowerCase());
              default:
                return true;
            }
          });
        });
      }

      setRecipesFiltered(filteredRecipes);
      setDisplayedRecipes(filteredRecipes.slice(0, itemsPerPage));
    }
  };

  useEffect(() => {
    loadAllRecipes();
    updatePageHeader();
    window.scrollTo(0, 0);
    //eslint-disable-next-line
  }, []);

  const onFilterClear = () => {
    setRecipesFiltered(allRecipes || []);
    setFilterAndCriteria([]);
  };

  const filterUpdate = (
    filterInput: any,
    filterType: string,
    isDelete: boolean = false
  ) => {
    const newfilterAndCriteria = [];
    let newRecipeName = "";
    //deleting recipe name filter to the filter list
    if (isDelete && filterType === FILTER_CRITERIA.recipeName) {
      setRecipeName(null);
      newRecipeName = null;
      //adding recipe name filter to the filter list
    } else if (!isDelete && filterType === FILTER_CRITERIA.recipeName) {
      setRecipeName(filterInput.criteria);
      newRecipeName = filterInput.criteria;
    } else {
      newRecipeName = recipeName;
    }

    if (newRecipeName) {
      newfilterAndCriteria.push({
        filter: FILTER_CRITERIA.recipeName,
        criteria: newRecipeName,
      });
    }

    //updating ingredient filters
    //
    let ingredientFilterList;

    //handling delete case
    if (isDelete && filterType === FILTER_CRITERIA.ingredient) {
      ingredientFilterList = [...selectedIngredientsList];
      ingredientFilterList = ingredientFilterList.filter(
        (ingredient) => ingredient.toLowerCase() !== filterInput.toLowerCase()
      );
      setSelectedIngredientList(ingredientFilterList);
      setSelectedIngredientsInput(ingredientFilterList.join(","));

      //handling add case
    } else if (!isDelete && filterType === FILTER_CRITERIA.ingredient) {
      ingredientFilterList = filterInput;
      setSelectedIngredientList(filterInput);
    } else ingredientFilterList = selectedIngredientsList;

    if (ingredientFilterList.length > 0)
      ingredientFilterList.forEach((ingredient) => {
        newfilterAndCriteria.push({
          filter: FILTER_CRITERIA.ingredient,
          criteria: ingredient,
        });
      });

    //updating category filters
    //
    let categoryFilterList;

    //handling delete case
    if (isDelete && filterType === FILTER_CRITERIA.category) {
      categoryFilterList = [...selectedCategories];
      categoryFilterList = categoryFilterList.filter(
        (cat) => cat.toLowerCase() !== filterInput.toLowerCase()
      );
      setSelectedCategories(categoryFilterList);

      //handling add case
    } else if (!isDelete && filterType === FILTER_CRITERIA.category) {
      categoryFilterList = filterInput;
      setSelectedCategories(filterInput);
    } else categoryFilterList = selectedCategories;

    if (categoryFilterList.length > 0)
      categoryFilterList.forEach((cat) => {
        newfilterAndCriteria.push({
          filter: FILTER_CRITERIA.category,
          criteria: cat,
        });
      });

    //updating glass filters
    //
    let glassFilterList;

    //handling delete case
    if (isDelete && filterType === FILTER_CRITERIA.glass) {
      glassFilterList = [...selectedGlasses];
      glassFilterList = glassFilterList.filter(
        (glass) => glass.toLowerCase() !== filterInput.toLowerCase()
      );
      setSelectedGlasses(glassFilterList);

      //handling add case
    } else if (!isDelete && filterType === FILTER_CRITERIA.glass) {
      glassFilterList = filterInput;
      setSelectedGlasses(filterInput);
    } else glassFilterList = selectedGlasses;

    if (glassFilterList.length > 0)
      glassFilterList.forEach((glass) => {
        newfilterAndCriteria.push({
          filter: FILTER_CRITERIA.glass,
          criteria: glass,
        });
      });

    //updating alcoholic filters
    //
    let alcoholicFilterList;

    //handling delete case
    if (isDelete && filterType === FILTER_CRITERIA.alcoholic) {
      alcoholicFilterList = [...selectedAlcoholic];
      alcoholicFilterList = alcoholicFilterList.filter(
        (alc) => alc.toLowerCase() !== filterInput.toLowerCase()
      );
      setSelectedAlcohlic(alcoholicFilterList);

      //handling add case
    } else if (!isDelete && filterType === FILTER_CRITERIA.alcoholic) {
      alcoholicFilterList = filterInput;
      setSelectedAlcohlic(filterInput);
    } else alcoholicFilterList = selectedAlcoholic;

    if (alcoholicFilterList.length > 0)
      alcoholicFilterList.forEach((alc) => {
        newfilterAndCriteria.push({
          filter: FILTER_CRITERIA.alcoholic,
          criteria: alc,
        });
      });

    //updating filter logic
    let tempFilterLogic = "Or";
    if (filterType === FILTER_CRITERIA.filterLogic) {
      tempFilterLogic = filterInput;
      setFilteringLogic(filterInput);
    } else {
      tempFilterLogic = filteringLogic;
    }

    //finally adding the new filter to the filter list
    setFilterAndCriteria(newfilterAndCriteria);
    loadFilteredRecipes(newfilterAndCriteria, tempFilterLogic);
  };
  const handleFilterLogicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLogic = event.target.value;
    setFilteringLogic(newLogic);

    if (filterAndCriteria.length > 0)
      filterUpdate(newLogic, FILTER_CRITERIA.filterLogic, false);
  };
  return (
    <>
      {(applicationPage === APPLICATION_PAGE.social ||
        applicationPage === APPLICATION_PAGE.myRecipes) && (
        <AddEditRecipe_Component
          openModal={openAddEditRecipeModal}
          closeModal={modalAddEditRecipe_onClose}
          reloadPage={loadAllRecipes}
          recipeId={selectedRecipeIdAddEdit}
          applicationPage={applicationPage}
        />
      )}
      {pageHeader}
      <Grid container spacing={2} sx={{ mt: 10 }}>
        <Grid item xs={12} md={4} lg={3}>
          {(applicationPage === APPLICATION_PAGE.myRecipes ||
            applicationPage === APPLICATION_PAGE.social) && (
            <Paper elevation={3} style={{ margin: 15 }}>
              <CardContent
                style={{
                  textAlign: "center",
                  paddingTop: 25,
                  paddingBottom: 25,
                }}
              >
                <Button
                  onClick={() => modalAddEditRecipe_onOpen(null)}
                  color="success"
                  variant="outlined"
                  startIcon={<NightlifeIcon />}
                  style={{ marginLeft: 7 }}
                >
                  Add a new recipe
                </Button>
              </CardContent>
            </Paper>
          )}
          <FilterComponent
            allRecipes={allRecipes}
            setFilterAndCriteria={setFilterAndCriteria}
            filterAndCriteria={filterAndCriteria}
            onFilterClear={onFilterClear}
            applicationPage={applicationPage}
            filterUpdate={filterUpdate}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedGlasses={selectedGlasses}
            setSelectedGlasses={setSelectedGlasses}
            selectedAlcoholic={selectedAlcoholic}
            setSelectedAlcohlic={setSelectedAlcohlic}
            selectedIngredientsList={selectedIngredientsList}
            setSelectedIngredientList={setSelectedIngredientList}
            selectedIngredientsInput={selectedIngredientsInput}
            setSelectedIngredientsInput={setSelectedIngredientsInput}
            isIngredientStringValid={isIngredientStringValid}
            setIsIngredientStringValid={setIsIngredientStringValid}
            recipeName={recipeName}
            setRecipeName={setRecipeName}
            filteringLogic={filteringLogic}
            setFilteringLogic={handleFilterLogicChange}
            loadMyRecipes={loadMyRecipes}
            myRecipesFilterOnSocial={myRecipesFilterOnSocial}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <div style={{ paddingLeft: 25, paddingRight: 25 }}>
            <>
              {filterAndCriteria.map((filter, index) => {
                return (
                  <Chip
                    onDelete={() => {
                      filterUpdate(filter.criteria, filter.filter, true);
                    }}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      m: 0.3,
                      "& .MuiChip-label": {
                        fontSize: "12px",
                        fontWeight: "bold",
                      },
                    }}
                    variant="outlined"
                    key={index}
                    label={`${capitalizeWords(
                      filter.filter
                    )} : ${capitalizeWords(filter.criteria)}`}
                    className={spaceGrotesk.className}
                  />
                );
              })}
            </>
            <RecipeComponent
              applicationPage={applicationPage}
              recipes={displayedRecipes}
              reloadRecipes={loadAllRecipes}
            />
          </div>
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={4}
      >
        <Pagination
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
          defaultPage={6}
          siblingCount={0}
          boundaryCount={2}
          color="primary"
          count={Math.ceil(recipesFiltered?.length / itemsPerPage)}
          page={pageIndex}
          onChange={handlePageIndexChange}
          sx={{
            "& .MuiPaginationItem-root": {
              backgroundColor: "#FFFFFF",
              marginBottom: 1,
            },
          }}
        />
      </Box>
      <MarqueeAnimation direction="left" />
    </>
  );
}

export default DefaultRecipesComponent;
