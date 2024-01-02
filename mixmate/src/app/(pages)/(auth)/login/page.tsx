"use client";
import { useState } from "react";
import { makeRequest, isSet } from "@/app/_utilities/_client/utilities";
import {
  API_ROUTES,
  REQ_METHODS,
  MIXMATE_DOMAIN,
} from "@/app/_utilities/_client/constants";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { userInfoActions } from "redux/userInfoSlice";
function Page() {
  const [nickname, setnickname] = useState("ddongp");
  const [password, setPassword] = useState("ljw234");
  const dispatch = useDispatch();

  const verifyToken = (event) => {
    event.preventDefault();
    makeRequest(API_ROUTES.tokenVerify, REQ_METHODS.get, {}, (data) => {
      console.log("Success callback:", data);
    }).catch((error) => {
      if (error.message === "Unauthorized: Invalid or expired token.") {
        console.log(error.message);
      } else {
        console.log("Network error occured while verifying the session.");
      }
    });
  };

  const RemoveToken = async(event) => {
    event.preventDefault();
    await fetch('/api/logout', { method: 'POST' });
    dispatch(userInfoActions.setUserInfo(null));

  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    const loginData = { nickname: nickname, password: password };

    makeRequest(
      API_ROUTES.login,
      REQ_METHODS.post,
      loginData,
      (serverResponse) => {
        // Handle success
        console.log(serverResponse);
        if (serverResponse.isOk) {
          dispatch(userInfoActions.setUserInfo(serverResponse.data));
        }
      }
    ).catch((error) => {
      if (error.message === "Invalid credentials") {
        console.log("You suck");
      } else {
        console.log(error.message);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nickname"
          value={nickname}
          onChange={(e) => setnickname(e.target.value)}
        />
        <br />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input type="submit" value="Login" />
      </form>
      <form onSubmit={verifyToken}>
        <input type="submit" value="Verify" />
      </form>
      <form onSubmit={RemoveToken}>
        <input type="submit" value="Logout" />
      </form>
    </div>
  );
}

export default Page;
