"use client";
import { useEffect } from "react";
import { makeRequest } from "@/app/_utilities/utilities";
async function addMeetupHandler() {
  await makeRequest("apiRoute", "GET", { param1: "value1" }, (data) => {
    console.log("Success callback:", data);
  }).catch((error) => {
    console.log("Error handling:", error);
  });
  // fetch("http://localhost:3000/api/user", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ key1: "value1", key2: "value2" }),
  // })
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
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
