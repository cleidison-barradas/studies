import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    caption: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
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

    switchBox:{
      padding: '1px 8px',
      backgroundColor: '#d6edff',
    },

    switchTextBox:{
      padding: '8px 8px',
      backgroundColor: '#d6edff',
    },

    switchBase: {
      color: '#00BF91',
      '&$checked': {
        color: '#00BF91',
      },
      '&$checked + $track': {
        backgroundColor: '#00BF91',
      },
    },
    checked: {},
    track: {
      borderRadius: 24 / 2,
      backgroundColor: '#00BF91',
      opacity: 0.7,
    },
    thumb: {
      width: 20,
      height: 20,
      boxShadow: 'none',
    },

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

    insideLine: {
      flexGrow: 1,
      marginLeft: theme.spacing(1),
      borderColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },

    tableHeadTitle: {
      fontWeight: 'bold',
      fontSize: 14,
      color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
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
    buttonsave: {
      marginTop: 16,
      '&.MuiButton-contained.Mui-disabled': {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        background: '#B8C5D0',
      },
    },
    inputs: {
      border: '1px solid #707070',
      height: 41,
      padding: '8px 8px',
      width: '100%',
      borderRadius: 24,
      fontSize: 16,
      background: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
      '&:hover': {
        border: '1px solid #5CB9FF',
      },
    },
  })

export default styles