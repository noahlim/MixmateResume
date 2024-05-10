'use client'
import dynamic from 'next/dynamic';
import { Backdrop, CircularProgress } from '@mui/material';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

// Define the backdrop style
const backdropStyle = {
  color: '#fff',
  zIndex: 1300 // Replace with an appropriate fixed value
};

// Dynamically import the Recipe component with a preloader
const RecipeLazyLoaded = dynamic(
  () => import('@/app/(components)/(pageComponents)/DefaultRecipes'),
  {
    loading: () => (
      <Backdrop open={true} sx={backdropStyle}>
        <CircularProgress color="inherit" />
      </Backdrop>
    ),
  }
);

// Define the Recipe page component
function RecipePage() {
  return <RecipeLazyLoaded />;
}

// Wrap the component with withPageAuthRequired HOC
export default withPageAuthRequired(RecipePage);
