import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useDropzone } from 'react-dropzone';

type ImageDropZoneProps = {
  file?: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null | undefined>>;
};

// TODO: usar esse imgUrl para exibir a imagem se ela já existir
const ImageDropZone: React.FC<ImageDropZoneProps> = ({ file, setFile }) => {
  const { palette } = useTheme();

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/img': ['.png', '.jpg', '.webp'],
    },
  });

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        borderStyle: 'solid',
        borderColor: isDragActive ? palette.secondary.main : palette.primary.main,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {file ? (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack margin={2} spacing={1}>
            <img
              style={{
                display: 'inline-flex',
                width: 200,
                height: 200,
                boxSizing: 'border-box',
              }}
              src={URL.createObjectURL(file)}
            />
            <Button color="primary" startIcon={<DeleteIcon />} onClick={() => setFile(null)}>
              Remover Arquivo
            </Button>
          </Stack>
        </Box>
      ) : (
        <Stack margin={2} spacing={1} alignItems="center" {...getRootProps()}>
          <input {...getInputProps()} />
          <CloudUploadIcon fontSize="large" />
          <Typography variant="body1" style={{ textAlign: 'center' }}>
            Arraste e solte algum arquivo aqui ou clique para selecionar um arquivo...
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default ImageDropZone;
