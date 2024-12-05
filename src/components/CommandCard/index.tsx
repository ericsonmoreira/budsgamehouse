import { Box, ButtonBase, Paper, Typography } from "@mui/material";
import { differenceInHours, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import routesNames from "../../routes/routesNames";
import CommandTitleName from "./CommandTitleName";
import TypographyBalance from "../TypographyBalance";

type CommandCardProps = {
  data: Command;
};

const CommandCard: React.FC<CommandCardProps> = ({ data }) => {
  const navigate = useNavigate();

  const total = useMemo(() => {
    return data.products.reduce(
      (acc, curr) => acc + curr.price * curr.amount,
      0,
    );
  }, [data]);

  // verifica se a comanda está aberta a mais de 24 horas
  const checkDelay = (command: Command): boolean => {
    const now = new Date();

    const createdAtDate = new Date(Number(command.createdAt.toString()));

    return (
      command.status === "open" && differenceInHours(now, createdAtDate) > 24
    );
  };

  return (
    <ButtonBase
      TouchRippleProps={{ center: false }}
      sx={{ width: "100%" }}
      onClick={() => navigate(routesNames.VIEW_COMMAND.replace(":id", data.id))}
    >
      <Paper
        sx={({ palette }) => ({
          width: "100%",
          borderColor: checkDelay(data)
            ? palette.warning.main
            : palette.divider,
        })}
        variant="outlined"
      >
        <Box p={2}>
          <CommandTitleName command={data} />
          <Typography variant="h6">
            Cliente: {data.displayName || "Não Informado"}
          </Typography>
          <TypographyBalance variant="h4" balance={total} />
          <Typography variant="button" color="GrayText">
            Aberto em {format(data.createdAt, "PPPp", { locale: ptBR })}
          </Typography>
        </Box>
      </Paper>
    </ButtonBase>
  );
};

export default CommandCard;
