import { createStyles, Theme } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    MuiAccordionroot: {
      background: 'transparent',
      '&.MuiAccordion-root:before': {
        backgroundColor: 'transparent'
      },
      '&.Mui-disabled': {
        backgroundColor: 'transparent'
      }
    },
    summaryroot: {
      height: 24,
      minHeight: 24,
      '&.Mui-expanded': {
        minHeight: 0,
        marginBottom: 20
      }
    },
    selected: {
      '& $heading': {
        color: theme.palette.primary.main
      }
    },
    heading: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey.primary.dark
    },
    link: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      color: theme.palette.grey.primary.dark,
      textDecoration: 'none',
      fontSize: 16,
      fontWeight: 500,
      '& img': {
        marginRight: 30,
        width: 22
      },
      paddingLeft: 22,
      marginBottom: theme.spacing(5),
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 60
      }
    },
    multiLink: {
      '& .MuiIconButton-root': {
        color: theme.palette.grey.primary.light
      }
    },
    subLink: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      color: theme.palette.grey.primary.dark,
      textDecoration: 'none',
      fontSize: 20,
      fontWeight: 300,
      paddingLeft: 55,
      '& img': {
        marginRight: 20
      },
      marginLeft: 10
    },
    selectedImage: {
      filter: 'invert(51%) sepia(93%) saturate(2952%) hue-rotate(183deg) brightness(100%) contrast(96%)'
    }
  })

export default styles
