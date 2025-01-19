import { ArrowForwardIcon, EditIcon } from "@/icons";
import routesNames from "@/routes/routesNames";
import { formatterCurrencyBRL } from "@/utils/formatters";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

type SchedleCardProps = {
  schedule: Schedule;
};

function SchedleCard({ schedule }: SchedleCardProps) {
  const navigate = useNavigate();

  return (
    <Card variant="outlined">
      <CardHeader
        action={
          <IconButton
            aria-label="edit-schedule"
            onClick={() =>
              navigate(routesNames.EDIT_SCHEDLE.replace(":id", schedule.id))
            }
          >
            <EditIcon />
          </IconButton>
        }
        title={schedule.title}
        subheader={format(schedule.start.toDate(), "dd/MM/yy HH:mm")}
      />
      <CardContent>
        <Typography>
          Valor inscrição: {formatterCurrencyBRL.format(schedule.price)}
        </Typography>
        <Typography>Formato: {schedule.format}</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "end" }}>
        <Button
          endIcon={<ArrowForwardIcon />}
          onClick={() =>
            navigate(routesNames.VIEW_SCHEDLE.replace(":id", schedule.id))
          }
        >
          Visualizar
        </Button>
      </CardActions>
    </Card>
  );
}

export default SchedleCard;
