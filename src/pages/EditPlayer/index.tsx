import AvatarPlayer from "@/components/AvatarPlayer";
import ImageDropZone from "@/components/ImageDropZone";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import ControlledPhoneTextField from "@/components/textfields/ControlledPhoneTextField";
import ControlledTextField from "@/components/textfields/ControlledTextField";
import useConfirmation from "@/hooks/useConfirmation";
import usePlayer from "@/hooks/usePlayer";
import { SaveIcon } from "@/icons";
import updatePlayer from "@/resources/players/updatePlayer";
import uploadImageInStorage from "@/resources/uploadImageInStorage";
import routesNames from "@/routes/routesNames";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import schema, { EditPlayerDialogFormData } from "./schema ";

type EditPlayerParams = {
  id: string;
};

function EditPlayer() {
  const { id } = useParams<EditPlayerParams>();

  const { data: player, isLoading: isLoadingPlayer } = usePlayer(id);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { showDialog, confirmationDialog: ConfirmationDialog } =
    useConfirmation();

  const { control, handleSubmit } = useForm<EditPlayerDialogFormData>({
    resolver: zodResolver(schema),
    values: player,
  });

  const { mutate: updatePlayerMutate, isPending: updatePlayerIsLoading } =
    useMutation({
      mutationFn: async ({
        email,
        name,
        phone,
        avatarImgUrl,
        id,
        balance,
        file,
      }: EditPlayerDialogFormData) => {
        if (file) {
          const newAvatarImgUrl = await uploadImageInStorage(file);

          await updatePlayer({
            id,
            name,
            email,
            balance,
            avatarImgUrl: newAvatarImgUrl,
            phone,
          });
        } else {
          await updatePlayer({
            id,
            name,
            email,
            balance,
            avatarImgUrl,
            phone,
          });
        }

        await queryClient.invalidateQueries({ queryKey: ["usePlayers"] });

        await queryClient.invalidateQueries({
          queryKey: ["usePlayer", id],
        });
      },
      onSuccess: () => {
        navigate(routesNames.PLAYERS);

        toast.success("Player atualizado com sucesso");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleSave = async (data: EditPlayerDialogFormData) => {
    const confirmation = await showDialog({
      title: "Edição de Produto",
      message: `Deseja Realmente Editar o Player: ${data.name}?`,
    });

    if (confirmation) {
      updatePlayerMutate(data);
    }
  };

  return (
    <Page loading={isLoadingPlayer || updatePlayerIsLoading}>
      <PageHeader title="Editar Payer" containsBackButton />
      {player && (
        <Grid
          container
          spacing={1}
          component="form"
          onSubmit={handleSubmit(handleSave)}
        >
          <Grid
            size={{ md: "auto", xs: 12 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <AvatarPlayer
              sx={{ width: 100, height: 100 }}
              playerId={player.id}
            />
          </Grid>
          <Grid size={{ md: "grow", xs: 12 }}>
            <Controller
              control={control}
              name="file"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Stack direction="column" spacing={1}>
                  <ImageDropZone file={value} setFile={onChange} />
                  {error && (
                    <Typography color="error">{error.message}</Typography>
                  )}
                </Stack>
              )}
            />
          </Grid>
          <Grid size={12}>
            <ControlledTextField
              name="name"
              control={control}
              variant="outlined"
              size="small"
              label="Nome"
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <ControlledPhoneTextField
              name="phone"
              control={control}
              variant="outlined"
              type="tel"
              size="small"
              label="Telefone"
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <ControlledTextField
              name="email"
              control={control}
              variant="outlined"
              type="email"
              size="small"
              label="Email"
              fullWidth
            />
          </Grid>
          <Grid size={12} justifyContent="flex-end" display="flex">
            <Button variant="contained" startIcon={<SaveIcon />} type="submit">
              Salvar
            </Button>
          </Grid>
        </Grid>
      )}
      <ConfirmationDialog />
    </Page>
  );
}

export default EditPlayer;
