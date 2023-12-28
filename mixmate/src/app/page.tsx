"use client"
import { useEffect } from "react";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "./_utilities/_client/constants";
import MenuBar from "./(components)/MenuBar";
import ReduxProvider from "../redux/provider"
import { useRouter, usePathname } from "next/navigation";
import HomePage from "./(components)/HomePage";
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
    if (error.message === "Nickname already in use") {
      console.log("You suck");
    } else {
      console.log("Network Error!~");
    }
  });
}


function RootPage({ children }) {
  const router = useRouter();

  // Check if the current route is the home page
  if (usePathname() === '/') {
    return (
      <ReduxProvider>
      <MenuBar />

        <HomePage />
      </ReduxProvider>
    );
  }

  // For all other routes, render the children normally
  return (
    <ReduxProvider>
      <MenuBar />

      {children}
    </ReduxProvider>
  );
}

export default RootPage;
