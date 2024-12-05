import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
} from "@mui/material";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import EditUserDialog from "../../components/dialogs/users/EditUserDialog";
import { auth } from "../../services/firebaseConfig";

const Settings: React.FC = () => {
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);

  const [user] = useAuthState(auth);

  return (
    <Page>
      <PageHeader title="Settings" />
      <Box mx={1}>
        {user && (
          <Card>
            <CardHeader
              avatar={
                <Avatar
                  alt={user.displayName ?? undefined}
                  src={user.photoURL ?? undefined}
                />
              }
              title={user.displayName}
              subheader={user.email}
              titleTypographyProps={{ variant: "h6" }}
              subheaderTypographyProps={{ variant: "body1" }}
            />
            <CardActions>
              <Button
                variant="contained"
                onClick={() => setEditUserDialogOpen(true)}
                startIcon={<EditIcon />}
              >
                Editar
              </Button>
            </CardActions>
          </Card>
        )}
      </Box>
      <EditUserDialog
        title="Editar Usuário"
        subTitle="Atualizer aqui seus dados"
        open={editUserDialogOpen}
        setOpen={setEditUserDialogOpen}
      />
    </Page>
  );
};

export default Settings;
