import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

type ActionsCellProps = {
  handleUpdate?: () => void;
  handledelete?: () => void;
};

const ActionsCell: React.FC<ActionsCellProps> = ({
  handleUpdate,
  handledelete,
}) => {
  return (
    <Box>
      <Tooltip title="Deletar">
        <IconButton color="error" onClick={handledelete}>
          <RemoveCircleIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Editar">
        <IconButton color="info" onClick={handleUpdate}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ActionsCell;

