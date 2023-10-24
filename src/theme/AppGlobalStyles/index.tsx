import { GlobalStyles } from '@mui/material';

const AppGlobalStyles = () => (
  <GlobalStyles
    styles={({ palette, spacing }) => ({
      '*': {
        'scrollbar-width': 'auto',
        'scrollbar-color': `${palette.primary.main} ${palette.background.default}`,
      },
      '*::-webkit-scrollbar': {
        width: spacing(1),
      },
      '*::-webkit-scrollbar-track': {
        background: `${palette.background.default}`,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: `${palette.primary.main}`,
        borderRadius: spacing(0.5),
        border: `3px solid ${palette.background.default}`,
      },
    })}
  />
);

export default AppGlobalStyles;
