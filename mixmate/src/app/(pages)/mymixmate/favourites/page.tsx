import Fallback from '@/app/(components)/global/Fallback'
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