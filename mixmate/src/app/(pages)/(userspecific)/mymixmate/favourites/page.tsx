'use client';
import Favourites from "@/app/(components)/(pageComponents)/FavouritesRecipes";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

const FavouritesPage = () =>{
    return (
        <>
            <Favourites/>
        </>
    );
}

export default withPageAuthRequired(FavouritesPage);