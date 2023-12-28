"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import ClearIcon from "@mui/icons-material/Clear";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import {
  doPost,
  isSet,
  isNotSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import SummarizeIcon from "@mui/icons-material/Summarize";
import StorageIcon from "@mui/icons-material/Storage";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import {
  SEVERITY,
  MAIL_REGEX,
  APPLICATION_PAGE,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import { useRouter } from "next/navigation";
import { AlertColor } from "@mui/material/Alert";
import { userInfoActions } from "redux/userInfoSlice";
const USER_SESSION = "userSession";

function MenuBar() {
  // Toast Message
  const [openToasMessage, setOpenToasMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>("info");
  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
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

  // Login user modal
  function loginUserObject() {
    this.nickname = "";
    this.password = "";
  }
  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  const [loginUserInfo, setLoginUserInfo] = useState(new loginUserObject());
  const closeLoginUser_onClick = () => {
    setLoginUserInfo(new loginUserObject());
    setModalLoginOpen(false);
  };
  const loginUser_onClick = () => {
    // Validate form
    let hasErrors = false;
    if (isNotSet(loginUserInfo.nickname) || isNotSet(loginUserInfo.password)) {
      showToastMessage("Log In", "Enter user and password");
      hasErrors = true;
    }

    if (isNotSet(hasErrors)) {
      showToastMessage("Log In", "Logging in...", SEVERITY.Info);
      makeRequest(
        API_ROUTES.user,
        REQ_METHODS.get,
        loginUserInfo,
        (serverResponse) => {
          if (serverResponse.isOk) {
            showToastMessage(
              "Log In",
              `Welcome to MixMate, ${loginUserInfo.nickname}!`,
              SEVERITY.Success
            );

            //assigning usernickname (will be replaced with user token or something equivalent in future)
            dispatch(userInfoActions.setUserNickname(loginUserInfo.nickname));
            //localStorage.setItem(USER_SESSION, loginUserInfo.nickname);

            //navigating to the profile page
            router.push(APPLICATION_PAGE.profile);
          } else
            showToastMessage(
              "Log In",
              serverResponse.message,
              SEVERITY.Warning
            );
        }
      );
    }
  };
  const logoutUser_onClick = () => {
    //Destroy session and go to default page
    //will be replaced with user token or something equivalent in future
    dispatch(userInfoActions.setUserNickname(""));

    isNotValidSession();
    //console.log("Logout clicked");
  };

  // Register user modal
  function registerNewUserObject() {
    this.nickname = "";
    this.password = "";
    this.passwordConfirm = "";
    this.name = "";
    this.lastName = "";
    this.email = "";
  }
  const [modalRegisterUserOpen, setModalRegisterUserOpen] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState(new registerNewUserObject());
  const closeNewUser_onClick = () => {
    setNewUserInfo(new registerNewUserObject());
    setModalRegisterUserOpen(false);
  };
  const registerNewUser_onClick = () => {
    // Validate form
    let hasErrors = false;
    if (isNotSet(newUserInfo.nickname)) {
      showToastMessage(
        "Nickname",
        "Enter a nickname for your account",
        SEVERITY.Error
      );
      hasErrors = true;
    } else if (
      isNotSet(newUserInfo.password) ||
      isNotSet(newUserInfo.passwordConfirm)
    ) {
      showToastMessage(
        "Password",
        "Enter a password and confirmation",
        SEVERITY.Error
      );
      hasErrors = true;
    } else if (newUserInfo.password !== newUserInfo.passwordConfirm) {
      showToastMessage(
        "Password Confirmation",
        "Password and password confirmation are different",
        SEVERITY.Error
      );
      hasErrors = true;
    } else if (
      isSet(newUserInfo.email) &&
      MAIL_REGEX.test(newUserInfo.email) === false
    ) {
      showToastMessage("Email", "Enter a valid email", SEVERITY.Error);
      hasErrors = true;
    }

    // Save new user
    if (hasErrors === false) {
      showToastMessage("New Account", "Registering new user...", SEVERITY.Info);

      makeRequest(
        API_ROUTES.user,
        REQ_METHODS.post,
        newUserInfo,
        (serverResponse) => {
          // Handle success
          showToastMessage(
            "New Account",
            serverResponse.message,
            SEVERITY.Success
          );
          closeNewUser_onClick();
        }
      ).catch((error) => {
        // Handle errors that occur during the request
        if (error.message === "Nickname already in use") {
          showToastMessage("New Account", error.message, SEVERITY.Error);
        } else {
          console.log("Network Error!~");
        }
      });
    }
    console.log("new user clicked");
  };

  // Validate if there's user session
  let loginControls = null;
  let menuIcon = null;
  let userMenu = null;
  let [openUserMenu, setOpenUserMenu] = useState(false);
  if (isSet(useSelector((state: any) => state.userInfo.userNickname))) {
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
              <ListItemButton onClick={() => logoutUser_onClick()}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    );

    // Set buttons for logout
    loginControls = (
      <Button
        color="inherit"
        onClick={() => logoutUser_onClick()}
        startIcon={<LogoutIcon />}
      >
        Logout
      </Button>
    );
  } else {
    // No user session yet
    loginControls = (
      <>
        <Button
          color="inherit"
          onClick={() => setModalLoginOpen(true)}
          startIcon={<PersonIcon />}
        >
          Login
        </Button>
        <Button
          color="inherit"
          onClick={() => setModalRegisterUserOpen(true)}
          startIcon={<AddReactionIcon />}
        >
          Register
        </Button>
      </>
    );
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
            MixMate
          </Typography>
          {loginControls}
        </Toolbar>
      </AppBar>

      {/* Main menu */}
      {userMenu}

      {/* Login Modal */}
      <Dialog onClose={() => closeLoginUser_onClick()} open={modalLoginOpen}>
        <DialogTitle>User Login</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email Adress"
            type="email"
            fullWidth
            variant="standard"
            name={"nickname"}
            onChange={(e) => (loginUserInfo[e.target.name] = e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            name={"password"}
            onChange={(e) => (loginUserInfo[e.target.name] = e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => loginUser_onClick()}
            color="success"
            variant="contained"
            startIcon={<VpnKeyIcon />}
          >
            Login
          </Button>
          <Button
            onClick={() => closeLoginUser_onClick()}
            color="error"
            variant="contained"
            startIcon={<ClearIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Register User Modal */}
      <Dialog
        onClose={() => closeNewUser_onClick()}
        open={modalRegisterUserOpen}
      >
        <DialogTitle>* New Account (Required info)</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nickname"
            type="text"
            fullWidth
            variant="standard"
            name={"nickname"}
            onChange={(e) => (newUserInfo[e.target.name] = e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            name={"password"}
            onChange={(e) => (newUserInfo[e.target.name] = e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="standard"
            name={"passwordConfirm"}
            onChange={(e) => (newUserInfo[e.target.name] = e.target.value)}
          />
        </DialogContent>
        <DialogTitle>Personal Info (Optional)</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            name={"name"}
            onChange={(e) => (newUserInfo[e.target.name] = e.target.value)}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            name={"lastName"}
            onChange={(e) => (newUserInfo[e.target.name] = e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            name={"email"}
            onChange={(e) => (newUserInfo[e.target.name] = e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => registerNewUser_onClick()}
            color="primary"
            variant="contained"
            startIcon={<HowToRegIcon />}
          >
            Register
          </Button>
          <Button
            onClick={() => closeNewUser_onClick()}
            color="error"
            variant="contained"
            startIcon={<ClearIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function isNotValidSession() {
  const router = useRouter();
  // Validate user session
  if (isNotSet(useSelector((state: any) => state.userInfo.userNickname))) {
    router.push(APPLICATION_PAGE.home);
    return true;
  }

  return false;
}

export default MenuBar;

export { isNotValidSession, USER_SESSION };
