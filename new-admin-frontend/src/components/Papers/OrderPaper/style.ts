import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    bold: {
      fontWeight: 'bold',
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    value: {
      fontSize: 14,
    },
    siwtchToRelatedOrderText: {
      fontFamily: 'Raleway,Open Sans,sans-serif',
      fontSize: '16px',
      lineHeight: '23px',
      letterSpacing: '0em',
      textAlign: 'left',
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
      textDecoration: 'none  !important'
    },
    cpfInput: {
      border: 0,
      '& .MuiInput-input': {
        fontSize: 18,
        '@media print': {
          fontWeight: 'bold !important',
        },
      },
    },
    noPrint: {
      '@media print': {
        display: 'none !important',
      },
    },
    onPrint: {
      '@media print': {
        marginBottom: '12px !important',
        '& .MuiGrid-item': {
          paddingBottom: '0px !important',
          paddingTop: '0px !important',
        },
      },
    },
    boldPrint: {
      '@media print': {
        fontWeight: 'bold !important',
      },
    },
  })

export default styles