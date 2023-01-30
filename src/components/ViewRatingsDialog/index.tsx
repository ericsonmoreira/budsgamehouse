import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import DataGridRatings, { DataGridRatingsRowData } from "../DataGridRatings";

type ViewRatingsDialogProps = {
  title: string;
  subTitle: string;
  tatingsTableData: DataGridRatingsRowData[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  round: number;
  roundTotal: number;
  format: string;
};

const ViewRatingsDialog: React.FC<ViewRatingsDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  tatingsTableData,
  format,
  round,
  roundTotal,
  ...rest
}) => {
  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subTitle}</DialogContentText>
        <Box sx={{ height: "60vh", marginTop: 1 }}>
          <DataGridRatings
            rows={tatingsTableData}
            title={title}
            format={format}
            round={round}
            roundTotal={roundTotal}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRatingsDialog;
