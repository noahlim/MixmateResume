import Fallback from '@/app/(components)/global/Fallback'
import MyRecipes from './MyRecipes';
import { Suspense } from 'react';
const FavouritesPage = () => {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <MyRecipes/>
      </Suspense>
    </>
  );
};
export default FavouritesPage;