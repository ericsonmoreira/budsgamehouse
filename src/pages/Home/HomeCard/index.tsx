import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export type HomeCardProps = {
  title: string;
  subheader: string;
  icon: typeof SvgIcon;
  amount?: number;
  to: string;
  isLoading?: boolean;
};

function HomeCard({
  title,
  subheader,
  amount,
  icon: Icon,
  to,
  isLoading,
}: HomeCardProps) {
  const navigate = useNavigate();

  return (
    <Card elevation={1}>
      <CardHeader title={title} subheader={subheader} />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 50,
          }}
        >
          <Icon fontSize="inherit" color="secondary" />
          <Typography fontSize="inherit">
            {isLoading ? <Skeleton variant="text" width={50} /> : amount}
          </Typography>
        </Box>
      </CardContent>
      <CardActions
        disableSpacing
        sx={({ palette }) => ({
          borderTop: 1,
          borderTopColor: palette.divider,
          justifyContent: "flex-end",
        })}
      >
        <Button
          variant="text"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(to)}
        >
          Acessar
        </Button>
      </CardActions>
    </Card>
  );
}

export default HomeCard;
