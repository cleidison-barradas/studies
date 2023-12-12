import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `2px solid ${theme.palette.grey[300]}`,
      marginBottom: '10px',
    },
    buttons: {
      display: 'grid',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
      gap: '10px',
      width: '100%',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    subtitle: {
      color: theme.palette.grey[600],
    },
  })

export default styles
