import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Button,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Snackbar,
  Alert,
  AlertTitle,
  Backdrop,
  CircularProgress,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { notFound, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ToastMessage } from "interface/toastMessage";
import { userInfoActions } from "@lib/redux/userInfoSlice";
import { pageStateActions } from "@lib/redux/pageStateSlice";
import { isSet, makeRequest } from "@/app/_utilities/_client/utilities";
import {
  SEVERITY,
  APPLICATION_PAGE,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import { LiaCocktailSolid } from "react-icons/lia";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import NavLink from "@/app/(components)/global/NavLink";
import { IoMdCloseCircle } from "react-icons/io";
import { BsInfoCircleFill } from "react-icons/bs";
import { BiDrink } from "react-icons/bi";
import { MdRestaurantMenu } from "react-icons/md";

const pages = [
  { route: APPLICATION_PAGE.home, page: "Home", icon: <HomeIcon /> },
  {
    route: APPLICATION_PAGE.about,
    page: "About",
    icon: <BsInfoCircleFill fontSize={21} />,
  },
  {
    route: APPLICATION_PAGE.recipes,
    page: "Recipes",
    icon: <LiaCocktailSolid fontSize={25} />,
  },
  {
    route: APPLICATION_PAGE.myMixMate,
    page: "My MixMate",
    icon: <FavoriteIcon />,
  },
];

function MenuBar() {
  const pathName = usePathname();
  const userInfo = useSelector((state: any) => state.userInfo.userInfo);
  const isAuthModalOpen = useSelector(
    (state: any) => state.pageState.authenticatedModalOpen
  );
  const loadingPage = useSelector((state: any) => state.pageState.isLoading);
  const toastMessage: ToastMessage = useSelector(
    (state: any) => state.pageState.toastMessage
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading, error } = useUser();

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePageChange = (route: string) => {
    if (pathName === route) return;
    if (!user) {
      if (
        route === APPLICATION_PAGE.myMixMate ||
        route === APPLICATION_PAGE.favourites ||
        route === APPLICATION_PAGE.myIngredients ||
        route === APPLICATION_PAGE.myRecipes ||
        route === APPLICATION_PAGE.social
      ) {
        dispatch(pageStateActions.setAuthenticatedModalOpen(true));
        return;
      } else {
        router.push(route);
        return;
      }
    } else router.push(route);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    //if logged in successfully using Auth0, sync with MongoDB
    const loginHandleMongo = async (userInfoData) => {
      makeRequest(API_ROUTES.mongoLogin, REQ_METHODS.post, userInfoData).catch(
        (err) => {
          const toastMessageObject: ToastMessage = {
            open: true,
            message: err.message,
            severity: SEVERITY.Error,
            title: "Error",
          };
          dispatch(pageStateActions.setToastMessage(toastMessageObject));
        }
      );
    };
    if (!userInfo) {
      dispatch(userInfoActions.setUserInfo(user));

      if (error) {
        notFound();
      } else if (user) {
        loginHandleMongo(user);
      }
    }
  }, [userInfo, user, dispatch, error]);

  const isActive = (route: string) => pathName === route;

  // Mobile drawer content
  const drawer = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        background: "var(--glass-bg)",
        backdropFilter: "blur(16px)",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BiDrink size={32} color="var(--accent-gold)" />
          <Typography
            variant="h6"
            className="text-gradient font-display font-bold"
          >
            MixMate
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "var(--white)" }}>
          <IoMdCloseCircle fontSize={25} />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "var(--glass-border)" }} />

      <List sx={{ pt: 2 }}>
        {pages.map((page) => (
          <ListItem key={page.page} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                handlePageChange(page.route);
                handleDrawerToggle();
              }}
              sx={{
                mx: 1,
                borderRadius: 2,
                background: isActive(page.route)
                  ? "var(--accent-gradient)"
                  : "transparent",
                color: isActive(page.route)
                  ? "var(--white)"
                  : "var(--gray-200)",
                "&:hover": {
                  background: isActive(page.route)
                    ? "var(--accent-gradient)"
                    : "var(--glass-bg)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText
                primary={page.page}
                className="font-primary"
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: isActive(page.route) ? 600 : 400,
                    fontFamily: "var(--font-primary)",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {user && (
        <>
          <Divider sx={{ borderColor: "var(--glass-border)", my: 2 }} />
          <List>
            <ListItem disablePadding>
              <a
                href={API_ROUTES.logout}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <ListItemButton
                  onClick={() => {
                    dispatch(userInfoActions.setUserInfo(null));
                    handleDrawerToggle();
                  }}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    color: "var(--accent-orange)",
                    "&:hover": {
                      background: "var(--glass-bg)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" className="font-primary" />
                </ListItemButton>
              </a>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo and Desktop Navigation */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {/* Logo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.05)" },
                  transition: "transform 0.2s ease",
                }}
                onClick={() => handlePageChange(APPLICATION_PAGE.home)}
              >
                <BiDrink size={32} color="var(--accent-gold)" />
                <Typography
                  variant="h6"
                  className="text-gradient font-display font-bold"
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    fontWeight: 700,
                  }}
                >
                  MixMate
                </Typography>
              </Box>

              {/* Desktop Navigation */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                {pages.map((page) => (
                  <Button
                    key={page.page}
                    onClick={() => handlePageChange(page.route)}
                    sx={{
                      color: isActive(page.route)
                        ? "var(--white)"
                        : "var(--gray-200)",
                      background: isActive(page.route)
                        ? "var(--accent-gradient)"
                        : "transparent",
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontWeight: isActive(page.route) ? 600 : 400,
                      "&:hover": {
                        background: isActive(page.route)
                          ? "var(--accent-gradient)"
                          : "var(--glass-bg)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {page.icon}
                    {page.page}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* User Menu and Mobile Menu */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* User Avatar/Menu */}
              {user ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={`Welcome, ${
                      user.name || user.email?.split("@")[0] || "Mixologist"
                    }`}
                    sx={{
                      background: "var(--glass-bg)",
                      color: "var(--white)",
                      border: "1px solid var(--glass-border)",
                      display: { xs: "none", sm: "flex" },
                    }}
                  />
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      color: "var(--white)",
                      "&:hover": { background: "var(--glass-bg)" },
                    }}
                  >
                    <Avatar
                      src={user.picture}
                      alt={user.name || "User"}
                      sx={{
                        width: 40,
                        height: 40,
                        border: "2px solid var(--accent-gold)",
                      }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      sx: {
                        background: "var(--glass-bg)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: 2,
                        mt: 1,
                      },
                    }}
                  >
                    <MenuItem onClick={handleProfileMenuClose}>
                      <ListItemIcon>
                        <PersonIcon sx={{ color: "var(--accent-gold)" }} />
                      </ListItemIcon>
                      <Typography className="font-primary">Profile</Typography>
                    </MenuItem>
                    <Divider sx={{ borderColor: "var(--glass-border)" }} />
                    <MenuItem
                      onClick={() => {
                        dispatch(userInfoActions.setUserInfo(null));
                        handleProfileMenuClose();
                      }}
                    >
                      <a
                        href={API_ROUTES.logout}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <LogoutIcon sx={{ color: "var(--accent-orange)" }} />
                        <Typography className="font-primary">Logout</Typography>
                      </a>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button
                  href={API_ROUTES.login}
                  variant="contained"
                  sx={{
                    background: "var(--primary-gradient)",
                    color: "var(--white)",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    "&:hover": {
                      background: "var(--secondary-gradient)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: "none" },
                  color: "var(--white)",
                  "&:hover": { background: "var(--glass-bg)" },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            background: "transparent",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: "var(--accent-gold)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgba(0, 0, 0, 0.8)",
        }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Toast Messages */}
      <Snackbar
        open={toastMessage.open}
        autoHideDuration={6000}
        onClose={() => {
          dispatch(
            pageStateActions.setToastMessage({
              ...toastMessage,
              open: false,
            })
          );
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => {
            dispatch(
              pageStateActions.setToastMessage({
                ...toastMessage,
                open: false,
              })
            );
          }}
          severity={toastMessage.severity}
          sx={{
            width: "100%",
            background: "var(--glass-bg)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--glass-border)",
            color: "var(--white)",
          }}
        >
          <AlertTitle>{toastMessage.title}</AlertTitle>
          {toastMessage.message}
        </Alert>
      </Snackbar>

      {/* Authentication Modal */}
      <Dialog
        open={isAuthModalOpen}
        onClose={() => {
          dispatch(pageStateActions.setAuthenticatedModalOpen(false));
        }}
        PaperProps={{
          sx: {
            background: "var(--glass-bg)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--glass-border)",
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "var(--white)", textAlign: "center" }}>
          <BiDrink
            size={48}
            color="var(--accent-gold)"
            style={{ margin: "0 auto 16px", display: "block" }}
          />
          Welcome to MixMate
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ color: "var(--gray-200)", textAlign: "center", mb: 3 }}
          >
            Sign in to access your personalized cocktail experience, save
            favorites, and create your own recipes.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={() => {
              dispatch(pageStateActions.setAuthenticatedModalOpen(false));
            }}
            sx={{
              color: "var(--gray-300)",
              "&:hover": { background: "var(--glass-bg)" },
            }}
          >
            Cancel
          </Button>
          <Button
            href={API_ROUTES.login}
            variant="contained"
            sx={{
              background: "var(--primary-gradient)",
              color: "var(--white)",
              borderRadius: 2,
              px: 3,
              "&:hover": {
                background: "var(--secondary-gradient)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}

export default MenuBar;
