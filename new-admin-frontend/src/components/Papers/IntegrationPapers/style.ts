import { fade, Theme, createStyles } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    boldcaption: {
      fontSize: 10,
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    value: {
      fontSize: 14,
    },
    status: {
      backgroundColor:
        theme.palette.type === 'light' ? fade(theme.palette.green.light, 0.15) : fade(theme.palette.green.dark, 0.15),
      color: theme.palette.green.light,
      marginTop: 10,
    },
    headertxt: {
      fontSize: 24,
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
    },
    cancelbtn: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    select: {
      '& .MuiOutlinedInput-root,.MuiOutlinedInput-root': {
        borderRadius: 4,
        height: 55,
      },
      '& .MuiInputLabel-formControl': {
        top: 12,
      },
    },
    formcontrol: {
      width: 250,
    },
    title: {
      fontSize: 20,
      fontWeight: 'normal',
    },
    labelroot: {
      '& .MuiTypography-body1': {
        fontSize: 14,
      },
    },
    chipStatus: {
      marginBottom: 15,
    },
    textfield: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 4,
      },
      '& .MuiInputLabel-outlined': {
        top: 12,
      },
      '& .MuiOutlinedInput-input': {
        paddingTop: 16,
        paddingBottom: 16,
      },
    },
    supportLinkSpacing: {
      marginTop: 5,
    },
    heading: {},
    generateButton: {
      '& .MuiButton-contained.Mui-disabled': {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      },
    },
  })

export default styles
