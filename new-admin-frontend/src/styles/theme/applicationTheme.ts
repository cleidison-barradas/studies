import themePalette from './themePaletteMode'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { ThemeOptions } from '@material-ui/core'

export default (color: string, mode: string, direction: any) =>
  ({
    direction,
    palette: {
      type: mode,
      primary: {
        light: themePalette(color, mode).palette.primary.light,
        dark: themePalette(color, mode).palette.primary.dark,
        main: themePalette(color, mode).palette.primary.main,
        contrastText: themePalette(color, mode).palette.primary.contrastText,
      },
      secondary: {
        light: themePalette(color, mode).palette.secondary.light,
        lighter: themePalette(color, mode).palette.secondary.lighter,
        dark: themePalette(color, mode).palette.secondary.dark,
        darker: themePalette(color, mode).palette.secondary.darker,
        main: themePalette(color, mode).palette.secondary.main,
        contrastText: themePalette(color, mode).palette.secondary.contrastText,
      },
      purple: {
        primary: {
          dark: themePalette(color, mode).palette.purple.primary.dark,
          light: themePalette(color, mode).palette.purple.primary.light,
          contrastText: '',
          main: '',
        },
      },
      white: {
        dark: themePalette(color, mode).palette.white.dark,
        light: themePalette(color, mode).palette.white.light,
        contrastText: '',
        main: '',
      },
      orange: themePalette(color, mode).palette.orange,
      black: {
        primary: {
          dark: themePalette(color, mode).palette.black.primary.dark,
          light: themePalette(color, mode).palette.black.primary.light,
          contrastText: '',
          main: '',
        },
      },
      red: {
        dark: themePalette(color, mode).palette.red.dark,
        light: themePalette(color, mode).palette.red.light,
        contrastText: '',
        main: '',
      },
      yellow: {
        primary: {
          dark: themePalette(color, mode).palette.yellow.primary.dark,
          light: themePalette(color, mode).palette.yellow.primary.light,
          contrastText: '',
          main: '',
        },
      },
      grey: {
        primary: {
          dark: themePalette(color, mode).palette.grey.primary.dark,
          light: themePalette(color, mode).palette.grey.primary.light,
        },
      },
      select: {
        dark: themePalette(color, mode).palette.select.dark,
        light: themePalette(color, mode).palette.select.light,
        contrastText: '',
        main: '',
      },
      green: {
        dark: themePalette(color, mode).palette.green.dark,
        light: themePalette(color, mode).palette.green.light,
        contrastText: '',
        main: '',
      },

      action: {
        hover: mode === 'dark' ? 'rgba(80,80,80, 0.9)' : 'rgba(80,80,80, 0.05)',
        hoverOpacity: 0.05,
      },
    },
    typography: {
      useNextVariants: true,
      fontFamily: ['Raleway', 'Open Sans', 'sans-serif'].join(','),
      title: {
        fontWeight: 600,
      },
      body2: {
        fontWeight: 500,
      },
      fontWeightMedium: 600,
    },
    shade: {
      light: '0 10px 15px -5px rgba(62, 57, 107, .07)',
    },
    glow: {
      light: `0 2px 20px -5px ${themePalette(color, mode).palette.primary.main}`,
      medium: `0 2px 40px -5px ${themePalette(color, mode).palette.primary.main}`,
      dark: `0 2px 40px 0px ${themePalette(color, mode).palette.primary.main}`,
    },
    rounded: {
      small: '8px',
      medium: '12px',
      big: '20px',
    },
    shadows:
      mode === 'dark'
        ? [
            'none',
            '0px 1px 3px 0px rgba(50,50,50, 0.2),0px 1px 1px 0px rgba(50,50,50, 0.14),0px 2px 1px -1px rgba(50,50,50, 0.12)',
            '0px 1px 5px 0px rgba(50,50,50, 0.2),0px 2px 2px 0px rgba(50,50,50, 0.14),0px 3px 1px -2px rgba(50,50,50, 0.12)',
            '0px 1px 8px 0px rgba(50,50,50, 0.2),0px 3px 4px 0px rgba(50,50,50, 0.14),0px 3px 3px -2px rgba(50,50,50, 0.12)',
            '0px 2px 4px -1px rgba(50,50,50, 0.2),0px 4px 5px 0px rgba(50,50,50, 0.14),0px 1px 10px 0px rgba(50,50,50, 0.12)',
            '0px 3px 5px -1px rgba(50,50,50, 0.2),0px 5px 8px 0px rgba(50,50,50, 0.14),0px 1px 14px 0px rgba(50,50,50, 0.12)',
            '0px 3px 5px -1px rgba(50,50,50, 0.2),0px 6px 10px 0px rgba(50,50,50, 0.14),0px 1px 18px 0px rgba(50,50,50, 0.12)',
            '0px 4px 5px -2px rgba(50,50,50, 0.2),0px 7px 10px 1px rgba(50,50,50, 0.14),0px 2px 16px 1px rgba(50,50,50, 0.12)',
            '0px 5px 5px -3px rgba(50,50,50, 0.2),0px 8px 10px 1px rgba(50,50,50, 0.14),0px 3px 14px 2px rgba(50,50,50, 0.12)',
            '0px 5px 6px -3px rgba(50,50,50, 0.2),0px 9px 12px 1px rgba(50,50,50, 0.14),0px 3px 16px 2px rgba(50,50,50, 0.12)',
            '0px 6px 6px -3px rgba(50,50,50, 0.2),0px 10px 14px 1px rgba(50,50,50, 0.14),0px 4px 18px 3px rgba(50,50,50, 0.12)',
            '0px 6px 7px -4px rgba(50,50,50, 0.2),0px 11px 15px 1px rgba(50,50,50, 0.14),0px 4px 20px 3px rgba(50,50,50, 0.12)',
            '0px 7px 8px -4px rgba(50,50,50, 0.2),0px 12px 17px 2px rgba(50,50,50, 0.14),0px 5px 22px 4px rgba(50,50,50, 0.12)',
            '0px 7px 8px -4px rgba(50,50,50, 0.2),0px 13px 19px 2px rgba(50,50,50, 0.14),0px 5px 24px 4px rgba(50,50,50, 0.12)',
            '0px 7px 9px -4px rgba(50,50,50, 0.2),0px 14px 21px 2px rgba(50,50,50, 0.14),0px 5px 26px 4px rgba(50,50,50, 0.12)',
            '0px 8px 9px -5px rgba(50,50,50, 0.2),0px 15px 22px 2px rgba(50,50,50, 0.14),0px 6px 28px 5px rgba(50,50,50, 0.12)',
            '0px 8px 10px -5px rgba(50,50,50, 0.2),0px 16px 24px 2px rgba(50,50,50, 0.14),0px 6px 30px 5px rgba(50,50,50, 0.12)',
            '0px 8px 11px -5px rgba(50,50,50, 0.2),0px 17px 26px 2px rgba(50,50,50, 0.14),0px 6px 32px 5px rgba(50,50,50, 0.12)',
            '0px 9px 11px -5px rgba(50,50,50, 0.2),0px 18px 28px 2px rgba(50,50,50, 0.14),0px 7px 34px 6px rgba(50,50,50, 0.12)',
            '0px 9px 12px -6px rgba(50,50,50, 0.2),0px 19px 29px 2px rgba(50,50,50, 0.14),0px 7px 36px 6px rgba(50,50,50, 0.12)',
            '0px 10px 13px -6px rgba(50,50,50, 0.2),0px 20px 31px 3px rgba(50,50,50, 0.14),0px 8px 38px 7px rgba(50,50,50, 0.12)',
            '0px 10px 13px -6px rgba(50,50,50, 0.2),0px 21px 33px 3px rgba(50,50,50, 0.14),0px 8px 40px 7px rgba(50,50,50, 0.12)',
            '0px 10px 14px -6px rgba(50,50,50, 0.2),0px 22px 35px 3px rgba(50,50,50, 0.14),0px 8px 42px 7px rgba(50,50,50, 0.12)',
            '0px 11px 14px -7px rgba(50,50,50, 0.2),0px 23px 36px 3px rgba(50,50,50, 0.14),0px 9px 44px 8px rgba(50,50,50, 0.12)',
            '0px 11px 15px -7px rgba(50,50,50, 0.2),0px 24px 38px 3px rgba(850,50,50 0.14),0px 9px 46px 8px rgba(50,50,50, 0.12)',
          ]
        : [
            'none',
            '0px 1px 3px 0px rgba(80,80,80, 0.2),0px 1px 1px 0px rgba(80,80,80, 0.14),0px 2px 1px -1px rgba(80,80,80, 0.12)',
            '0px 1px 5px 0px rgba(80,80,80, 0.2),0px 2px 2px 0px rgba(80,80,80, 0.14),0px 3px 1px -2px rgba(80,80,80, 0.12)',
            '0px 1px 8px 0px rgba(80,80,80, 0.2),0px 3px 4px 0px rgba(80,80,80, 0.14),0px 3px 3px -2px rgba(80,80,80, 0.12)',
            '0px 2px 4px -1px rgba(80,80,80, 0.2),0px 4px 5px 0px rgba(80,80,80, 0.14),0px 1px 10px 0px rgba(80,80,80, 0.12)',
            '0px 3px 5px -1px rgba(80,80,80, 0.2),0px 5px 8px 0px rgba(80,80,80, 0.14),0px 1px 14px 0px rgba(80,80,80, 0.12)',
            '0px 3px 5px -1px rgba(80,80,80, 0.2),0px 6px 10px 0px rgba(80,80,80, 0.14),0px 1px 18px 0px rgba(80,80,80, 0.12)',
            '0px 4px 5px -2px rgba(80,80,80, 0.2),0px 7px 10px 1px rgba(80,80,80, 0.14),0px 2px 16px 1px rgba(80,80,80, 0.12)',
            '0px 5px 5px -3px rgba(80,80,80, 0.2),0px 8px 10px 1px rgba(80,80,80, 0.14),0px 3px 14px 2px rgba(80,80,80, 0.12)',
            '0px 5px 6px -3px rgba(80,80,80, 0.2),0px 9px 12px 1px rgba(80,80,80, 0.14),0px 3px 16px 2px rgba(80,80,80, 0.12)',
            '0px 6px 6px -3px rgba(80,80,80, 0.2),0px 10px 14px 1px rgba(80,80,80, 0.14),0px 4px 18px 3px rgba(80,80,80, 0.12)',
            '0px 6px 7px -4px rgba(80,80,80, 0.2),0px 11px 15px 1px rgba(80,80,80, 0.14),0px 4px 20px 3px rgba(80,80,80, 0.12)',
            '0px 7px 8px -4px rgba(80,80,80, 0.2),0px 12px 17px 2px rgba(80,80,80, 0.14),0px 5px 22px 4px rgba(80,80,80, 0.12)',
            '0px 7px 8px -4px rgba(80,80,80, 0.2),0px 13px 19px 2px rgba(80,80,80, 0.14),0px 5px 24px 4px rgba(80,80,80, 0.12)',
            '0px 7px 9px -4px rgba(80,80,80, 0.2),0px 14px 21px 2px rgba(80,80,80, 0.14),0px 5px 26px 4px rgba(80,80,80, 0.12)',
            '0px 8px 9px -5px rgba(80,80,80, 0.2),0px 15px 22px 2px rgba(80,80,80, 0.14),0px 6px 28px 5px rgba(80,80,80, 0.12)',
            '0px 8px 10px -5px rgba(80,80,80, 0.2),0px 16px 24px 2px rgba(80,80,80, 0.14),0px 6px 30px 5px rgba(80,80,80, 0.12)',
            '0px 8px 11px -5px rgba(80,80,80, 0.2),0px 17px 26px 2px rgba(80,80,80, 0.14),0px 6px 32px 5px rgba(80,80,80, 0.12)',
            '0px 9px 11px -5px rgba(80,80,80, 0.2),0px 18px 28px 2px rgba(80,80,80, 0.14),0px 7px 34px 6px rgba(80,80,80, 0.12)',
            '0px 9px 12px -6px rgba(80,80,80, 0.2),0px 19px 29px 2px rgba(80,80,80, 0.14),0px 7px 36px 6px rgba(80,80,80, 0.12)',
            '0px 10px 13px -6px rgba(80,80,80, 0.2),0px 20px 31px 3px rgba(80,80,80, 0.14),0px 8px 38px 7px rgba(80,80,80, 0.12)',
            '0px 10px 13px -6px rgba(80,80,80, 0.2),0px 21px 33px 3px rgba(80,80,80, 0.14),0px 8px 40px 7px rgba(80,80,80, 0.12)',
            '0px 10px 14px -6px rgba(80,80,80, 0.2),0px 22px 35px 3px rgba(80,80,80, 0.14),0px 8px 42px 7px rgba(80,80,80, 0.12)',
            '0px 11px 14px -7px rgba(80,80,80, 0.2),0px 23px 36px 3px rgba(80,80,80, 0.14),0px 9px 44px 8px rgba(80,80,80, 0.12)',
            '0px 11px 15px -7px rgba(80,80,80, 0.2),0px 24px 38px 3px rgba(80,80,80, 0.14),0px 9px 46px 8px rgba(80,80,80, 0.12)',
          ],
    overrides: {
      MuiBackdrop: {
        invisible: {
          backgroundColor: themePalette(color, mode).palette.secondary.lighter,
        },
      },
      MuiAlert: {
        root: {
          alignItems: 'center',
          '& .MuiAlert-icon': {
            color: `${themePalette(color, mode).palette.white.dark} !important`,
          },
          '& .MuiIconButton-root': {
            color: `${themePalette(color, mode).palette.white.dark} !important`,
          },
          '& MuiAlert-message': {
            color: `${themePalette(color, mode).palette.white.dark} !important`,
          },
        },
        standardSuccess: {
          color: themePalette(color, mode).palette.white.dark,
          backgroundColor:
            mode === 'dark' ? themePalette(color, mode).palette.green.dark : themePalette(color, mode).palette.green.light,
        },
        standardInfo: {
          backgroundColor:
            mode === 'dark' ? themePalette(color, mode).palette.primary.dark : themePalette(color, mode).palette.primary.main,
          color: themePalette(color, mode).palette.white.dark,
        },
        standardError: {
          backgroundColor:
            mode === 'dark' ? themePalette(color, mode).palette.red.dark : themePalette(color, mode).palette.red.light,
          color: themePalette(color, mode).palette.white.dark,
        },
        standardWarning: {
          backgroundColor: themePalette(color, mode).palette.orange,
          color: mode === 'dark' ? themePalette(color, mode).palette.white.dark : themePalette(color, mode).palette.white.light,
        },
      },
      Switch: {
        thumbOnColor: 'yellow',
        trackOnColor: 'red',
      },
      MuiRadio: {
        root: {
          color:
            mode === 'dark'
              ? themePalette(color, mode).palette.grey.primary.dark
              : themePalette(color, mode).palette.grey.primary.light,
        },
      },
      MuiOutlinedInput: {
        root: {
          '& $notchedOutline': {
            borderColor: 'rgba(0,0,0,0.4)',
          },
          borderRadius: 20,
          '&:hover $notchedOutline': {
            borderColor: themePalette(color, mode).palette.primary.main,
          },
        },
        input: {
          paddingBottom: 8,
          padding: '8px 8px',
        },
      },
      MuiPaper: {
        root: {
          backgroundColor:
            mode === 'light' ? themePalette(color, mode).palette.white.dark : themePalette(color, mode).palette.white.light,
          color:
            mode === 'dark'
              ? themePalette(color, mode).palette.black.primary.dark
              : themePalette(color, mode).palette.black.primary.light,
        },
        rounded: {
          borderRadius: 20,
        },
        elevation1: {
          boxShadow:
            mode === 'dark'
              ? '0px 1px 3px 0px rgba(64, 64, 64, 1), 0px 1px 1px 0px rgba(42, 42, 42, 1), 0px 2px 1px -1px rgba(20, 20, 20, 1)'
              : '0px 1px 3px 0px rgba(142, 142, 142, 0.2), 0px 1px 1px 0px rgba(243, 243, 243, 0.14), 0px 2px 1px -1px rgba(204, 204, 204, 0.12)',
        },
        elevation4: {
          boxShadow:
            mode === 'dark'
              ? '0px 2px 4px -1px rgba(64, 64, 64, 0.46), 0px 4px 5px 0px rgba(42, 42, 42, 0.32), 0px 1px 10px 0px rgba(20, 20, 20, 0.12)'
              : '0px 2px 4px -1px rgba(142, 142, 142, 0.2), 0px 4px 5px 0px rgba(243, 243, 243, 0.14), 0px 1px 10px 0px rgba(204, 204, 204, 0.12)',
        },
      },
      MuiButton: {
        contained: {
          boxShadow: 'none',
        },
        root: {
          paddingLeft: 40,
          paddingRight: 40,
          borderRadius: 20,
          fontWeight: 400,
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.grey.primary.light
              : themePalette(color, mode).palette.grey.primary.dark,
        },
        sizeSmall: {
          padding: '7px 12px',
        },
        outlined: {
          borderColor:
            mode === 'light'
              ? themePalette(color, mode).palette.grey.primary.light
              : themePalette(color, mode).palette.grey.primary.dark,
        },
      },
      MuiTypography: {
        root: {
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.black.primary.light
              : themePalette(color, mode).palette.black.primary.dark,
          '@media print': {
            fontWeight: '700 !important',
          },
        },
        button: {
          fontWeight: 600,
        },
      },
      MuiCheckbox: {
        colorSecondary: {
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.grey.primary.light
              : themePalette(color, mode).palette.grey.primary.dark,
        },
        root: {
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.grey.primary.light
              : themePalette(color, mode).palette.grey.primary.dark,
        },
      },
      MuiIconButton: {
        root: {
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.grey.primary.light
              : themePalette(color, mode).palette.grey.primary.dark,
        },
      },
      MuiInput: {
        root: {
          border: mode === 'light' ? '1px solid #B8C5D0' : '1px solid #B8C5D0',
          borderRadius: 20,
          alignItems: 'center',
          transition: 'border 0.3s ease',
          '& .MuiInputAdornment-root': {
            alignItems: 'center',
            '& .MuiIconButton-root': {
              color:
                mode === 'light'
                  ? themePalette(color, mode).palette.grey.primary.light
                  : themePalette(color, mode).palette.grey.primary.dark,
            },
            '& .MuiTypography-root': {
              color:
                mode === 'light'
                  ? themePalette(color, mode).palette.grey.primary.light
                  : themePalette(color, mode).palette.grey.primary.dark,
            },
            '& img,svg': {
              paddingLeft: 8,
            },
          },
        },

        underline: {
          '&:after': {
            height: 'calc(100% + 1px)',
            borderRadius: 8,
            bottom: -1,
            boxShadow: `0 0 1px ${themePalette(color, mode).palette.primary.main}`,
          },
          '&:before': {
            display: 'none',
          },
        },
        input: {
          padding: 10,
          fontSize: 14,
          color: mode === 'light' ? '#000000' : '#080820',
          '&::placeholder': {
            color:
              mode === 'light'
                ? themePalette(color, mode).palette.grey.primary.light
                : themePalette(color, mode).palette.grey.primary.dark,
          },
        },
        multiline: {
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 24,
        },
      },
      MuiInputLabel: {
        formControl: {
          top: 4,
          left: 10,
          transform: 'translate(0, 22px) scale(1)',
        },
        shrink: {
          transform: 'translate(0, 13px) scale(0.7)',
          zIndex: 1,
          top: 8,
        },
        filled: {
          transform: 'translate(2px, 6px) scale(1)',
          '&$shrink': {
            transform: 'translate(0px, -6px) scale(0.75)',
          },
        },
        outlined: {
          transform: 'translate(2px, 6px) scale(1)',
          '&$shrink': {
            transform: 'translate(4px, -16px) scale(0.75)',
          },
        },
      },
      MuiFormLabel: {
        root: {
          color: 'grey',
        },
      },
      MuiFormHelperText: {
        root: {
          paddingLeft: 5,
        },
      },
      MuiSelect: {
        root: {
          borderRadius: 20,
        },
        icon: {
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.grey.primary.light
              : themePalette(color, mode).palette.grey.primary.dark,
          top: 'calc(50% - 10px)',
          right: 0,
        },
      },
      MuiFormControl: {
        root: {},
      },
      MuiInputAdornment: {
        root: {
          alignItems: 'center',
          paddingLeft: 0,
          paddingRight: 0,
          '& button': {
            width: 32,
            height: 32,
            padding: 0,
          },
          '& p': {
            minWidth: 24,
            lineHeight: '16px',
          },
          '& svg': {
            top: 1,
            position: 'relative',
          },
        },
        positionStart: {
          marginLeft: 8,
        },
        positionEnd: {
          marginRight: 0,
        },
      },
      MuiToolbar: {
        root: {
          borderRadius: 8,
        },
      },
      MuiPickersModal: {
        dialogRoot: {
          backgroundColor:
            mode === 'dark' ? themePalette(color, mode).palette.secondary.darker : themePalette(color, mode).palette.white.dark,
        },
      },
      MuiPickersTimePickerToolbar: {
        hourMinuteLabelReverse: {
          flexDirection: 'row',
        },
      },
      MuiPickersCalendarHeader: {
        iconButton: {
          backgroundColor: 'transparent',
          color: mode === 'dark' ? themePalette(color, mode).palette.white.dark : themePalette(color, mode).palette.primary.light,
          transform: 'rotate(180deg)',
        },
        transitionContainer: {
          '& .MuiTypography-root': {
            color: mode === 'dark' ? themePalette(color, mode).palette.white.dark : themePalette(color, mode).palette.white.light,
          },
        },
      },
      MuiTable: {
        root: {
          minWidth: 1200,
        },
      },
      MuiTableCell: {
        root: {
          borderBottom:
            mode === 'dark'
              ? `1px solid ${themePalette(color, mode).palette.grey.primary.dark}`
              : `1px solid ${themePalette(color, mode).palette.grey.primary.light}`,
        },
        head: {
          fontWeight: 700,
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.black.primary.light
              : themePalette(color, mode).palette.black.primary.dark,
          paddingLeft: 0,
        },
        body: {
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.black.primary.light
              : themePalette(color, mode).palette.black.primary.dark,
        },
      },
      MuiListItemText: {
        root: {
          whiteSpace: 'nowrap',
        },
      },
      MuiListItem: {
        button: {
          '&:hover': {
            backgroundColor:
              mode === 'light'
                ? fade(themePalette(color, mode).palette.secondary.light, 0.15)
                : fade(themePalette(color, mode).palette.secondary.dark, 0.15),
          },
        },
      },
      MuiLinearProgress: {
        root: {
          borderRadius: 16,
        },
        bar: {
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: mode === 'dark' ? '#616161' : '#ededed',
        },
      },
      MuiTablePagination: {
        input: {
          marginRight: 32,
          marginLeft: 8,
        },
        selectRoot: {
          marginLeft: 0,
          marginRight: 0,
        },
        select: {
          paddingRight: 24,
        },
        selectIcon: {
          top: 4,
        },
        root: {
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.grey.primary.light
              : themePalette(color, mode).palette.grey.primary.dark,
        },
        actions: {
          '& .MuiIconButton-root': {
            color:
              mode === 'light'
                ? themePalette(color, mode).palette.grey.primary.light
                : themePalette(color, mode).palette.grey.primary.dark,
            transform: 'rotate(180deg)',
          },
        },
      },
      MuiPickersToolbar: {
        toolbar: {
          borderRadius: 0,
          boxShadow: 'inset 0 -30px 120px -30px rgba(0, 0, 0, 0.3)',
        },
      },
      MuiPickersClock: {
        clock: {
          backgroundColor: 'none',
          border: `1px solid ${themePalette(color, mode).palette.primary.main}`,
        },
      },
      MuiPickersClockPointer: {
        thumb: {
          boxShadow: `0 1px 10px 0px ${themePalette(color, mode).palette.primary.main}`,
        },
      },
      MuiPickerDTTabs: {
        tabs: {
          backgroundColor: 'transparent',
          color: themePalette(color, mode).palette.primary.main,
        },
      },
      MuiCircularProgress: {
        colorSecondary: {
          color: themePalette(color, mode).palette.white.dark,
        },
      },
      MuiChip: {
        root: {
          backgroundColor: themePalette(color, mode).palette.grey.primary.light,
          color: themePalette(color, mode).palette.white.light,
        },
        icon: {
          color: themePalette(color, mode).palette.white.light,
        },
        deleteIcon: {
          color: mode === 'dark' ? themePalette(color, mode).palette.white.dark : themePalette(color, mode).palette.white.light,
        },
      },
      MuiDrawer: {
        root: {
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
        },
      },
      MuiExpansionPanel: {
        root: {
          '&:first-child': {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
          '&:last-child': {
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          },
          '&$expanded': {
            borderRadius: 16,
            boxShadow: `0px 0px 0px 1px ${themePalette(color, mode).palette.primary.main}`,
            '& + div': {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          },
        },
      },
      MuiDialogTitle: {
        root: {
          padding: '16px',
          position: 'relative',
          '& h2': {
            fontWeight: 400,
            color:
              mode === 'dark'
                ? themePalette(color, mode).palette.black.primary.dark
                : themePalette(color, mode).palette.black.primary.light,
          },
        },
      },
      MuiDialogContent: {
        root: {
          padding: '8px 16px',
        },
        dividers: {
          borderTopColor:
            mode === 'dark'
              ? themePalette(color, mode).palette.grey.primary.dark
              : themePalette(color, mode).palette.grey.primary.light,
          borderBottomColor:
            mode === 'dark'
              ? themePalette(color, mode).palette.grey.primary.dark
              : themePalette(color, mode).palette.grey.primary.light,
        },
      },
      MuiDivider: {
        root: {
          backgroundColor:
            mode === 'dark'
              ? themePalette(color, mode).palette.grey.primary.dark
              : themePalette(color, mode).palette.grey.primary.light,
        },
      },
      MuiSnackbarContent: {
        root: {
          '@media (min-width: 960px)': {
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        root: {
          boxShadow: 'none',
        },
        colorPrimary: {
          backgroundColor:
            mode === 'dark' ? themePalette(color, mode).palette.primary.dark : themePalette(color, mode).palette.primary.main,
        },
      },
      MuiTabs: {
        root: {
          borderRadius: 10,
        },
        indicator: {
          borderRadius: '10px 10px 0 0',
          height: 4,
        },
      },
      MuiToggleButtonGroup: {
        root: {
          overflow: 'hidden',
          borderRadius: 8,
          boxShadow: 'none',
          border: `1px solid ${themePalette(color, mode).palette.secondary.main}`,
        },
      },
      MuiToggleButton: {
        root: {
          height: 32,
          boxShadow: 'none !important',
          '&$selected': {
            color: themePalette(color, mode).palette.secondary.main,
            backgroundColor: themePalette(color, mode).palette.secondary.light,
          },
        },
      },
      MUIDataTableToolbarSelect: {
        root: {
          boxShadow: 'none',
          backgroundColor:
            mode === 'dark'
              ? themePalette(color, mode).palette.secondary.dark
              : themePalette(color, mode).palette.secondary.light,
        },
        title: {
          padding: direction === 'rtl' ? '0 26px 0 0' : '0 0 0 26px',
        },
        deleteIcon: {
          color: mode === 'dark' ? '#FFF' : '#000',
        },
      },
      MuiTreeItem: {
        root: {
          '&$selected > $content $label': {
            backgroundColor: 'transparent !important',
          },
          '&$expanded > $content $iconContainer svg': {
            transform: 'rotate(180deg)',
          },
          '&$focus > $content $label': {
            backgroundColor: 'transparent !important',
          },
        },
        content: {
          flexDirection: 'row-reverse',
        },
        label: {
          '&:hover': {
            backgroundColor: 'transparent   !important',
          },
        },
      },
      MuiSwitch: {
        root: {
          direction: 'ltr',
        },
        track: {
          backgroundColor:
            mode === 'dark'
              ? themePalette(color, mode).palette.grey.primary.dark
              : themePalette(color, mode).palette.grey.primary.light,
        },
        switchBase: {
          '&$checked': {
            color: mode === 'dark' ? themePalette(color, mode).palette.green.dark : themePalette(color, mode).palette.green.light,
          },
          '&$disabled': {
            color: '#ff',
            '&$checked': {
              color:
                mode === 'dark' ? themePalette(color, mode).palette.green.dark : themePalette(color, mode).palette.green.light,
            },
            '&$checked + $track': {
              backgroundColor: 'black',
            },
          },
          '&$checked + $track': {
            backgroundColor: '#00BF91',
          },
        },
      },
      MuiInputBase: {
        root: {
          color: 'transparent',
        },
        input: {
          flex: 1,
          color:
            mode === 'light'
              ? themePalette(color, mode).palette.black.primary.light
              : themePalette(color, mode).palette.black.primary.dark,
        },
      },
    },
  } as ThemeOptions)
