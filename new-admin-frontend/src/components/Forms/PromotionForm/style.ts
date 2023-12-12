import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    textfield: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 4,
        width: 700,
      },
      '& .MuiInputLabel-outlined': {
        top: 12,
      },
      '& .MuiOutlinedInput-input': {
        paddingTop: 16,
        paddingBottom: 16,
      },
    },
    paperWidthSm: {
      width: '100%',
      maxWidth: 550,
    },
    section: {
      marginBottom: theme.spacing(2),
      width: 1150,
    },
    adornment: {
      '& .MuiTypography-root': {
        color: `${theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark} !important`,
      },
    },
    autocomplete: {
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
        padding: 0,
      },
    },
    inputitle: {
      fontSize: 14,
    },
    inputTitleEnd: {
      fontSize: 14,
      marginRight: 5,
    },
    boldtitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    inputuses: {
      width: 56,
      marginRight: theme.spacing(1),
    },
    datepicker: {
      maxWidth: '120%',
    },
    adornmenttext: {
      fontSize: 10,
      color: `${theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark} !important`,
    },
    currencyinput: {
      width: '50%',
      height: '50px',
      borderRadius: '4px',
      border: '1px solid #999',
      padding: '5px 10px',
      fontSize: 16,
    },
    root: {
      flexGrow: 1,
    },
    select: {
      width: 205,
      borderRadius: 4,
      '& .MuiInput-root': {
        borderRadius: 4,
        '& .MuiInput-input': {
          color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        },
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px 16px',
      },
      '& .MuiInputLabel-formControl': {
        top: 12,
      },
    },
  })

export default styles