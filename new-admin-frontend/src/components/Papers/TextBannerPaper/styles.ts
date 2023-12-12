import { Theme, createStyles } from '@material-ui/core'

export const styles = (theme: Theme) =>
  createStyles({
    grid: {
      display: 'grid',
      gridTemplateColumns: '30% 70%',
      gridTemplateRows: '100%',
      columnGap: 20,
      height: '95%',
      padding: 40,
      paddingLeft: 20,
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: theme.spacing(5),
      },
    },
    backIcon: {
      width: 24,
      marginRight: '10px',
      cursor: 'pointer',
    },
    buttonSave: {},
    buttonDisabled: {},
    title: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      fontSize: 14,
      fontWeight: 'bold',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },
    preview: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    actions: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: '16px',
      marginTop: '48px',
    },
    cardAction: {
      padding: '10px 16px',
      background: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
      borderRadius: '24px',

      '& .MuiFormControl-root': {
        width: '100%',
      },
      '& .MuiFormControlLabel-root': {
        justifyContent: 'space-between',
      },
    },
    input: {
      color: 'black',
      '& .MuiOutlinedInput-root': {
        borderRadius: 4,
        padding: 8,
      },
      '& .MuiInputLabel-formControl': {
        top: 10,
      },
    },
    iframe: {
      width: '100%',
      height: '100%',
      minHeight: 700,
      [theme.breakpoints.down('sm')]: {
        height: 360,
        minHeight: 360,
      },
      borderRadius: 20,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      '&::-webkit-scrollbar': {
        width: 6,
      },

      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        background: '#fff',
      },
    },
  })
