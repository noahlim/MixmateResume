import React, { useState } from "react";
import {
  APPLICATION_PAGE,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  Avatar,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import AddEditRecipe_Component from "../AddEditRecipe_Component";
import { useDispatch } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ToastMessage } from "interface/toastMessage";
import RecipeComponentRow from "./RecipeComponentRow";
import SharingDialog from "./SharingDialog";
import {
  MdEdit,
  MdDelete,
  MdShare,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { BiDrink, BiTime, BiStar } from "react-icons/bi";
import { useRouter } from "next/navigation";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import CommentSection from "./CommentSection";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaEarthAmericas } from "react-icons/fa6";
import DeleteIcon from "@mui/icons-material/Delete";

function RecipeDetailModal({ open, onClose, recipe, applicationPage }) {
  if (!recipe) return null;
  const image = recipe.strDrinkThumb || recipe.image || "/not-found-icon.png";
  const name = recipe.strDrink || recipe.name || "Unnamed Recipe";
  const category = recipe.category || recipe.strCategory || "Cocktail";
  const alcoholic = recipe.alcoholic || recipe.strAlcoholic || "Alcoholic";
  const glass = recipe.glass || recipe.strGlass || "Cocktail glass";
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.strInstructions || recipe.instructions || "";
  const userAvatar = recipe.userPictureUrl || recipe.authorAvatar || null;
  const userName =
    recipe.userNickname ||
    recipe.authorName ||
    recipe.author ||
    recipe.userName ||
    recipe.nickname ||
    recipe.strAuthor ||
    "Unknown";
  const reviews = recipe.reviews || [];
  const numRatings = reviews.length;
  const avgRating =
    numRatings > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / numRatings
      : 0;

  // Check if this is a user-created recipe (has user info)
  const isUserRecipe =
    userName && userName !== "Unknown" && userName !== "www.cocktaildb.com";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          p: 3,
          position: "relative",
          background: "#181a2e",
          color: "#fff",
          borderRadius: 2,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* User info section - always show nickname/author if available */}
        {applicationPage === APPLICATION_PAGE.social && userName && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 2,
              background:
                "linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)",
              borderBottom: "2px solid rgba(255, 215, 0, 0.3)",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Avatar
              src={userAvatar}
              alt={userName}
              sx={{
                width: 36,
                height: 36,
                border: "2px solid #ffd700",
                boxShadow: "0 0 10px rgba(255, 215, 0, 0.3)",
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#ffd700",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Posted by
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#ffd700",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                {userName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
              <StarIcon sx={{ color: "#FFD700", fontSize: 20, ml: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#FFD700",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                {avgRating.toFixed(1)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#fff", ml: 0.5, fontSize: "0.8rem" }}
              >
                ({numRatings || "No ratings yet"})
              </Typography>
            </Box>
          </Box>
        )}

        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: 700, textAlign: "center", color: "#ffd700" }}
        >
          {name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 3,
            mb: 2,
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={name}
            sx={{
              width: 220,
              height: 220,
              borderRadius: 4,
              objectFit: "cover",
              background: "#eee",
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ color: "#ffd700", mb: 1 }}>
              Category
            </Typography>
            <Typography sx={{ mb: 1, color: "#fff" }}>{category}</Typography>
            <Typography variant="subtitle2" sx={{ color: "#ffd700", mb: 1 }}>
              Alcoholic type
            </Typography>
            <Typography sx={{ mb: 1, color: "#fff" }}>{alcoholic}</Typography>
            <Typography variant="subtitle2" sx={{ color: "#ffd700", mb: 1 }}>
              Glass
            </Typography>
            <Typography sx={{ mb: 1, color: "#fff" }}>{glass}</Typography>
          </Box>
        </Box>
        <Typography variant="subtitle2" sx={{ color: "#ffd700", mb: 1 }}>
          Ingredients:
        </Typography>
        <Box sx={{ mb: 2 }}>
          {ingredients.map((ing, idx) => {
            let ingName = "";
            let measure = "";
            if (typeof ing === "string") {
              ingName = ing;
            } else if (ing && typeof ing === "object") {
              ingName = ing.ingredient || ing.name || "";
              measure = ing.measure || "";
            }
            return (
              <Typography key={idx} sx={{ color: "#fff" }}>
                {ingName}{" "}
                {measure && <i style={{ color: "#ffd700" }}>({measure})</i>}
              </Typography>
            );
          })}
        </Box>
        <Typography variant="subtitle2" sx={{ color: "#ffd700", mb: 1 }}>
          How to prepare:
        </Typography>
        <Typography sx={{ mb: 2, color: "#fff" }}>{instructions}</Typography>

        {/* Comments section - only show for user recipes */}
        {applicationPage === APPLICATION_PAGE.social && (
          <Box sx={{ mt: 4 }}>
            <CommentSection
              reviews={reviews}
              handleReviewRemoveClick={() => {}}
              textColor="#fff"
              recipeId={recipe._id || recipe.id || recipe.recipeid}
              reloadRecipes={() => {}}
            />
          </Box>
        )}
      </Box>
    </Dialog>
  );
}

