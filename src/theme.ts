import { createTheme } from '@mui/material';

// export const theme = createTheme({
//     palette: {
//         mode: 'dark',
//     },
// });

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1000,
      lg: 1200,
      xl: 1920
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none'
        },
        sizeSmall: {
          padding: '6px 16px'
        },
        sizeMedium: {
          padding: '8px 20px'
        },
        sizeLarge: {
          padding: '11px 24px'
        },
        textSizeSmall: {
          padding: '7px 12px'
        },
        textSizeMedium: {
          padding: '9px 16px'
        },
        textSizeLarge: {
          padding: '12px 16px'
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '32px 24px',
          '&:last-child': {
            paddingBottom: '32px'
          }
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6'
        },
        subheaderTypographyProps: {
          variant: 'body2'
        }
      },
      styleOverrides: {
        root: {
          padding: '32px 24px'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%'
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%'
        },
        '#__next': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          height: '100%',
          width: '100%'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: '#E6E8F0'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F3F4F6',
          '.MuiTableCell-root': {
            color: '#374151'
          },
          borderBottom: 'none',
          '& .MuiTableCell-root': {
            borderBottom: 'none',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: 0.5,
            textTransform: 'uppercase'
          },
          '& .MuiTableCell-paddingCheckbox': {
            paddingTop: 4,
            paddingBottom: 4
          }
        }
      }
    }
  },
  palette: {
    mode: 'dark',
    // neutral: {
    //   100: '#F3F4F6',
    //   200: '#E5E7EB',
    //   300: '#D1D5DB',
    //   400: '#9CA3AF',
    //   500: '#6B7280',
    //   600: '#4B5563',
    //   700: '#374151',
    //   800: '#1F2937',
    //   900: '#111827'
    // },
    // action: {
    //   active: '#6B7280',
    //   focus: 'rgba(55, 65, 81, 0.12)',
    //   hover: 'rgba(55, 65, 81, 0.04)',
    //   selected: 'rgba(55, 65, 81, 0.08)',
    //   disabledBackground: 'rgba(55, 65, 81, 0.12)',
    //   disabled: 'rgba(55, 65, 81, 0.26)'
    // },
    // background: {
    //   default: '#F9FAFC',
    //   paper: '#FFFFFF'
    // },
    // divider: '#E6E8F0',
    // primary: {
    //   main: '#5048E5',
    //   light: '#828DF8',
    //   dark: '#3832A0',
    //   contrastText: '#FFFFFF'
    // },
    // secondary: {
    //   main: '#10B981',
    //   light: '#3FC79A',
    //   dark: '#0B815A',
    //   contrastText: '#FFFFFF'
    // },
    // success: {
    //   main: '#14B8A6',
    //   light: '#43C6B7',
    //   dark: '#0E8074',
    //   contrastText: '#FFFFFF'
    // },
    // info: {
    //   main: '#2196F3',
    //   light: '#64B6F7',
    //   dark: '#0B79D0',
    //   contrastText: '#FFFFFF'
    // },
    // warning: {
    //   main: '#FFB020',
    //   light: '#FFBF4C',
    //   dark: '#B27B16',
    //   contrastText: '#FFFFFF'
    // },
    // error: {
    //   main: '#D14343',
    //   light: '#DA6868',
    //   dark: '#922E2E',
    //   contrastText: '#FFFFFF'
    // },
    // text: {
    //   primary: '#121828',
    //   secondary: '#65748B',
    //   disabled: 'rgba(55, 65, 81, 0.48)'
    // }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)',
    '0px 1px 2px rgba(100, 116, 139, 0.12)',
    '0px 1px 4px rgba(100, 116, 139, 0.12)',
    '0px 1px 5px rgba(100, 116, 139, 0.12)',
    '0px 1px 6px rgba(100, 116, 139, 0.12)',
    '0px 2px 6px rgba(100, 116, 139, 0.12)',
    '0px 3px 6px rgba(100, 116, 139, 0.12)',
    '0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)',
    '0px 5px 12px rgba(100, 116, 139, 0.12)',
    '0px 5px 14px rgba(100, 116, 139, 0.12)',
    '0px 5px 15px rgba(100, 116, 139, 0.12)',
    '0px 6px 15px rgba(100, 116, 139, 0.12)',
    '0px 7px 15px rgba(100, 116, 139, 0.12)',
    '0px 8px 15px rgba(100, 116, 139, 0.12)',
    '0px 9px 15px rgba(100, 116, 139, 0.12)',
    '0px 10px 15px rgba(100, 116, 139, 0.12)',
    '0px 12px 22px -8px rgba(100, 116, 139, 0.25)',
    '0px 13px 22px -8px rgba(100, 116, 139, 0.25)',
    '0px 14px 24px -8px rgba(100, 116, 139, 0.25)',
    '0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)',
    '0px 25px 50px rgba(100, 116, 139, 0.25)'
  ],
  typography: {
    button: {
      fontWeight: 600
    },
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase'
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66
    },
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.375
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.375
    },
    h3: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.375
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.375
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.375
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.375
    }
  }
});

