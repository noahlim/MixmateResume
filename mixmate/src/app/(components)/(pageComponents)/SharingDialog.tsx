import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { MIXMATE_DOMAIN, SEVERITY } from "@/app/_utilities/_client/constants";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import clipboard from "clipboard-copy";
import Grid from "@mui/material/Grid";
import { TextField, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import InputAdornment from "@mui/material/InputAdornment";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  EmailIcon,
  EmailShareButton,
  XIcon,
} from "react-share";
import { ToastMessage } from "interface/toastMessage";
import { useDispatch } from "react-redux";
import { pageStateActions } from "@lib/redux/pageStateSlice";

const SharingDialog = ({
  modalShareRecipeOpen,
  setModalShareRecipeOpen,
  selectedRecipeToShare,
  sharingUrl,
  setSharingUrl}
) => {
    const dispatch = useDispatch();
  let copySharedToClipboard = () => {
    const shareUrl = `${MIXMATE_DOMAIN}recipes/${selectedRecipeToShare._id}`;
    clipboard(shareUrl);
    setSharingUrl(shareUrl);
    const toastMessageObject: ToastMessage = {
      title: "Social",
      message: "Link copied to clipboard!",
      severity: SEVERITY.Success,
      open: true,
    };
    dispatch(pageStateActions.setToastMessage(toastMessageObject));
  };
  return (
    <Dialog
      onClose={() => setModalShareRecipeOpen(false)}
      open={modalShareRecipeOpen}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Share
          <IconButton
            aria-label="Close"
            onClick={() => setModalShareRecipeOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Box>
        <DialogActions>
          <Grid
            container
            justifyContent="center"
            spacing={3}
            sx={{ padding: "0px 20px" }}
          >
            <Grid
              item
              xs={3}
              sx={{ display: "flex" }}
              justifyContent="center"
              alignContent="center"
            >
              <WhatsappShareButton
                url={sharingUrl}
                title={`MixMate - Check our recipe : ${selectedRecipeToShare?.strDrink}!`}
                className="Demo__some-network__share-button"
              >
                <WhatsappIcon size={60} round />
              </WhatsappShareButton>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: "flex" }}
              justifyContent="center"
              alignContent="center"
            >
              <TwitterShareButton
                url={sharingUrl}
                title={`MixMate - Check our recipe : ${selectedRecipeToShare?.strDrink}!`}
                className="Demo__some-network__share-button"
              >
                <XIcon size={60} round />
              </TwitterShareButton>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: "flex" }}
              justifyContent="center"
              alignContent="center"
            >
              <FacebookShareButton
                url={sharingUrl}
                className="Demo__some-network__share-button"
              >
                <FacebookIcon size={60} round />
              </FacebookShareButton>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: "flex" }}
              justifyContent="center"
              alignContent="center"
            >
              <EmailShareButton
                url={sharingUrl}
                subject={`MixMate - Check our recipe : ${selectedRecipeToShare?.strDrink}!`}
                body={`MixMate - Check our recipe : ${selectedRecipeToShare?.strDrink}!`}
                className="Demo__some-network__share-button"
              >
                <EmailIcon size={60} round />
              </EmailShareButton>
            </Grid>
          </Grid>

          {/*Error "Parameter 'href' should represent a valid URL" will be thrown when ran on localhost. will work well when deployed */}
        </DialogActions>
        <DialogContent>
          <Divider sx={{ width: "100%" }} />
        </DialogContent>{" "}
        <DialogActions>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                id="outlined-read-only-input"
                defaultValue={`${MIXMATE_DOMAIN}recipes/${selectedRecipeToShare?._id}`}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy to clipboard" placement="top">
                        <IconButton
                          color="primary"
                          onClick={copySharedToClipboard}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
export default SharingDialog;
