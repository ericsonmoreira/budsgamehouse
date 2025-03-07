import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

// Ouro
function CardsDiamondIcon(props: SvgIconProps) {
  const { palette } = useTheme();

  return (
    <SvgIcon {...props} fill={palette.error.main}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>cards-diamond</title>
        <path d="M19,12L12,22L5,12L12,2" />
      </svg>
    </SvgIcon>
  );
}

export default CardsDiamondIcon;
