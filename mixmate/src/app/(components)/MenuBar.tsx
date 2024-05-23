import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
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
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";
import { useRouter, notFound } from "next/navigation";
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
import NavLink from "@/app/(components)/NavLink";
import { IoMdCloseCircle } from "react-icons/io";
const pages = [
  { route: APPLICATION_PAGE.about, page: "About" },
  { route: APPLICATION_PAGE.recipes, page: "Recipes" },
  { route: APPLICATION_PAGE.myMixMate, page: "My MixMate" },
];
const settings = ["Profile", "Logout"];

function MenuBar() {
  const theme = useTheme();

  const userInfo = useSelector((state: any) => state.userInfo.userInfo);

  const loadingPage = useSelector((state: any) => state.pageState.isLoading);
  const toastMessage: ToastMessage = useSelector(
    (state: any) => state.pageState.toastMessage
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading, error } = useUser();
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
  useEffect(() => {
    if (!userInfo) {
      dispatch(userInfoActions.setUserInfo(user));

      if (error) {
        notFound();
      } else if (user) {
        loginHandleMongo(user);
      }
    }
  }, [userInfo, user, dispatch]);

  let loginControls = null;
  let userMenu = null;
  let [openUserMenu, setOpenUserMenu] = useState(false);
  if (!isLoading) {
    if (isSet(user)) {
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
                  onClick={() => router.push(APPLICATION_PAGE.home)}
                >
                  <ListItemIcon>
                    <HomeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(APPLICATION_PAGE.recipes)}
                >
                  <ListItemIcon>
                    <LiaCocktailSolid
                      fontSize={25}
                      fontWeight="bold"
                      style={{ color: theme.palette.primary.main }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Recipes" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(APPLICATION_PAGE.favourites)}
                >
                  <ListItemIcon>
                    <FavoriteIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="My MixMate" />
                </ListItemButton>
              </ListItem>
            </List>
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
          </Box>
        </Drawer>
      );

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
          <a href={API_ROUTES.userJson}>
            <Avatar
              src={user.picture}
              sx={{ boxShadow: "5px 3px 5px rgba(1, 1, 1, 0.2)" }}
            />
          </a>
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
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
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
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setOpenUserMenu(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              {userMenu}
            </Box>
            {/*logo in xs breakpoint*/}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Image
                src="/mixmatelogomini.png"
                alt="MixMate Logo"
                decoding="async"
                width={686}
                height={364}
                style={{ width: "100px" }}
              />
            </Box>
            {/*navigation menu in md breakpoint*/}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <NavLink
                  key={page.page}
                  onClick={() => {
                    router.push(page.route);
                  }}
                  isDropdown={page.route === APPLICATION_PAGE.myMixMate}
                  route={page.route}
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
