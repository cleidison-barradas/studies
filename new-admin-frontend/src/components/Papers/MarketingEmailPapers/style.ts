import { createStyles, fade, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: theme.spacing(1),
    },
    input: {
      '& .MuiInput-root': {
        borderRadius: 4,
      },
    },
    link: {
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
      textDecoration: 'none',
    },
    caption: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      fontSize: 14,
      marginLeft: 15,
    },
    textarea: {
      '& .MuiInputBase-input': {
        height: 440,
        padding: 0,
      },
      '& .MuiInput-root': {
        borderRadius: 4,
      },
    },
    title: {
      fontSize: 20,
    },
    description: {
      fontSize: 14,
    },
    chip: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      backgroundColor:
        theme.palette.type === 'light'
          ? fade(theme.palette.grey.primary.light, 0.15)
          : fade(theme.palette.grey.primary.dark, 0.15),
      cursor: 'pointer',
    },
    textfield: {
      '& .MuiInput-root,.MuiOutlinedInput-root': {
        borderRadius: 4,
      },
      '& .MuiOutlinedInput-input': {
        padding: '16px 16px',
      },
      '& .MuiInputLabel-formControl': {
        top: 12,
      },
    },
    gobackbtn: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      borderRadius: 4,
      padding: '0px',
      height: 36,
      width: 36,
      minWidth: '0px',
    },
    headertxt: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
    },
    divider: {
      height: 20,
      alignSelf: 'center',
    },
  })

export default styles
