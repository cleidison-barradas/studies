import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    caption: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    input: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
    },
    text: {
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      fontSize: 14,
      width: '90%',
      height: 38,
    },
    edit: {
      borderColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
      border: '1px solid',
      borderRadius: 20,
      background: 'transparent',
    },

    row: {
      borderBottom: 'none',
      height: 75,
      [theme.breakpoints.down('sm')]: {
        height: 75,
        minWidth: 100,
      },
    },

    cellrowroot: {
      borderBottom: 'none',
    },

    rowroot: {
      borderBottom: 'none',
      borderTop: `1px solid ${
        theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark
      }`,
    },

    deletebtn: {
      height: 36,
      width: 20,
      '& .MuiSvgIcon-root': {
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      },
    },

    paginationarrows: {
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      '& .Mui-disabled': {
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      },
    },

    paginationroot: {
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      '& .MuiSelect-icon': {
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      },
    },

    divider: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },

    line: {
      flexGrow: 1,
      marginLeft: theme.spacing(5),
      borderColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },

    tableHeadTitle: {
      fontWeight: 'bold',
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
    },

    addnewsection: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginTop: theme.spacing(4),
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'none',
      },
      marginBottom: theme.spacing(4),
    },

    input2: {
      width: '49%',
      height: 55,
      borderRadius: 4,
      border: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
      paddingLeft: 15,
      fontSize: 14,
      background: 'transparent',
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: theme.spacing(4),
      },
    },
    saveButton: {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
      marginBottom: theme.spacing(3),
      color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      fontSize: 14,
      borderRadius: 20,
      paddingLeft: 40,
      paddingRight: 40,
    },
    timerdisabled: {
      '& .MuiInput-root': {
        border: 'none',
      },
    },
    timerenabled: {
      '& .MuiInput-root': {
        borderColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
        borderRadius: 20,
      },
    },
    textblack: {
      '& .MuiInputBase-root': {
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      },
      '& .MuiFormLabel-root': {
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
      },
      '& .MuiInputLabel-shrink': {
        color: `${theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark} !important `,
      },
    },
    thinputroot: {
      '& .MuiOutlinedInput-root': {
        height: 36,
        borderRadius: 20,
      },
      '& .MuiInput-root': {
        borderRadius: 20,
      },
    },
    fetchingcontainer: {
      width: '100%',
      height: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    currencyDiv: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    currencyLabel: {
      position: 'absolute',
      top: -15,
      background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      left: 0,
      right: 0,
      boxSizing: 'border-box',
      fontSize: 13,
      fontWeight: 400,
      color: '#999',
      alignItems: 'center',
      paddingLeft: 2,
      paddingRight: 2,
      margin: 'auto',
    },
    inputs: {
      border: '1px solid #707070',
      padding: '8px 8px',
      borderRadius: 24,
      width: 120,
      fontSize: 15,
      height: 41,
      background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        border: '1px solid #5CB9FF',
      },
    },
    inputTime: {
      '& .MuiOutlinedInput-input': {
        height: 32
      },
    },
    tableContainer: {
      maxWidth: '100%',
      overflowX: 'auto',
    },
  })

export default styles