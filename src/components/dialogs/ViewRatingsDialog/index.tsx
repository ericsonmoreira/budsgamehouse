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
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import RatingsController from "../../../controllers/RatingsController";
import sendTelegramMessage from "../../../resources/sendTelegramMessage";
import generateRatingsMessageTelegram from "../../../utils/generateRatingsMessageTelegram";
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
    await sendTelegramMessage(generateRatingsMessageTelegram(tournamentData));

    toast.success("Mensagem enviada com sucesso!");
  }, [tournamentData]);

  return (
    <Dialog fullWidth maxWidth="md" {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>{subTitle}</Typography>
          <Button
            variant="outlined"
            endIcon={<TelegramIcon />}
            onClick={handleSendRatingsToTelegramChat}
          >
            Enviar Ratings
          </Button>
        </Box>
        <Box sx={{ height: "60vh", marginTop: 1 }}>
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
