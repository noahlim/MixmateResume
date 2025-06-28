"use client";
import PreloadedRecipespage from "@/app/(components)/(pageComponents)/PreloadedRecipesPage";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const MyMixmate = () => {
  return (
    <>
      <PreloadedRecipespage applicationPage={APPLICATION_PAGE.favourites} />
    </>
  );
};

export default withPageAuthRequired(MyMixmate);
