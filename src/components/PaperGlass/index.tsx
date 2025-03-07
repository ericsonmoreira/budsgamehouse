import { Paper, PaperProps } from "@mui/material";

function PaperGlass(props: PaperProps) {
  return (
    <Paper
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        width: "100%",
        maxWidth: "800px",
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(10px)",
      }}
    />
  );
}

export default PaperGlass;
