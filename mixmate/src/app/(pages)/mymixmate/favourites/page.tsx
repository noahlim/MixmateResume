import Fallback from '@/app/(components)/global/Fallback'
import { Suspense } from 'react';
import PreloadedRecipes from "@/app/(components)/(pageComponents)/PreloadedRecipesPage"
import { APPLICATION_PAGE } from '@/app/_utilities/_client/constants';

const FavouritesPage = () => {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <PreloadedRecipes applicationPage={APPLICATION_PAGE.favourites}/>
      </Suspense>
    </>
  );
};
export default FavouritesPage;