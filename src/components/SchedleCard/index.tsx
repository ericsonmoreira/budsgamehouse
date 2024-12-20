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
