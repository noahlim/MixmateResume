"use client";
import { useState } from "react";
import { makeRequest, isSet } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS, MIXMATE_DOMAIN } from "@/app/_utilities/_client/constants";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const verifyToken = (event) => {
    event.preventDefault();

    const token = Cookies.get("token");
    if (isSet(token))
      makeRequest("/jwttestapi", "POST", { token: token }, (data) => {
        console.log("Success callback:", data);
      }).catch((error) => {
        if (error.message ==='Your log in session expired. Please log in again.') {
          console.log(error.message);
        } else if (error.message === "Invalid attempt.")
          //when the token key does  not match
          console.log("Invalid log in session. Please log in again.");
        else {
          console.log("Network error occured while verifying the session.");
        }
      });
      else{

      }
  }
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    const loginData = { username, password };

    makeRequest(API_ROUTES.login, REQ_METHODS.post, loginData, (data) => {
      // Handle success
      console.log("Success callback:", data);
      const token = data.token;
      Cookies.set("token", token, { expires: 1, secure: true, domain: MIXMATE_DOMAIN});

      if (token) {
        const json = jwt.decode(token) as { [key: string]: string };
        console.log(
          `Welcome ${json.username} your password is ${json.password}`
        );
      } else {
        console.log("you suck");
      }
    }).catch((error) => {
      if (error.message === "Invalid credentials") {
        console.log("You suck");
      } else {
        console.log("Network Error!~");
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
    </div>
  );
}

export default Page;
