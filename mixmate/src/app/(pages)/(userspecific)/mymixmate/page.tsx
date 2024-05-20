'use client';
import Favourites from "@/app/(components)/(pageComponents)/FavouritesRecipes";
import CustomRecipes from "@/app/(components)/(pageComponents)/CustomRecipes";
import SocialRecipes from "@/app/(components)/(pageComponents)/SocialRecipes";
import MyIngredients from "@/app/(components)/(pageComponents)/(userIngredients)/MyIngredients";
import { usePathname } from "next/navigation";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";

export default function Home() {
  const pathname = usePathname();

  return (
    <>
      {pathname === APPLICATION_PAGE.favourites && <Favourites />}
      {pathname === APPLICATION_PAGE.myRecipes && <CustomRecipes />}
      {pathname === APPLICATION_PAGE.social && <SocialRecipes />}
      {pathname === APPLICATION_PAGE.myIngredients && <MyIngredients />}
    </>
  );
}