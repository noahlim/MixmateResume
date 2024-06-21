'use client'
import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const UnderMaintenance = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <BuildIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            We&apos;re Under Maintenance
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            We&apos;re working hard to improve our website and will be back soon.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We apologize for any inconvenience this may cause.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UnderMaintenance;