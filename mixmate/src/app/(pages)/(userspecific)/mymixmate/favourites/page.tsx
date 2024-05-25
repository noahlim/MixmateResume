import Fallback from '@/app/(components)/Fallback'
import Favourites from './FavouritePage';
import { Suspense } from 'react';
const FavouritesPage = () => {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <Favourites/>
      </Suspense>
    </>
  );
};
export default FavouritesPage;