import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    iconbtn: {
      borderRadius: 4,
      backgroundColor: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
      height: 36,
      width: 36,
    },
    headertxt: {
      fontSize: 24,
      color: theme.palette.type === 'dark' ? theme.palette.white.dark : theme.palette.primary.main,
    },
    discardbtn: {
      color: theme.palette.type === 'dark' ? theme.palette.grey.primary.dark : theme.palette.grey.primary.light,
    },
    textfield: {
      '& .MuiOutlinedInput-root,.MuiOutlinedInput-root': {
        borderRadius: 4,
        height: 55,
      },
      '& .MuiInputLabel-formControl': {
        top: 14,
      },
    },
    descriptionfield: {
      '& .MuiOutlinedInput-root,.MuiOutlinedInput-root': {
        borderRadius: 4,
        height: 116,
      },
      '& .MuiInputLabel-formControl': {
        top: 14,
      },
    },
    select: {
      '& .MuiOutlinedInput-root,.MuiOutlinedInput-root': {
        borderRadius: 4,
        height: 55,
      },
      '& .MuiInputLabel-formControl': {
        top: -1,
      },
    },
    statstxt: {
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      fontSize: 10,
    },
    sellingchanneltext: {
      fontSize: 14,
    },
    caption: {
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    metatitle: {
      fontSize: 16,
      color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    url: {
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
    },
    description: {
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
    },
    autocomplete: {
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
        padding: 0,
      },
    },
  })

export default styles
