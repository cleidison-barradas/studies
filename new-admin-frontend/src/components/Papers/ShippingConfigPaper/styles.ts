import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    divider: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      marginBottom: 30,
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },

    line: {
      flexGrow: 1,
      marginLeft: theme.spacing(6),
      borderColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    currencyinput: {
      width: '100%',
      height: '50px',
      borderRadius: '4px',
      backgroundColor: 'transparent',
      border: '1px solid #999',
      padding: '5px 10px',
    },
    caption: {
      fontSize: 14,
      fontWeight: 400,
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    autocomplete: {
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
        padding: 5,
        height: 60
      },
    },
  })

export default styles
