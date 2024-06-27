import Fallback from '@/app/(components)/global/Fallback'
import PreloadedRecipes from '@/app/(components)/(pageComponents)/PreloadedRecipesPage'
import { Suspense } from 'react';
import { APPLICATION_PAGE } from '@/app/_utilities/_client/constants';
const FavouritesPage = () => {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <PreloadedRecipes applicationPage={APPLICATION_PAGE.social}/>
      </Suspense>
    </>
  );
};
export default FavouritesPage;