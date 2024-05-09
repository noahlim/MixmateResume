import { AlertColor } from '@mui/material/Alert';

interface ToastMessage {
    open: boolean;
    severity: AlertColor;
    title: string;
    message: string;
}

interface PageState {
    isLoading: boolean;
    toastMessage: ToastMessage;
}

export type { PageState, ToastMessage};