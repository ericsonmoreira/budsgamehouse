import { Backdrop, Box, CircularProgress, Typography, IconButton } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import 'react-vertical-timeline-component/style.min.css';
import useCommand from '../../hooks/useCommand';
import routesNames from '../../routes/routesNames';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type ViewCommandParams = {
  id: string;
};

const ViewCommand: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams<ViewCommandParams>();

  const { data: command, isLoading: commandIsLoading, error: commandError } = useCommand(id);

  if (commandError) {
    return <Navigate to={routesNames.NOT_FOUND} />;
  }

  return (
    <>
      <Box
        sx={{
          margin: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" color="textPrimary">
          Comanda
        </Typography>
      </Box>
      <Box>
        <Typography>{JSON.stringify(command, undefined, 2)}</Typography>
      </Box>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={commandIsLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default ViewCommand;
