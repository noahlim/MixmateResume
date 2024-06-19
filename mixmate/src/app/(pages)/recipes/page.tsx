'use client'
import Fallback from '@/app/(components)/global/Fallback'
import { Suspense } from 'react';
import DefaultRecipes from '@/app/(components)/(pageComponents)/DefaultRecipes';

function RecipePage() {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <DefaultRecipes/>
      </Suspense>
    </>
  )
}

export default RecipePage;