const RecipeComponent = ({ applicationPage, recipes, reloadRecipes }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isEditablePage =
    applicationPage === APPLICATION_PAGE.favourites ||
    applicationPage === APPLICATION_PAGE.myRecipes;

  const { user, error, isLoading } = useUser();

  const [sharingUrl, setSharingUrl] = useState("");
  // Delete recipes
  const [modalDeleteRecipeOpen, setModalDeleteRecipeOpen] = useState(false);
  const [infoRecipeToDelete, setInfoRecipeToDelete] = useState(null);
  let handleModalDelteRecipeOpen = (id, recipeName) => {
    console.log("Opening delete modal for recipe:", { id, recipeName });
    console.log("Recipe ID type:", typeof id);
    console.log("Recipe ID value:", id);

    // Find the complete recipe data from the recipes
    const recipe = recipes.find((r) => r._id === id || r.id === id);
    console.log("Found recipe data:", recipe);

    if (recipe) {
      setInfoRecipeToDelete(recipe);
    } else {
      // Fallback to just the ID if recipe not found
      setInfoRecipeToDelete({ _id: id, recipeName });
    }
    setModalDeleteRecipeOpen(true);
  };
  const [openAddEditRecipeModal, setOpenAddEditRecipemodal] = useState(false);
  const [selectedRecipeIdAddEdit, setSelectedRecipeIdAddEdit] = useState(null);

  let handleAddEditRecipeModalOpen = (selectedRecipeId) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    setSelectedRecipeIdAddEdit(selectedRecipeId);
    setOpenAddEditRecipemodal(true);
  };
  let modalAddEditRecipe_onClose = () => {
    setSelectedRecipeIdAddEdit(null);
    setOpenAddEditRecipemodal(false);
  };

  let handleRemoveRecipeClick = () => {
    console.log("Delete clicked for recipe:", infoRecipeToDelete);
    console.log("Recipe data:", {
      _id: infoRecipeToDelete._id,
      id: infoRecipeToDelete.id,
      recipeid: infoRecipeToDelete.recipeid,
      strDrink: infoRecipeToDelete.strDrink,
      name: infoRecipeToDelete.name,
    });
    dispatch(pageStateActions.setPageLoadingState(true));

    // Different API endpoints for different pages
    let apiEndpoint;
    let requestData;

    if (applicationPage === APPLICATION_PAGE.favourites) {
      // For favorites, use the favorites delete endpoint
      const recipeId =
        infoRecipeToDelete._id?.toString() || infoRecipeToDelete._id;
      console.log("Deleting from favorites with ID:", recipeId);
      apiEndpoint = API_ROUTES.favourite;
      requestData = { recipeId: recipeId };
    } else {
      // For my recipes and social, use the recipe share delete endpoint
      const recipeId =
        infoRecipeToDelete._id?.toString() || infoRecipeToDelete._id;
      console.log("Deleting from recipes with ID:", recipeId);
      apiEndpoint = API_ROUTES.recipeShare;
      requestData = { _id: recipeId };
    }

    console.log(
      "Making delete request to:",
      apiEndpoint,
      "with data:",
      requestData
    );

    makeRequest(
      apiEndpoint,
      REQ_METHODS.delete,
      requestData,
      (response) => {
        console.log("Delete successful:", response);
        const toastMessageObject = {
          title: "Recipes",
          message: response.message,
          severity: SEVERITY.Success,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
        setInfoRecipeToDelete(null);
        setModalDeleteRecipeOpen(false);
        dispatch(pageStateActions.setPageLoadingState(false));
        // Refresh the page to show updated data
        window.location.reload();
      },
      (error) => {
        console.error("Delete failed:", error);
        const toastMessageObject = {
          title: "Error",
          message: error.message || "Failed to delete recipe",
          severity: SEVERITY.Error,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
        setInfoRecipeToDelete(null);
        setModalDeleteRecipeOpen(false);
        dispatch(pageStateActions.setPageLoadingState(false));
      }
    );
  };

  // Share recipes
  const [modalShareRecipeOpen, setModalShareRecipeOpen] = useState(false);
  const [selectedRecipeToShare, setSelectedRecipeToShare] = useState(null);
  const handleModalShareRecipeOpen = (drink) => {
    setSelectedRecipeToShare(drink);
    setModalShareRecipeOpen(true);
  };

  let handleRecipeVisibility = (drink) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    const newRecipeObject = JSON.parse(JSON.stringify(drink));
    newRecipeObject.visibility =
      newRecipeObject.visibility === "public" ? "private" : "public";
    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.put,
      { recipe: newRecipeObject },
      (response) => {
        setModalShareRecipeOpen(false);
        const toastMessageObject: ToastMessage = {
          title: "Visibility updated",
          message: "The recipe visibility has been updated successfully.",
          severity: SEVERITY.Success,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));

        // Reload recipes list
        reloadRecipes();
      }
    )
      .catch((err) => {
        displayErrorSnackMessage(err, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Add to favorites function
  let handleAddToFavorite = (recipe) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.post,
      { recipeId: recipe._id || recipe.id },
      (response) => {
        const toastMessageObject = {
          title: "Favorites",
          message: response.message,
          severity: SEVERITY.Success,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
        dispatch(pageStateActions.setPageLoadingState(false));

        // Refresh the page to show the updated favorites list
        if (applicationPage === APPLICATION_PAGE.favourites) {
          window.location.reload();
        }
      },
      (error) => {
        console.error("Add to favorites failed:", error);
        const toastMessageObject = {
          title: "Error",
          message: error.message || "Failed to add to favorites",
          severity: SEVERITY.Error,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
        dispatch(pageStateActions.setPageLoadingState(false));
      }
    );
  };

  // Share to community function
  const handleShareToCommunity = (recipe) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    // Prepare recipe data for sharing
    const recipeToShare = {
      ...recipe,
      visibility: "public",
      strDrinkThumb:
        recipe.strDrinkThumb ||
        recipe.image ||
        "https://mixmate2.s3.us-east-2.amazonaws.com/not-found-icon.png",
      sub: user?.sub || recipe.sub,
      nickname: user?.nickname || user?.name || recipe.nickname || "Unknown",
      strAuthor: user?.nickname || user?.name || recipe.strAuthor || "Unknown",
      strDrink:
        recipe.strDrink || recipe.name || recipe.label || "Unnamed Recipe",
      strCategory: recipe.strCategory || recipe.category || "Uncategorized",
      strAlcoholic: recipe.strAlcoholic || recipe.alcoholic || "Alcoholic",
      strGlass: recipe.strGlass || recipe.glass || "Cocktail glass",
      strInstructions: recipe.strInstructions || recipe.instructions || "",
      ingredients: recipe.ingredients || [],
    };

    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.post,
      {
        recipe: recipeToShare,
        filename: recipeToShare.strDrinkThumb,
      },
      (response) => {
        const toastMessageObject = {
          title: "Community",
          message: "Recipe shared to community successfully!",
          severity: SEVERITY.Success,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
        if (reloadRecipes) reloadRecipes();
        else if (setAllRecipes)
          setAllRecipes((prev) =>
            prev.map((r) =>
              r._id === recipe._id ? { ...r, visibility: "public" } : r
            )
          );
      }
    )
      .catch((err) => {
        displayErrorSnackMessage(err, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };

  if (!recipes || recipes.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8, px: 4 }}>
        <Typography
          variant="h6"
          className="font-semibold"
          sx={{ color: "var(--gray-400)", mt: 2, mb: 1 }}
        >
          No recipes found
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--gray-500)", maxWidth: "400px", mx: "auto" }}
        >
          {applicationPage === APPLICATION_PAGE.favourites
            ? "You haven't added any recipes to your favorites yet."
            : "Start creating your own cocktail recipes!"}
        </Typography>
      </Box>
    );
  }

  // Filter out public recipes from My Recipes
  const filteredRecipes = recipes;

  return (
    <>
      <Box className="font-primary">
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 3,
            mt: 2,
            justifyItems: "stretch",
            alignItems: "stretch",
          }}
        >
          {filteredRecipes.map((recipe, idx) => {
            const recipeId = recipe._id || recipe.id || recipe.recipeid;

            // Debug recipe ID
            if (
              applicationPage === APPLICATION_PAGE.myRecipes ||
              applicationPage === APPLICATION_PAGE.favourites
            ) {
              console.log(`Recipe ${recipe.strDrink || recipe.name}:`, {
                recipeId,
                recipeIdType: typeof recipeId,
                _id: recipe._id,
                id: recipe.id,
                recipeid: recipe.recipeid,
              });
            }

            const image =
              recipe.strDrinkThumb || recipe.image || "/not-found-icon.png";
            const name = recipe.strDrink || recipe.name || "Unnamed Recipe";
            const rating = recipe.avgRating || recipe.rating || 0;
            const numRatings =
              recipe.numRatings || (recipe.reviews ? recipe.reviews.length : 0);
            const userAvatar =
              recipe.userPictureUrl || recipe.authorAvatar || null;
            const userName =
              recipe.userNickname ||
              recipe.authorName ||
              recipe.author ||
              recipe.userName ||
              recipe.nickname ||
              recipe.strAuthor ||
              "Unknown";

            // Calculate recipe time and difficulty based on complexity
            const calculateRecipeTime = (ingredients, instructions) => {
              const ingredientCount = ingredients.length;
              const instructionLength = instructions ? instructions.length : 0;

              // Base time: 2 minutes for basic setup
              let baseTime = 2;

              // Add time for each ingredient (30 seconds each)
              baseTime += ingredientCount * 0.5;

              // Add time for complex instructions (1 minute per 100 characters)
              baseTime += Math.floor(instructionLength / 100);

              // Round to nearest 5 minutes, minimum 3 minutes
              const totalTime = Math.max(3, Math.ceil(baseTime / 5) * 5);
              return `${totalTime} min`;
            };

            const calculateDifficulty = (ingredients, instructions) => {
              const ingredientCount = ingredients.length;
              const instructionLength = instructions ? instructions.length : 0;

              if (ingredientCount <= 3 && instructionLength <= 200)
                return "Easy";
              if (ingredientCount <= 5 && instructionLength <= 400)
                return "Medium";
              return "Hard";
            };

            const generateDescription = (recipe) => {
              if (recipe.description) return recipe.description;

              const category =
                recipe.strCategory || recipe.category || "Cocktail";
              const alcoholic =
                recipe.strAlcoholic || recipe.alcoholic || "Alcoholic";
              const difficulty = calculateDifficulty(
                recipe.ingredients || [],
                recipe.strInstructions || recipe.instructions
              );

              const descriptions = {
                Easy: `A refreshing ${category.toLowerCase()} that's perfect for beginners.`,
                Medium: `A balanced ${category.toLowerCase()} with complex flavors.`,
                Hard: `An advanced ${category.toLowerCase()} for experienced mixologists.`,
              };

              return (
                descriptions[difficulty] ||
                `A delicious ${category.toLowerCase()} to enjoy.`
              );
            };

            const time = calculateRecipeTime(
              recipe.ingredients || [],
              recipe.strInstructions || recipe.instructions
            );
            const category =
              recipe.strCategory || recipe.category || "Cocktail";
            const difficulty = calculateDifficulty(
              recipe.ingredients || [],
              recipe.strInstructions || recipe.instructions
            );
            const description = generateDescription(recipe);
            const ingredients = recipe.ingredients || [];

            // Only show first 3 key ingredients
            const keyIngredients = ingredients.slice(0, 3).map((ing) => {
              if (typeof ing === "string") return ing;
              if (ing && typeof ing === "object")
                return ing.name || ing.ingredient || JSON.stringify(ing);
              return String(ing);
            });

            // Calculate average rating from reviews
            console.log("Recipe:", name, "Reviews:", recipe.reviews);
            const averageRating =
              recipe.reviews && recipe.reviews.length > 0
                ? (
                    recipe.reviews.reduce(
                      (acc, r) => acc + (r.rating || 0),
                      0
                    ) / recipe.reviews.length
                  ).toFixed(1)
                : "0.0";
            const reviewCount = recipe.reviews ? recipe.reviews.length : 0;

            // Check if this is a user-created recipe (has user info)
            const isUserRecipe =
              (userName &&
                userName !== "Unknown" &&
                userName !== "www.cocktaildb.com") ||
              (user && recipe.sub === user.sub) ||
              recipe.sub; // If recipe has a sub field, it's a user recipe

            // Check if this is the current user's recipe
            const isCurrentUserRecipe = user && recipe.sub === user.sub;

            // Debug logging
            if (
              applicationPage === APPLICATION_PAGE.myRecipes ||
              applicationPage === APPLICATION_PAGE.favourites
            ) {
              console.log(`Recipe: ${name}`, {
                isUserRecipe,
                isCurrentUserRecipe,
                userName,
                recipeSub: recipe.sub,
                userSub: user?.sub,
                applicationPage,
                isEditablePage,
              });
            }

            return (
              <Card
                key={recipeId || idx}
                className="recipe-card fade-in"
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.03)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                    borderColor: "var(--accent-gold)",
                  },
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 400,
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                }}
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setModalOpen(true);
                }}
              >
                {/* User info section - always show nickname/author if available */}
                {applicationPage === APPLICATION_PAGE.social && userName && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 2,
                      background:
                        "linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)",
                      borderBottom: "2px solid rgba(255, 215, 0, 0.3)",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  >
                    <Avatar
                      src={userAvatar}
                      alt={userName}
                      sx={{
                        width: 36,
                        height: 36,
                        border: "2px solid #ffd700",
                        boxShadow: "0 0 10px rgba(255, 215, 0, 0.3)",
                      }}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#ffd700",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Posted by
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#ffd700",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                        }}
                      >
                        {userName}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", ml: "auto" }}
                    >
                      <StarIcon
                        sx={{ color: "#FFD700", fontSize: 20, ml: 1 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#FFD700",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                        }}
                      >
                        {averageRating}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#fff", ml: 0.5, fontSize: "0.8rem" }}
                      >
                        {reviewCount > 0
                          ? `(${reviewCount})`
                          : "(No ratings yet)"}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <CardMedia
                  component="img"
                  image={image}
                  alt={name}
                  sx={{
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: isUserRecipe ? 0 : 16,
                    borderTopRightRadius: isUserRecipe ? 0 : 16,
                    background: "#eee",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log(`Image failed to load: ${image}`);
                    target.onerror = null;
                    target.src = "/not-found-icon.png";
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log(`Image loaded successfully: ${image}`);
                  }}
                />
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      className="font-heading"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        color: "var(--white)",
                        fontSize: "1.2rem",
                      }}
                    >
                      {name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <AccessTimeIcon
                        sx={{ fontSize: 18, color: "var(--accent-gold)" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--gray-300)", mr: 2 }}
                      >
                        {time}
                      </Typography>
                      {/* Only show rating for user recipes */}
                      {isUserRecipe && (
                        <>
                          <StarIcon
                            sx={{ fontSize: 18, color: "var(--accent-gold)" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "var(--gray-300)" }}
                          >
                            {rating.toFixed(1)}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--gray-200)", mb: 1 }}
                    >
                      {description}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      className="font-secondary"
                      sx={{ color: "var(--white)", mb: 0.5, fontWeight: 600 }}
                    >
                      Key Ingredients
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}
                    >
                      {keyIngredients.map((ing, i) => (
                        <Chip
                          key={i}
                          label={ing}
                          size="small"
                          className="ingredient-tag"
                          sx={{ fontSize: "0.75rem", height: "24px" }}
                        />
                      ))}
                      {ingredients.length > 3 && (
                        <Chip
                          label={`+${ingredients.length - 3} more`}
                          size="small"
                          className="ingredient-tag"
                          sx={{
                            fontSize: "0.75rem",
                            height: "24px",
                            background: "rgba(255, 215, 0, 0.2)",
                            borderColor: "var(--accent-gold)",
                            color: "var(--accent-gold)",
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Action buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Chip
                        label={category}
                        size="small"
                        sx={{
                          background: "rgba(139, 92, 246, 0.2)",
                          border: "1px solid rgba(139, 92, 246, 0.3)",
                          color: "var(--accent-purple)",
                          fontSize: "0.75rem",
                        }}
                      />
                      <Chip
                        label={difficulty}
                        size="small"
                        sx={{
                          background: "rgba(20, 184, 166, 0.2)",
                          border: "1px solid rgba(20, 184, 166, 0.3)",
                          color: "var(--accent-teal)",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>

                    {/* Action buttons */}
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {/* Favorite button */}
                      {applicationPage !== APPLICATION_PAGE.favourites && (
                        <Tooltip title="Add to favorites">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToFavorite(recipe);
                            }}
                            sx={{
                              color: "#ffd700",
                              background: "rgba(255, 215, 0, 0.1)",
                              "&:hover": {
                                background: "rgba(255, 215, 0, 0.2)",
                              },
                            }}
                          >
                            <FavoriteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* Share button */}
                      <Tooltip title="Share recipe">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleModalShareRecipeOpen(recipe);
                          }}
                          sx={{
                            color: "#ffd700",
                            background: "rgba(255, 215, 0, 0.1)",
                            "&:hover": {
                              background: "rgba(255, 215, 0, 0.2)",
                            },
                          }}
                        >
                          <MdShare fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* Share to Community button - show on my recipes page and social page for user recipes */}
                      {(applicationPage === APPLICATION_PAGE.myRecipes ||
                        applicationPage === APPLICATION_PAGE.social) &&
                        recipe.visibility !== "public" &&
                        !recipe.isApiRecipe && (
                          <Tooltip title="Share to Community">
                            <span>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareToCommunity(recipe);
                                }}
                                sx={{
                                  color: "#10b981",
                                  background: "rgba(16, 185, 129, 0.1)",
                                  "&:hover": {
                                    background: "rgba(16, 185, 129, 0.2)",
                                  },
                                }}
                                disabled={recipe.visibility === "public"}
                              >
                                <FaEarthAmericas fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}

                      {/* Edit button - only show on editable pages */}
                      {isEditablePage &&
                        isUserRecipe &&
                        !recipe.isApiRecipe && (
                          <Tooltip title="Edit recipe">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddEditRecipeModalOpen(recipeId);
                              }}
                              sx={{
                                color: "#ffd700",
                                background: "rgba(255, 215, 0, 0.1)",
                                "&:hover": {
                                  background: "rgba(255, 215, 0, 0.2)",
                                },
                              }}
                            >
                              <MdEdit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                      {/* Delete button - show on editable pages, favourites page, and social page for user's own recipes */}
                      {(() => {
                        const shouldShowDelete =
                          (isEditablePage &&
                            isUserRecipe &&
                            !recipe.isApiRecipe) ||
                          applicationPage === APPLICATION_PAGE.favourites ||
                          (applicationPage === APPLICATION_PAGE.social &&
                            isCurrentUserRecipe);

                        // Debug logging for delete button
                        if (
                          applicationPage === APPLICATION_PAGE.myRecipes ||
                          applicationPage === APPLICATION_PAGE.favourites
                        ) {
                          console.log(`Delete button for ${name}:`, {
                            shouldShowDelete,
                            isEditablePage,
                            isUserRecipe,
                            isApiRecipe: recipe.isApiRecipe,
                            applicationPage,
                            isCurrentUserRecipe,
                          });
                        }

                        return shouldShowDelete;
                      })() && (
                        <Tooltip
                          title={
                            applicationPage === APPLICATION_PAGE.favourites
                              ? "Remove from Favourites"
                              : "Delete recipe"
                          }
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalDelteRecipeOpen(recipeId, name);
                            }}
                            sx={{
                              color: "#ef4444",
                              background: "rgba(239, 68, 68, 0.1)",
                              "&:hover": {
                                background: "rgba(239, 68, 68, 0.2)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={modalDeleteRecipeOpen}
          onClose={() => setModalDeleteRecipeOpen(false)}
          PaperProps={{
            sx: {
              background: "rgba(26, 26, 46, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              color: "var(--white)",
            },
          }}
        >
          <DialogTitle className="font-primary">Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography className="font-primary">
              Are you sure you want to delete &quot;
              {infoRecipeToDelete?.recipeName}
              &quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setModalDeleteRecipeOpen(false)}
              sx={{
                color: "var(--gray-300)",
                fontFamily: "var(--font-primary)",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemoveRecipeClick}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "var(--white)",
                borderRadius: "8px",
                fontFamily: "var(--font-primary)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Recipe Modal */}
        <AddEditRecipe_Component
          openModal={openAddEditRecipeModal}
          closeModal={modalAddEditRecipe_onClose}
          recipeId={selectedRecipeIdAddEdit}
          reloadPage={reloadRecipes}
          applicationPage={applicationPage}
        />

        {/* Sharing Dialog */}
        <SharingDialog
          modalShareRecipeOpen={modalShareRecipeOpen}
          setModalShareRecipeOpen={setModalShareRecipeOpen}
          selectedRecipeToShare={selectedRecipeToShare}
          sharingUrl={sharingUrl}
          setSharingUrl={setSharingUrl}
        />
      </Box>
      <RecipeDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        recipe={selectedRecipe}
        applicationPage={applicationPage}
      />
    </>
  );
};

export default RecipeComponent;
