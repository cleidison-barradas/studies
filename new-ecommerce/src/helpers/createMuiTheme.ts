import { createTheme } from '@mui/material'
import Theme from '../interfaces/theme/Theme'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
  }
}

export const CreateMuiTheme = ({ color }: Theme) => {
  return createTheme({
    palette: {
      primary: {
        main: color.primary.medium,
      },
      secondary: {
        main: color.secondary.medium,
      },
      neutral: {
        main: color.neutral.light,
        contrastText: color.neutral.darkest,
      },
    },
    typography: {
      fontFamily: ['Poppins', 'sans-serif'].join(','),
      fontSize: 14,
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: color.neutral.darkest,
          },
          subtitle1: {
            color: color.neutral.dark,
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            ':hover': {
              cursor: 'pointer',
            },
          },
        },
      },
      MuiButton: {
        variants: [
          {
            props: {
              color: 'neutral',
            },
            style: {
              ':hover': {
                backgroundColor: color.neutral.medium,
              },
            },
          },
        ],
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontSize: '16px',
          },
          containedSecondary: {
            color: color.cta,
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginLeft: 0,
          },
        },
      },
    },
  })
}
