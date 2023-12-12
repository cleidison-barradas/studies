import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    dialog: {
      backgroundColor: 'rgba(0, 0, 0, 0.60)',
    },
    content: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'start',
      justifyContent: 'space-between',
      gap: '24px'
    },
    image: {
      width: '96px',
      height: '96px',
    },
    texts: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    title: {
      fontSize: '24px',
      marginBottom: 2,
      marginTop: 2,
    },
    buttons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      gap: '16px',
      width: '100%'
    },
    cancelButton: {
      padding: '8px 16px',
      width: '50%'
    },
    acceptButton: {
      padding: '8px 16px',
      width: '50%',
    }
  })

export default styles
