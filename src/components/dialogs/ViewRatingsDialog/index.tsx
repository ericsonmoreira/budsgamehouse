import TelegramIcon from "@mui/icons-material/Telegram";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import { toBlob } from "html-to-image";
import { useCallback, useMemo, useRef } from "react";
import RatingsController from "../../../controllers/RatingsController";
import sendTelegramImg from "../../../resources/sendTelegramImg";
import getPlayerNameById from "../../../utils/getPlayerNameById";
import DataGridRatings, {
  DataGridRatingsRowData,
} from "../../datagrids/DataGridRatings";

type ViewRatingsDialogProps = {
  title: string;
  subTitle: string;
  tournamentData: TournamentData;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  round: number;
  roundTotal: number;
  format: string;
};

const ViewRatingsDialog: React.FC<ViewRatingsDialogProps & DialogProps> = ({
  title,
  subTitle,
  setOpen,
  tournamentData,
  format,
  round,
  roundTotal,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const ratingsTableData = useMemo<DataGridRatingsRowData[]>(() => {
    const ratingsController = new RatingsController(tournamentData);

    const ratings = ratingsController.generateRatings();

    return ratings.map(({ playerId, ...rest }, index) => ({
      id: playerId,
      index,
      player: getPlayerNameById({ tournamentData, playerId }),
      ...rest,
    }));
  }, [tournamentData]);

  const handleSendRatingsToTelegramChat = useCallback(async () => {
    if (ref.current) {
      const blob = await toBlob(ref.current, { cacheBust: true });

      sendTelegramImg(blob as Blob);
    }
  }, [tournamentData, ref]);

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            marginBottom: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>{subTitle}</Typography>
          <Box>
            <Button
              variant="outlined"
              endIcon={<TelegramIcon />}
              onClick={handleSendRatingsToTelegramChat}
            >
              Enviar Ratings
            </Button>
          </Box>
        </Box>
        <Box sx={{ height: "60vh" }} ref={ref}>
          <DataGridRatings
            rows={ratingsTableData}
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
