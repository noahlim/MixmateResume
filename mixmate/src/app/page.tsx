"use client";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "./_utilities/_client/constants";
import MenuBar from "./(components)/MenuBar";
import ReduxProvider from "../lib/redux/provider";
import { usePathname } from "next/navigation";
import HomePage from "./(components)/HomePage";
import { EdgeStoreProvider } from "lib/edgestore";

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

//This is a testing function, you have seen nothing :)
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
  makeRequest(API_ROUTES.login, REQ_METHODS.post, { lol: "sick" }, (data) => {
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
  // Check if the current route is the home page
  if (usePathname() === "/") {
    return (
      <ReduxProvider>
        <EdgeStoreProvider>
          <MenuBar />

          <HomePage />
        </EdgeStoreProvider>
      </ReduxProvider>
    );
  }

  // For all other routes, render the children normally
  return (
    <ReduxProvider>
      <EdgeStoreProvider>
        <MenuBar />

        {children}
      </EdgeStoreProvider>
    </ReduxProvider>
  );
}

export default RootPage;
