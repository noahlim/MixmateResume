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
    authenticatedModalOpen: boolean;

}

export type { PageState, ToastMessage};