"use client";
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
        background: "rgba(26, 26, 46, 0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      className="font-primary"
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            "&:hover": { transform: "scale(1.05)" },
            transition: "transform 0.2s ease",
          }}
          onClick={() => {
            handlePageChange(APPLICATION_PAGE.home);
            handleDrawerToggle();
          }}
        >
          <BiDrink size={32} color="var(--accent-gold)" />
          <Typography
            variant="h6"
            className="text-gradient font-display font-bold"
            sx={{ fontSize: "1.25rem" }}
          >
            MixMate
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: "var(--white)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.1)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <IoMdCloseCircle fontSize={25} />
        </IconButton>
      </Box>

      <List sx={{ pt: 3 }}>
        {pages.map((page) => (
          <ListItem key={page.page} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => {
                handlePageChange(page.route);
                handleDrawerToggle();
              }}
              sx={{
                mx: 2,
                borderRadius: "12px",
                background: isActive(page.route)
                  ? "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1))"
                  : "transparent",
                color: isActive(page.route)
                  ? "var(--accent-gold)"
                  : "var(--gray-200)",
                border: isActive(page.route)
                  ? "1px solid rgba(255, 215, 0, 0.3)"
                  : "1px solid transparent",
                "&:hover": {
                  background: isActive(page.route)
                    ? "linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.2))"
                    : "rgba(255, 255, 255, 0.1)",
                  transform: "translateX(4px)",
                },
                transition: "all 0.3s ease",
                py: 2,
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
                    fontWeight: isActive(page.route) ? 600 : 500,
                    fontFamily: "var(--font-primary)",
                    fontSize: "1rem",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {user && (
        <>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }} />
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
                    mx: 2,
                    borderRadius: "12px",
                    color: "var(--accent-orange)",
                    "&:hover": {
                      background: "rgba(255, 107, 53, 0.1)",
                      transform: "translateX(4px)",
                    },
                    transition: "all 0.3s ease",
                    py: 2,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    className="font-primary"
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: 500,
                        fontFamily: "var(--font-primary)",
                        fontSize: "1rem",
                      },
                    }}
                  />
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
        position="static"
        sx={{
          background: "#1a1a2e",
          color: "#ffd700",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo and Desktop Navigation */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                  filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
                },
                transition: "all 0.3s ease",
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
                      ? "var(--accent-gold)"
                      : "var(--gray-200)",
                    background: isActive(page.route)
                      ? "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1))"
                      : "transparent",
                    borderRadius: "12px",
                    px: 3,
                    py: 1.5,
                    fontWeight: isActive(page.route) ? 600 : 500,
                    border: isActive(page.route)
                      ? "1px solid rgba(255, 215, 0, 0.3)"
                      : "1px solid transparent",
                    "&:hover": {
                      background: isActive(page.route)
                        ? "linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.2))"
                        : "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                    },
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontFamily: "var(--font-primary)",
                    fontSize: "0.95rem",
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
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "var(--white)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    display: { xs: "none", sm: "flex" },
                    fontFamily: "var(--font-primary)",
                    fontWeight: 500,
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.15)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                />
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    color: "var(--white)",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.1)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Avatar
                    src={user.picture}
                    alt={user.name || "User"}
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid var(--accent-gold)",
                      boxShadow: "0 0 10px rgba(255, 215, 0, 0.3)",
                    }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      background: "rgba(26, 26, 46, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      mt: 1,
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleProfileMenuClose}
                    sx={{
                      fontFamily: "var(--font-primary)",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon sx={{ color: "var(--accent-gold)" }} />
                    </ListItemIcon>
                    <Typography className="font-primary">Profile</Typography>
                  </MenuItem>
                  <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
                  <MenuItem
                    onClick={() => {
                      dispatch(userInfoActions.setUserInfo(null));
                      handleProfileMenuClose();
                    }}
                    sx={{
                      fontFamily: "var(--font-primary)",
                      color: "var(--accent-orange)",
                      "&:hover": {
                        background: "rgba(255, 107, 53, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon sx={{ color: "var(--accent-orange)" }} />
                    </ListItemIcon>
                    <Typography className="font-primary">Logout</Typography>
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
                  borderRadius: "12px",
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  fontFamily: "var(--font-primary)",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    background: "var(--secondary-gradient)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                  },
                  transition: "all 0.3s ease",
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
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
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
        }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Toast Messages */}
      <Snackbar
        open={toastMessage.open}
        autoHideDuration={6000}
        onClose={() =>
          dispatch(
            pageStateActions.setToastMessage({
              ...toastMessage,
              open: false,
            })
          )
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() =>
            dispatch(
              pageStateActions.setToastMessage({
                ...toastMessage,
                open: false,
              })
            )
          }
          severity={toastMessage.severity}
          sx={{
            width: "100%",
            fontFamily: "var(--font-primary)",
            borderRadius: "12px",
          }}
        >
          <AlertTitle className="font-primary">{toastMessage.title}</AlertTitle>
          {toastMessage.message}
        </Alert>
      </Snackbar>

      {/* Authentication Modal */}
      <Dialog
        open={isAuthModalOpen}
        onClose={() =>
          dispatch(pageStateActions.setAuthenticatedModalOpen(false))
        }
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
        <DialogTitle className="font-primary">
          Authentication Required
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="font-primary">
            Please sign in to access this feature.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              dispatch(pageStateActions.setAuthenticatedModalOpen(false))
            }
            sx={{
              color: "var(--gray-300)",
              fontFamily: "var(--font-primary)",
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
              borderRadius: "8px",
              fontFamily: "var(--font-primary)",
              "&:hover": {
                background: "var(--secondary-gradient)",
              },
            }}
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MenuBar;
