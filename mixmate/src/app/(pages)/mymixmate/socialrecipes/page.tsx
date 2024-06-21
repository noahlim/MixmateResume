import Fallback from '@/app/(components)/global/Fallback'
import SocialRecipes from './SocialRecipes';
import { Suspense } from 'react';
const FavouritesPage = () => {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <SocialRecipes/>
      </Suspense>
    </>
  );
};
export default FavouritesPage;