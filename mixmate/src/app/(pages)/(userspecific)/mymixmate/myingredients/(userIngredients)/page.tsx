import Fallback from '@/app/(components)/Fallback'
import MyIngredients from './MyIngredients';
import { Suspense } from 'react';
import MyIngredientsTest from './MyIngredientsTest';
const FavouritesPage = () => {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <MyIngredientsTest/>
      </Suspense>
    </>
  );
};
export default FavouritesPage;