import { createStyles } from '@material-ui/core'

const styles = (theme: any) => createStyles({
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
  label: {
    borderRadius: '16px',
    padding: '4px 16px',
    border: `1px solid #E58D57`,
    backgroundColor: '#F6F4E2',
    fontWeight: "bold",
    fontSize: '14px',
    color: '#E58D57',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    },
  },
  divider: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      width: '100%',
      margin: '12px 0px',
      border: `1px solid #ececec`,
    },
  },
  span: {
    fontWeight: 'bold',
  },
  button: {
    padding: '8px 16px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  buttonInvoice: {
    padding: '8px 16px',
    background: '#00BF91',
    '&:hover': {
      background: '#059975'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
  },
  boxContentText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '8px',
  },
  buttonDisabled: {
    width: '120px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  text: {
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      flexDirection: 'row',
      gap: '4px'
    },
    [theme.breakpoints.down('lg')]: {
      display: 'flex',
      flexDirection: 'column',
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'row',
      gap: '4px'
    },
  }
})

export default styles