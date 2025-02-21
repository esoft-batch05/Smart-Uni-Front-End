import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const primary = {
  lighter: '#FFEED1',
  light: '#FFB627',
  main: '#FF8602',
  dark: '#CC5803',
  darker: '#993D00',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#FFD9B3',
  light: '#FFB27D',
  main: '#FF8602',
  dark: '#B35C00',
  darker: '#7A3E00',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#D6F0FF',
  light: '#80D4FF',
  main: '#0096FF',
  dark: '#005DB2',
  darker: '#003D80',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#E1F8E7',
  light: '#6BD48E',
  main: '#00A76F',
  dark: '#00795B',
  darker: '#004B40',
  contrastText: '#FFFFFF',
};

export const warning = {
  lighter: '#FFF4D1',
  light: '#FFD566',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFE3E3',
  light: '#FFA3A3',
  main: '#FF4D4D',
  dark: '#B71C1C',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#000000',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(primary.main, 0.08),
  selected: alpha(primary.main, 0.16),
  disabled: alpha(primary.main, 0.8),
  disabledBackground: alpha(primary.main, 0.24),
  focus: alpha(primary.main, 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(primary.main, 0.2),
  action,
};

// ----------------------------------------------------------------------

export function palette() {
  return {
    ...base,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: grey[100],
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: primary.dark,
    },
  };
}
