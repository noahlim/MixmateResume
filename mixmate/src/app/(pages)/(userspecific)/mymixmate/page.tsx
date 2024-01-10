'use client'
import React, { useEffect, useState } from 'react';
import DeckIcon from '@mui/icons-material/Deck';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useUser } from '@auth0/nextjs-auth0/client';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { APPLICATION_PAGE, SEVERITY } from '@/app/_utilities/_client/constants';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Favourites from '@/app/(components)/(pageComponents)/Favourites';
// import CustomRecipes from './CustomRecipes';
// import Social from './Social';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WineBarIcon from '@mui/icons-material/WineBar';
import LiquorIcon from '@mui/icons-material/Liquor'
import { AlertColor } from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import TestPage from '@/app/(components)/(pageComponents)/TestPage';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
//import MyIngredients from './MyIngredient/MyIngredients'
function MyMixMate()
{
    // Validate session
    const { user, error, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
          router.push(APPLICATION_PAGE.root);
        }
      }, [isLoading, user, router]);

    // Toast Message
    const [openToasMessage, setOpenToasMessage] = useState(false);
    const [toast_severity, setToast_severity] = useState<AlertColor>("info");
    const [toast_title, setToast_title] = useState('');
    const [toast_message, setToast_message] = useState('');
    const showToastMessage = (title, message, severity = SEVERITY.Info) =>
    {
        setToast_severity(severity);
        setToast_title(title);
        setToast_message(message);
        setOpenToasMessage(true);
    }

    // Variables
    const [loadingPage, setLoadingPage] = useState(false);

    // Tabs
    const [selectedTab, setSelectedTab] = useState(0);

    return <>

        {/* Toast message */}
        <Snackbar
            open={openToasMessage}
            autoHideDuration={5000}
            onClose={() => setOpenToasMessage(false)}>
            <Alert severity={toast_severity}>
                <AlertTitle>{toast_title}</AlertTitle>
                {toast_message}
            </Alert>
        </Snackbar>

        {/* Loading */}
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingPage}>
            <CircularProgress color="inherit" />
        </Backdrop>

        {/* SubMenu */}
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
                    <Tab icon={<FavoriteIcon />} label="Favorites"/>
                    <Tab icon={<WineBarIcon/>} label="My Recipes" />
                    <Tab icon={<DeckIcon/>} label="Social" />
                    <Tab icon={<LiquorIcon/>} label="My Ingredients" />
                </Tabs>
            </Box>

            {/* Tabs content */}
            { selectedTab === 0 && <Favourites /> }
            { selectedTab === 1 && <TestPage/> }
            { selectedTab === 2 && <TestPage/> }
            { selectedTab === 3 && <TestPage/> }
        </Box>

    </>;
}

export default withPageAuthRequired(MyMixMate);
