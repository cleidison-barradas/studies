import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    boxContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0px',
      [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: '12px'
      },
    },
    columnTitle: {
      fontWeight: 'bold',
    },
    boxContentTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0px',
      [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: '12px'
      },
    },

  })

export default styles
