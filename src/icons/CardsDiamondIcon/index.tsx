import { SvgIcon, SvgIconProps, useTheme } from '@mui/material';

// Ouro
const CardsDiamondIcon: React.FC<SvgIconProps> = (props) => {
  const { palette } = useTheme();

  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={palette.error.main}>
        <title>cards-diamond</title>
        <path d="M19,12L12,22L5,12L12,2" />
      </svg>
    </SvgIcon>
  );
};

export default CardsDiamondIcon;
