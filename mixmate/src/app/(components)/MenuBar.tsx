"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";

import { isSet, makeRequest } from "@/app/_utilities/_client/utilities";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import SummarizeIcon from "@mui/icons-material/Summarize";
import StorageIcon from "@mui/icons-material/Storage";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  SEVERITY,
  APPLICATION_PAGE,
  API_ROUTES,
  REQ_METHODS,
  MIXMATE_DOMAIN,
} from "@/app/_utilities/_client/constants";
import { useRouter } from "next/navigation";
import { AlertColor } from "@mui/material/Alert";
import { userInfoActions } from "redux/userInfoSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import { notFound } from "next/navigation";

import Link from "next/link";
const USER_SESSION = "userSession";

function MenuBar() {
  // Toast Message
  const userInfo = useSelector((state: any) => state.userInfo.userInfo);
  const [openToasMessage, setOpenToasMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>("info");
  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const userSession = useUser();
  useEffect(() => {
    if (userSession.error) {
      notFound();
    }

    if (userSession.user) {
      if (!userInfo) {
        loginHandleMongo(userSession.user);
        showToastMessage(
          "Log In",
          `Welcome to Mixmate, ${userSession.user.nickname}!`
        );
      }
      dispatch(userInfoActions.setUserInfo(userSession.user));
    }
  }, [userSession.user]);

  const loginHandleMongo = async (userInfoData) => {
    try {
      console.log(userInfoData);
      makeRequest(
        API_ROUTES.mongoLogin,
        REQ_METHODS.post,
        userInfoData,
        (serverResponse) => {
          if (!serverResponse.isOk)
            showToastMessage(
              "Log In",
              serverResponse.message,
              SEVERITY.Warning
            );
        }
      );
    } catch (err) {
      showToastMessage("Error", err.message, SEVERITY.warning);
    }
  };
  const showToastMessage = (
    title: string,
    message: string,
    severity: AlertColor = SEVERITY.Info
  ) => {
    setToast_severity(severity);
    setToast_title(title);
    setToast_message(message);
    setOpenToasMessage(true);
  };

  // Validate if there's user session
  let loginControls = null;
  let menuIcon = null;
  let userMenu = null;
  let [openUserMenu, setOpenUserMenu] = useState(false);
  if (!userSession.isLoading) {
    if (isSet(userSession.user)) {
      // Set menu icon
      menuIcon = (
        <>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpenUserMenu(true)}
          >
            <MenuIcon />
          </IconButton>
        </>
      );

      // Set user's menu
      userMenu = (
        <Drawer
          anchor={"left"}
          open={openUserMenu}
          onClick={() => setOpenUserMenu(false)}
        >
          <Box sx={{ width: 250 }} role="presentation">
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(APPLICATION_PAGE.home)}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(APPLICATION_PAGE.profile)}
                >
                  <ListItemIcon>
                    <AccountBoxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(APPLICATION_PAGE.myMixMate)}
                >
                  <ListItemIcon>
                    <FavoriteIcon />
                  </ListItemIcon>
                  <ListItemText primary="My MixMate" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(APPLICATION_PAGE.recipes)}
                >
                  <ListItemIcon>
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Recipes" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => router.push(APPLICATION_PAGE.mongo)}
                >
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Mongo"} />
                </ListItemButton>
              </ListItem>
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
                    <ListItemText primary={"Logout"} />
                  </ListItemButton>
                </a>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      );

      // Set buttons for logout
      loginControls = (
        <>
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
            <img
              className="w-10 h-10 ml-5 rounded-full object-cover"
              src={userSession.user.picture}
            />
          </a>
        </>
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
        open={openToasMessage}
        autoHideDuration={5000}
        onClose={() => setOpenToasMessage(false)}
      >
        <Alert severity={toast_severity}>
          <AlertTitle>{toast_title}</AlertTitle>
          {toast_message}
        </Alert>
      </Snackbar>

      {/* Top Bar */}
      <AppBar position="static">
        <Toolbar>
          {menuIcon}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={APPLICATION_PAGE.home}>MixMate</Link>
          </Typography>
          {loginControls}
        </Toolbar>
      </AppBar>

      {/* Main menu */}
      {userMenu}
    </Box>
  );
}

export default MenuBar;

export { USER_SESSION };
