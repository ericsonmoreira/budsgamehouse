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
        subheader={format(schedule.start.toDate(), "dd/MM/yy HH:mm")}
      />
      <CardContent>
        <Typography>
          Valor inscrição: {formatterCurrencyBRL.format(schedule.price)}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: "end" }}>
        <Link
          component={Button}
          size="small"
          endIcon={<ArrowForwardIcon />}
          href="#"
          underline="none"
        >
          Visualizar
        </Link>
      </CardActions>
    </Card>
  );
}

export default SchedleCard;
