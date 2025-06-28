import { AlertColor } from "@mui/material/Alert";

export interface ToastMessage {
  title: string;
  message: string;
  severity: AlertColor;
  open: boolean;
}
