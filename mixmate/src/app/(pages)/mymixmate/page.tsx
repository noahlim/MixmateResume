'use client';
import Favourites from "./favourites/FavouritePage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const MyMixmate = () => {

  return (
    <>
      <Favourites/>
    </>
  );
}

export default withPageAuthRequired(MyMixmate);