"use client";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ClearIcon from "@mui/icons-material/Clear";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockResetIcon from "@mui/icons-material/LockReset";
import Button from "@mui/material/Button";
import {
  doPost,
  isNotSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "@/app/_utilities/_client/constants";
import {  USER_SESSION } from "@/app/(components)/MenuBar";
import { Card, CardContent, Typography, Avatar } from "@mui/material";
import avatar from "boy.png";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { SEVERITY } from "@/app/_utilities/_client/constants";
import { useSelector } from "react-redux";
import { AlertColor } from "@mui/material/Alert";
import { useRouter } from "next/navigation";
function Profile() {
  // Validate session
  const userInfo = useSelector((state: any) => state.userInfo.userInfo);
  const router = useRouter();
  useEffect(() => {
    if (isNotSet(userInfo)) {
      router.push("/");
    }
  }, [userInfo, router]);

  // Toast Message
  const [openToasMessage, setOpenToasMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>("info");
  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");
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
  // Variables
  const [loadingPage, setLoadingPage] = useState(true);
  //const [userInfo, setUserInfo] = useState(null);
  // useEffect(
  //   () =>
  //     // doPost(
  //     //   API.Profile.getUserInfo,
  //     //   { nickname: userNickname },
  //     //   (response) => {
  //     //     if (response.isOk) {
  //     //       setUserInfo(response.data);
  //           setLoadingPage(false)
  //     //     } else alert("Error getting user info");
  //     //   }
  //     ),
  //   []
  // );

  useEffect(() => {
    setLoadingPage(false);
  }, []);
  // Cahnge pass button
  function resetPassObject() {
    this.nickname = "";
    this.password = "";
    this.newPassword = "";
    this.repeatPassword = "";
  }
  const [passInfo, setPassInfo] = useState(new resetPassObject());
  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  let closeModalChangePass = () => {
    setPassInfo(new resetPassObject());
    setModalLoginOpen(false);
  };
  let btnChangePassword_onClick = () => {
    // Validate passwords
    if (isNotSet(passInfo.password))
      showToastMessage("Password", "Enter your password", SEVERITY.Error);
    else if (isNotSet(passInfo.newPassword))
      showToastMessage("Password", "Enter your new password", SEVERITY.Error);
    else if (isNotSet(passInfo.repeatPassword))
      showToastMessage("Password", "Repeat your new password", SEVERITY.Error);
    else if (passInfo.newPassword !== passInfo.repeatPassword)
      showToastMessage(
        "Password",
        "Your new passwords does not match",
        SEVERITY.Error
      );
    else {
      // Get user session
      passInfo.nickname = userInfo.nickname;
      makeRequest(
        API_ROUTES.password,
        REQ_METHODS.post,
        passInfo,
        (serverResponse) => {
          // Handle success
          showToastMessage(
            "New Account",
            serverResponse.message,
            SEVERITY.Success
          );
          closeModalChangePass();
        }
      ).catch((error) => {
        // Handle errors that occur during the request
        if (
          error.message === "Invalid session or wrong password" ||
          error.message === "New password not received"
        ) {
          showToastMessage(
            "Password update failed",
            error.message,
            SEVERITY.Error
          );
        } else {
          showToastMessage("Network Error", error.message, SEVERITY.Error);
        }
      });
    }
  };

  return (
    <>
      {/* Loading */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Toast message */}
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

      {/* Login Modal */}
      <Dialog onClose={() => closeModalChangePass()} open={modalLoginOpen}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            name={"password"}
            onChange={(e) => (passInfo[e.target.name] = e.target.value)}
          />
          <TextField
            margin="dense"
            label="New password"
            type="password"
            fullWidth
            variant="standard"
            name={"newPassword"}
            onChange={(e) => (passInfo[e.target.name] = e.target.value)}
          />
          <TextField
            margin="dense"
            label="Repeat password"
            type="password"
            fullWidth
            variant="standard"
            name={"repeatPassword"}
            onChange={(e) => (passInfo[e.target.name] = e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => btnChangePassword_onClick()}
            color="success"
            variant="contained"
            startIcon={<VpnKeyIcon />}
          >
            Reset
          </Button>
          <Button
            onClick={() => closeModalChangePass()}
            color="error"
            variant="contained"
            startIcon={<ClearIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Page body */}
      <CardContent style={{ textAlign: "center", marginTop: "15px" }}>
        <Avatar
          style={{
            margin: "0 auto",
            marginBottom: "1rem",
            width: "120px",
            height: "120px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={"boy.png"}
          ></img>
        </Avatar>
        <Typography variant="h4">{userInfo?.nickname}</Typography>
        <Typography
          style={{ color: "#06541c", fontWeight: "800" }}
          variant="h6"
        >
          Name: {userInfo?.nickname}
        </Typography>
        <Typography variant="h6">Lastname: {userInfo?.lastName}</Typography>
        <Typography variant="h6">email: {userInfo?.email}</Typography>
      </CardContent>

      {/* Reset password */}
      <CardContent style={{ textAlign: "center", marginTop: "15px" }}>
        <Button
          onClick={() => setModalLoginOpen(true)}
          color="primary"
          variant="contained"
          startIcon={<LockResetIcon />}
          style={{ marginLeft: 7 }}
        >
          Change password
        </Button>
      </CardContent>
    </>
  );
}

export default Profile;
