"use client";
import { useEffect } from "react";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "./_utilities/_client/constants";

function registerNewUserObject() {
  return {
    nickname: "",
    password: "",
    passwordConfirm: "",
    name: "",
    lastName: "",
    email: "",
  };
}

async function addMeetupHandler() {
  //this will send GET reqeust to /api/usern  route
  //check api/user/route.ts file  to check how it works
  // await makeRequest(
  //   API_ROUTES.user,
  //   REQ_METHODS.get,
  //   { nickname: "Harry" },
  //   (data) => {
  //     console.log("Success callback:", data);
  //   }
  // ).catch((error) => {
  //   console.log("Error handling:", error);
  // });
  let newUser = registerNewUserObject();
  newUser.nickname = "asdfadarrsssy";
  makeRequest(API_ROUTES.user, REQ_METHODS.post, newUser, (data) => {
    // Handle success
    console.log("Success callback:", data);
  }).catch((error) => {
    // Handle errors that occur during the request
    if(error.message === "Nickname already in use"){
      console.log("You suck");
    }else{
      console.log("Network Error!~");
    }
  });
}

function HomePage() {
  useEffect(() => {
    addMeetupHandler();
  }, []);
  const backgroundImage = {
    backgroundImage: `url(/HomePage.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };

  return <div style={backgroundImage}></div>;
}

export default HomePage;
