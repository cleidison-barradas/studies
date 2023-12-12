import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
      lockedFileContainer: {
        width: '100%',
        height: '100%',
        border: `1px dashed ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        flexDirection: 'column',
        padding: theme.spacing(2),
        cursor: 'not-allowed',
    },
    noborder:{
        border : 'none !important'
    },
    iconbtn: {
      borderRadius: 4,
      backgroundColor: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
      height: 36,
      width: 36,
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'space-between'
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
      display: 'flex',
      justifyContent: 'space-between',
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
    categoryImage: {
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
  })

export default styles
