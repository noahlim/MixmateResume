import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const Fallback = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress size={60} />
      <Box mt={4} textAlign="center">
        <Typography variant="h5" gutterBottom>
          Hang tight, bartender!
        </Typography>
        <Typography variant="body1">
          Our mixologists are shaking up something special for you...
        </Typography>
        <Typography variant="body1">
          (Or maybe they're just trying to find the perfect garnish.)
        </Typography>
      </Box>
    </Box>
  );
};

export default Fallback;