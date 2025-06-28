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

function RecipeDetailModal({ open, onClose, recipe }) {
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
    recipe.userNickname || recipe.authorName || recipe.author || "Unknown";
  const reviews = recipe.reviews || [];
  const numRatings = reviews.length;
  const avgRating =
    numRatings > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / numRatings
      : 0;
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            gap: 2,
          }}
        >
          <Avatar
            src={userAvatar}
            alt={userName}
            sx={{ width: 48, height: 48, border: "2px solid #ffd700" }}
          />
          <Typography variant="h5" sx={{ color: "#ffd700", fontWeight: 700 }}>
            {userName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <StarIcon sx={{ color: "#ffd700", fontSize: 24 }} />
            <Typography
              variant="body1"
              sx={{ color: "#ffd700", fontWeight: 600, ml: 0.5 }}
            >
              {avgRating.toFixed(1)}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff", ml: 1 }}>
              ({numRatings || "No ratings yet"})
            </Typography>
          </Box>
        </Box>
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
        <Box sx={{ mt: 4 }}>
          <CommentSection
            reviews={reviews}
            handleReviewRemoveClick={() => {}}
            textColor="#fff"
          />
        </Box>
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
    setInfoRecipeToDelete({ _id: id, recipeName });
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
    if (applicationPage === APPLICATION_PAGE.favourites) {
      dispatch(pageStateActions.setPageLoadingState(true));

      makeRequest(
        API_ROUTES.favourite,
        REQ_METHODS.delete,
        { recipeId: infoRecipeToDelete._id },
        (response) => {
          const toastMessageObject: ToastMessage = {
            title: "Favorites",
            message: response.message,
            severity: SEVERITY.Success,
            open: true,
          };
          dispatch(pageStateActions.setToastMessage(toastMessageObject));
          setInfoRecipeToDelete(null);
          setModalDeleteRecipeOpen(false);
          reloadRecipes();
        }
      )
        .catch((err) => {
          // Handle specific error cases
          if (
            err.message.includes("Recipe not found") ||
            err.message.includes("does not exist")
          ) {
            displayErrorSnackMessage(
              new Error(
                "This recipe has already been removed or no longer exists."
              ),
              dispatch
            );
            // Refresh the recipe list to sync with server state
            reloadRecipes();
          } else if (err.message.includes("429")) {
            displayErrorSnackMessage(
              new Error(
                "Too many requests. Please wait a moment and try again."
              ),
              dispatch
            );
          } else {
            displayErrorSnackMessage(err, dispatch);
          }
        })
        .finally(() => {
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    } else if (applicationPage === APPLICATION_PAGE.myRecipes) {
      dispatch(pageStateActions.setPageLoadingState(true));
      makeRequest(
        API_ROUTES.recipeShare,
        REQ_METHODS.delete,
        { _id: infoRecipeToDelete._id },
        (response) => {
          const toastMessageObject: ToastMessage = {
            title: "Recipes",
            message: response.message,
            severity: SEVERITY.Success,
            open: true,
          };

          dispatch(pageStateActions.setToastMessage(toastMessageObject));
          setInfoRecipeToDelete(null);
          setModalDeleteRecipeOpen(false);
          reloadRecipes();
        }
      )
        .catch((err) => {
          // Handle specific error cases
          if (
            err.message.includes("Recipe not found") ||
            err.message.includes("does not exist")
          ) {
            displayErrorSnackMessage(
              new Error(
                "This recipe has already been removed or no longer exists."
              ),
              dispatch
            );
            // Refresh the recipe list to sync with server state
            reloadRecipes();
          } else if (err.message.includes("429")) {
            displayErrorSnackMessage(
              new Error(
                "Too many requests. Please wait a moment and try again."
              ),
              dispatch
            );
          } else {
            displayErrorSnackMessage(err, dispatch);
          }
        })
        .finally(() => {
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    }
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
          {recipes.map((recipe, idx) => {
            const recipeId = recipe._id || recipe.id || recipe.recipeid;
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
              "Unknown";
            const time = recipe.time || recipe.prepTime || "5 min";
            const category = recipe.category || "Cocktail";
            const difficulty = recipe.difficulty || "Easy";
            const ingredients = recipe.ingredients || [];
            // Only show first 3 key ingredients
            const keyIngredients = ingredients.slice(0, 3).map((ing) => {
              if (typeof ing === "string") return ing;
              if (ing && typeof ing === "object")
                return ing.name || ing.ingredient || JSON.stringify(ing);
              return String(ing);
            });
            // Calculate average rating from reviews
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
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}
                >
                  <Avatar
                    src={userAvatar}
                    alt={userName}
                    sx={{ width: 32, height: 32, border: "2px solid #ffd700" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "#ffd700", fontWeight: 600 }}
                  >
                    {userName}
                  </Typography>
                  <StarIcon sx={{ color: "#FFD700", fontSize: 18, ml: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: "#FFD700", fontWeight: 600 }}
                  >
                    {averageRating}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#fff", ml: 0.5 }}>
                    {reviewCount > 0 ? `(${reviewCount})` : "(No ratings yet)"}
                  </Typography>
                </Box>
                <CardMedia
                  component="img"
                  image={image}
                  alt={name}
                  sx={{
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    background: "#eee",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/not-found-icon.png";
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
                      <StarIcon
                        sx={{ fontSize: 18, color: "var(--accent-gold)" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "var(--gray-300)" }}
                      >
                        {rating.toFixed(1)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--gray-200)", mb: 1 }}
                    >
                      {recipe.description ||
                        "A delicious cocktail recipe to enjoy."}
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
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
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
          open={modalShareRecipeOpen}
          onClose={() => setModalShareRecipeOpen(false)}
          recipe={selectedRecipeToShare}
          onVisibilityChange={handleRecipeVisibility}
        />
      </Box>
      <RecipeDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        recipe={selectedRecipe}
      />
    </>
  );
};

export default RecipeComponent;