// import { createTheme } from '@mui/material/styles';
// import { green, grey, red } from '@mui/material/colors';

// const rawTheme = createTheme({
//   palette: {
//     primary: {
//       light: '#69696a',
//       main: '#28282a',
//       dark: '#1e1e1f',
//     },
//     secondary: {
//       light: '#fff5f8',
//       main: '#ff3366',
//       dark: '#e62958',
//     },
//     warning: {
//       main: '#ffc071',
//       dark: '#ffb25e',
//     },
//     error: {
//       light: red[50],
//       main: red[500],
//       dark: red[700],
//     },
//     success: {
//       light: green[50],
//       main: green[500],
//       dark: green[700],
//     },
//   },
//   typography: {
//     fontFamily: "'Work Sans', sans-serif",
//     fontSize: 14,
//     fontWeightLight: 300, // Work Sans
//     fontWeightRegular: 400, // Work Sans
//     fontWeightMedium: 700, // Roboto Condensed
//   },
// });

// const fontHeader = {
//   color: rawTheme.palette.text.primary,
//   fontWeight: rawTheme.typography.fontWeightMedium,
//   fontFamily: "'Roboto Condensed', sans-serif",
//   textTransform: 'uppercase',
// };

// export const theme = {
//   ...rawTheme,
//   palette: {
//     ...rawTheme.palette,
//     background: {
//       ...rawTheme.palette.background,
//       default: rawTheme.palette.common.white,
//       placeholder: grey[200],
//     },
//   },
//   typography: {
//     ...rawTheme.typography,
//     fontHeader,
//     h1: {
//       ...rawTheme.typography.h1,
//       ...fontHeader,
//       letterSpacing: 0,
//       fontSize: 60,
//     },
//     h2: {
//       ...rawTheme.typography.h2,
//       ...fontHeader,
//       fontSize: 48,
//     },
//     h3: {
//       ...rawTheme.typography.h3,
//       ...fontHeader,
//       fontSize: 42,
//     },
//     h4: {
//       ...rawTheme.typography.h4,
//       ...fontHeader,
//       fontSize: 36,
//     },
//     h5: {
//       ...rawTheme.typography.h5,
//       fontSize: 20,
//       fontWeight: rawTheme.typography.fontWeightLight,
//     },
//     h6: {
//       ...rawTheme.typography.h6,
//       ...fontHeader,
//       fontSize: 18,
//     },
//     subtitle1: {
//       ...rawTheme.typography.subtitle1,
//       fontSize: 18,
//     },
//     body1: {
//       ...rawTheme.typography.body2,
//       fontWeight: rawTheme.typography.fontWeightRegular,
//       fontSize: 16,
//     },
//     body2: {
//       ...rawTheme.typography.body1,
//       fontSize: 14,
//     },
//   },
// };

// export default theme;