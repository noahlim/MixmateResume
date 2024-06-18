'use client';
import Favourites from "@/app/(pages)/(userspecific)/mymixmate/favourites/page";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const MyMixmate = () => {

  return (
    <>
      <Favourites/>
    </>
  );
}

export default withPageAuthRequired(MyMixmate);