import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { ArrowForwardIcon, EditIcon } from "../../icons";
import { formatterCurrencyBRL } from "../../utils/formatters";
import routesNames from "../../routes/routesNames";

type SchedleCardProps = {
  schedule: Schedule;
};

function SchedleCard({ schedule }: SchedleCardProps) {
  return (
    <Card variant="outlined">
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <EditIcon />
          </IconButton>
        }
        title={schedule.title}
        titleTypographyProps={{
          sx: {
            whiteSpace: "nowrap", // Garante que o texto não quebra para a próxima linha
            overflow: "hidden", // Esconde o texto excedente
            textOverflow: "ellipsis", // Adiciona os três pontos ao final do texto
            maxWidth: "90%",
          },
        }}
        subheader={format(schedule.start.toDate(), "dd/MM/yy HH:mm")}
      />
      <CardContent>
        <Typography>
          Valor inscrição: {formatterCurrencyBRL.format(schedule.price)}
        </Typography>
        <Typography>Formato: {schedule.format}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "end" }}>
        <Link
          component={Button}
          endIcon={<ArrowForwardIcon />}
          href={routesNames.VIEW_SCHEDLE.replace(":id", schedule.id)}
          underline="none"
          size="small"
        >
          Visualizar
        </Link>
      </CardActions>
    </Card>
  );
}

export default SchedleCard;
