import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ForwardIcon from "@mui/icons-material/Forward";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import usePlayer from "../../hooks/usePlayer";
import AvatarPlayer from "../AvatarPlayer";
import TypographyBalance from "../TypographyBalance";

type TransferInformationsProps = {
  data: Transfer;
};

const TransferInformations: React.FC<TransferInformationsProps> = ({
  data,
}) => {
  const { receiverPlayerId, sendingPlayerId, value, description } = data;

  const { data: receiverPlayer } = usePlayer(receiverPlayerId);

  const { data: sendingPlayer } = usePlayer(sendingPlayerId);

  return (
    <Paper>
      <Box p={1}>
        <Typography variant="h6" gutterBottom>
          Transferência
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <CalendarMonthIcon fontSize="small" />
          <Typography>
            {format(data.createdAt.toDate(), "PPPp", { locale: ptBR })}
          </Typography>
        </Stack>
        {sendingPlayer && receiverPlayer && (
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs={12} sm={5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AvatarPlayer playerId={sendingPlayer.id} />
                <Typography variant="h6">{sendingPlayer.name}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <TypographyBalance balance={value} />
                <ForwardIcon />
              </Box>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="flex-end"
              >
                <AvatarPlayer playerId={receiverPlayer.id} />
                <Typography variant="h6">{receiverPlayer.name}</Typography>
              </Stack>
            </Grid>
          </Grid>
        )}
        {description && (
          <>
            <Typography>Descrição</Typography>
            <Typography color="text.secondary">{description}</Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default TransferInformations;
