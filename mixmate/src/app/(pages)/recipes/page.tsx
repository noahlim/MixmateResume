'use client'
import Fallback from '@/app/(components)/Fallback'
import { Suspense } from 'react';
import DefaultRecipes from './DefaultRecipes';

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
