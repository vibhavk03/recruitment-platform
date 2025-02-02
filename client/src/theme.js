export const darkThemeSettings = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue accent for active elements
    },
    background: {
      default: '#121212', // dark background
      paper: '#1F1F1F', // dark background content box background
      contrast: '#292929', // bit lighter dark background
      secondary: '#333333', // bit lighter dark content box background
    },
    text: {
      primary: '#ffffff', // White text for readability
      secondary: '#b0b0b0', // Light gray for less prominent text
    },
  },
};

export const lightThemeSettings = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue accent for active elements
    },
    background: {
      default: '#ffffff', // light background
      paper: '#F4F4F4', // light content box background
      contrast: '#EAEAEA', // bit dark-light background
      secondary: '#D9D9D9', // bit dark-light content box background
    },
    text: {
      primary: '#000000', // Black text for readability
      secondary: '#555555', // Gray for less prominent text
    },
  },
};
