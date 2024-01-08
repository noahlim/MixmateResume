"use client";
import { useState, useRef } from "react";
import { makeRequest, isSet } from "@/app/_utilities/_client/utilities";
import {
  API_ROUTES,
  REQ_METHODS,
  MIXMATE_DOMAIN,
} from "@/app/_utilities/_client/constants";
import { useDispatch } from "react-redux";
import { userInfoActions } from "redux/userInfoSlice";
function Page() {
 
  const textRef = useRef(null);
  return (
    <div>
     
        <input
          type="password"
          name="password"
          ref={textRef}
        />
        <br />
     <button onClick={()=>{console.log(textRef.current.value)}}>TestButton</button>
    </div>
  );
}

export default Page;
