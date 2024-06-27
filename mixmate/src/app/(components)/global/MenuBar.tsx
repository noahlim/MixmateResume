import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Avatar,
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";
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
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { BsInfoCircleFill } from "react-icons/bs";
import path from "path";
const pages = [
  { route: APPLICATION_PAGE.home, page: "Home" },
  { route: APPLICATION_PAGE.about, page: "About" },
  { route: APPLICATION_PAGE.recipes, page: "Recipes" },
  { route: APPLICATION_PAGE.myMixMate, page: "My MixMate" },
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

  const handlePageChange = (route: string) => {
    if (pathName === route) return;
    if (!user) {
      if (
        route === APPLICATION_PAGE.myMixMate ||
        route === APPLICATION_PAGE.favourites ||
        route === APPLICATION_PAGE.myIngredients ||
        route === APPLICATION_PAGE.myRecipes ||
        route === APPLICATION_PAGE.social
      )
        dispatch(pageStateActions.setAuthenticatedModalOpen(true));
      router.push(route);
      return;
    }
    if (route !== APPLICATION_PAGE.root && route !== APPLICATION_PAGE.about)
      dispatch(pageStateActions.setPageLoadingState(true));

    router.push(route);
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

  let loginControls = null;
  let userMenu = null;
  let [openUserMenu, setOpenUserMenu] = useState(false);
  const handleUserMenuOpen = () => {
    setOpenUserMenu(true);
  };
  // Set user's menu
  userMenu = (
    <Drawer
      anchor={"left"}
      open={openUserMenu}
      onClick={() => setOpenUserMenu(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem
            disablePadding
            sx={{ display: "flex", justifyContent: "end" }}
          >
            <ListItemButton onClick={() => setOpenUserMenu(false)}>
              <ListItemIcon>
                <IoMdCloseCircle
                  fontSize={25}
                  style={{ marginBottom: "4px" }}
                />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handlePageChange(APPLICATION_PAGE.home)}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handlePageChange(APPLICATION_PAGE.about)}
            >
              <ListItemIcon>
                <BsInfoCircleFill fontSize={21} fontWeight="bold" />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handlePageChange(APPLICATION_PAGE.recipes)}
            >
              <ListItemIcon>
                <LiaCocktailSolid fontSize={25} fontWeight="bold" />
              </ListItemIcon>
              <ListItemText primary="Recipes" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handlePageChange(APPLICATION_PAGE.favourites)}
            >
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="My MixMate" />
            </ListItemButton>
          </ListItem>
        </List>
        {user && (
          <>
            <Divider />
            <List>
              <ListItem disablePadding>
                <a href={API_ROUTES.logout}>
                  <ListItemButton
                    onClick={() => {
                      dispatch(userInfoActions.setUserInfo(null));
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Log Out"} />
                  </ListItemButton>
                </a>
              </ListItem>
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );

  if (isSet(user)) {
    // Set buttons for logout
    loginControls = (
      <Box display="flex">
        <a href={API_ROUTES.logout}>
          <Button
            color="inherit"
            onClick={() => {
              dispatch(userInfoActions.setUserInfo(null));
            }}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </a>
        <Box></Box>
        <Image
          src={user.picture ? user.picture : "/not-found-icon.png"}
          alt={user.email_verified ? user.name : user.nickname}
          width={40}
          height={40}
          style={{
            borderRadius: "50%",
            boxShadow: "5px 3px 5px rgba(1, 1, 1, 0.2)",
          }}
          loading="lazy"
        />
        {/* <Avatar
          src={`https://images.weserv.nl/?url=${encodeURIComponent(
            user.picture
          )}`}
          sx={{ boxShadow: "5px 3px 5px rgba(1, 1, 1, 0.2)" }}
        /> */}
      </Box>
    );
  } else {
    // No user session yet
    loginControls = (
      <>
        <a href={API_ROUTES.login}>
          <Button color="inherit" startIcon={<PersonIcon />}>
            Login
          </Button>
        </a>
      </>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <button
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 9999,
          backgroundColor: "#00C1F5",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "5px 3px 5px rgba(1, 1, 1, 0.2)",
        }}
        onClick={() => {
          window.scrollTo(0, 0);
        }}
      >
        <KeyboardDoubleArrowUpIcon />
      </button>

      <Snackbar
        open={toastMessage.open}
        autoHideDuration={3000}
        onClose={() => {
          dispatch(pageStateActions.setToastMessageClose());
        }}
      >
        <Alert severity={toastMessage.severity}>
          <AlertTitle>{toastMessage.title}</AlertTitle>
          {toastMessage.message}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={isAuthModalOpen}
        onClose={() =>
          dispatch(pageStateActions.setAuthenticatedModalOpen(false))
        }
        aria-labelledby="sign-in-dialog-title"
        aria-describedby="sign-in-dialog-description"
      >
        <DialogTitle id="sign-in-dialog-title" style={{ fontWeight: "bold" }}>
          Unlock the Epic MixMate Experience!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="sign-in-dialog-description"
            style={{ fontSize: "1.1rem" }}
          >
            Sign in to enjoy the most epic features uniquely provided by
            MixMate! Unleash a world of mind-blowing cocktail recipes and
            immersive mixology adventures like never before.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              dispatch(pageStateActions.setAuthenticatedModalOpen(false))
            }
            color="primary"
          >
            Maybe Later :(
          </Button>
          <Button
            onClick={() => (window.location.href = API_ROUTES.login)}
            sx={{ color: "#7FE0FA", marginLeft: "20px" }}
            autoFocus
          >
            Why not, let&apos;s go! Why not, let&apos;s go!
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar
        position="sticky"
        color="secondary"
        sx={{ borderBottom: "2px", borderColor: "black", top: "20px" }}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters sx={{ display: "flex" }}>
            {/*lOGO for md breakpoint*/}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Link href={APPLICATION_PAGE.home}>
                <Image
                  src="/mixmatelogomini.png"
                  alt="MixMate Logo"
                  decoding="async"
                  width={686}
                  height={364}
                  style={{ width: "100px" }}
                />
              </Link>
            </Box>
            {/*menu button in xs breakpoint*/}
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              {userMenu}
            </Box>
            {/*logo in xs breakpoint*/}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Link href={APPLICATION_PAGE.home}>
                <Image
                  src="/mixmatelogomini.png"
                  alt="MixMate Logo"
                  decoding="async"
                  width={686}
                  height={364}
                  style={{ width: "100px" }}
                />
              </Link>
            </Box>
            {/*navigation menu in md breakpoint*/}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <NavLink
                  key={page.page}
                  onClick={() => {
                    handlePageChange(page.route);
                  }}
                  isDropdown={page.route === APPLICATION_PAGE.myMixMate}
                  route={page.route}
                  handlePageChange={handlePageChange}
                >
                  {page.page}
                </NavLink>
              ))}
            </Box>
            {/*user menu in all breakpoints*/}
            <Box sx={{ flexGrow: 0, marginLeft: "auto" }}>{loginControls}</Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
export default MenuBar;
