import Fallback from '@/app/(components)/Fallback'
import MyIngredients from './MyIngredients';
import { Suspense } from 'react';
const FavouritesPage = () => {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <MyIngredients/>
      </Suspense>
    </>
  );
};
export default FavouritesPage;