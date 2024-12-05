import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { Box, IconButton, Tooltip } from "@mui/material";

type ActionsCellProps = {
  handleUpdate?: () => void;
  handledelete?: () => void;
  handleView?: () => void;
  handleTransfer?: () => void;
};

const ActionsCell: React.FC<ActionsCellProps> = ({
  handleUpdate,
  handledelete,
  handleView,
  handleTransfer,
}) => {
  return (
    <Box>
      {handledelete && (
        <Tooltip title="Deletar">
          <IconButton color="error" onClick={handledelete}>
            <RemoveCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {handleUpdate && (
        <Tooltip title="Editar">
          <IconButton color="info" onClick={handleUpdate}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {handleView && (
        <Tooltip title="Vizualizar">
          <IconButton color="default" onClick={handleView}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {handleTransfer && (
        <Tooltip title="Transferir Saldo">
          <IconButton color="default" onClick={handleTransfer}>
            <SwapHorizIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ActionsCell;
