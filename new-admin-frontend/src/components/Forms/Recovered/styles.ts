import { fade } from '@material-ui/core/styles/colorManipulator'
import { cyan, indigo, red } from '@material-ui/core/colors'
import bg from '../../../assets/images/petal_grey_bg.svg'
import bgLight from '../../../assets/images/petal_bg.svg'

const rootWraper = {
  display: 'flex',
  width: '100%',
  zIndex: 1,
  position: 'relative',
  backgroundColor: '#ffffff',
  height: '100%',
  padding: '5%',
}

const wrapper = (theme: any, opacity: number) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: '#0a3463',
  backgroundRepeat: 'no-repeat',
  color: theme.palette.text.primary,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  borderRadius: '20px',
  height: '100%',
  width: '90%',
  maxHeight: 500,
  maxWidth: 428,
  boxShadow: '5px 25px 30px 5px rgba(0, 0, 0, 0.15)',
})

export default (theme: any) =>
  ({
    root: {
      ...rootWraper,
    },
    rootFull: {
      ...rootWraper,
      height: '100%',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '60%',
      borderRadius: '20px',
      backgroundColor: '#1999F9',
      [theme.breakpoints.down('md')]: {
        overflow: 'hidden',
      },
    },
    containerSide: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
      [theme.breakpoints.down('md')]: {
        overflow: 'hidden',
      },
    },
    paperWrap: {
      ...wrapper(theme, 1),
    },
    sideWrap: {
      ...wrapper(theme, 1),
      height: '100%',
      borderRadius: 0,
      [theme.breakpoints.up('md')]: {
        width: 480,
      },
      '& $topBar': {
        marginBottom: theme.spacing(4),
      },
    },
    fullWrap: {
      ...wrapper(theme, 0.9),
      height: '100%',
      borderRadius: 0,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      '& $topBar': {
        width: '100%',
      },
    },
    petal: {
      backgroundImage: theme.palette.type === 'dark' ? `url(${bgLight})` : `url(${bg})`,
    },
    icon: {},
    topBar: {
      display: 'flex',
      justifyContent: 'center',
      '& $icon': {
        marginRight: theme.spacing(1),
      },
    },
    outer: {},
    brand: {
      marginTop: 54,
      marginBottom: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5px 10px',
      position: 'relative',
      fontSize: 16,
      fontWeight: 500,
      color: theme.palette.text.primary,
      textDecoration: 'none',
      '&$outer': {
        color: theme.palette.common.white,
      },
      [theme.breakpoints.down('md')]: {
        margin: theme.spacing(2),
      },
      '& img': {
        width: 130,
        height: 25,
        marginRight: 10,
        filter: 'brightness(0) invert(1)',
      },
    },
    formWrap: {
      [theme.breakpoints.up('sm')]: {
        padding: '0 100px',
      },
      [theme.breakpoints.up('md')]: {
        padding: '0 45px',
      },
      color: 'white',
      '& h1': {
        color: 'white',
        fontSize: 34,
        textAlign: 'center',
      },
      '& p': {
        fontSize: 14,
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: 0.25,
      },
    },
    pageFormWrap: {
      width: '100%',
    },
    pageFormSideWrap: {
      margin: '0 auto',
      [theme.breakpoints.only('sm')]: {
        width: 480,
      },
    },
    socmedLogin: {
      [theme.breakpoints.up('sm')]: {
        padding: '24px 100px 1px',
      },
      '& button': {
        padding: '4px 24px',
      },
    },
    socmedSideLogin: {
      padding: '24px 24px 1px',
      margin: '0 auto',
      '& button': {
        padding: '4px 16px',
        margin: `0 ${theme.spacing(1)}px`,
      },
      [theme.breakpoints.only('sm')]: {
        width: 480,
      },
    },
    userFormWrap: {
      width: '94%',
      position: 'absolute',
      top: '30%',
      display: 'flex',
      justifyContent: 'center',
    },
    sideFormWrap: {
      height: '100%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    fullFormWrap: {
      height: '100%',
      width: '100%',
    },
    title: {
      color: theme.palette.primary.main,
    },
    subtitle: {
      fontSize: 14,
    },
    titleGradient: {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
      paddingBottom: theme.spacing(3),
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      [theme.breakpoints.down('sm')]: {
        fontSize: '2.55em',
      },
    },
    opening: {
      color: theme.palette.common.white,
      width: '100%',
      textAlign: 'center',
      '& h1': {
        display: 'block',
        [theme.breakpoints.down('md')]: {
          fontSize: 32,
          lineHeight: '48px',
        },
      },
      '& p': {
        color: theme.palette.common.white,
        fontSize: 18,
        [theme.breakpoints.down('md')]: {
          fontSize: 14,
        },
      },
    },
    label: {},
    btnArea: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: `${theme.spacing(5)}px 0`,
      fontSize: 12,
      '& $label': {
        fontSize: 12,
        '& span': {
          fontSize: 12,
        },
      },
      '& button,a': {
        margin: `0 ${theme.spacing(1)}px`,
        width: '100%',
        fontWeight: 'normal',
        letterSpacing: '1.25px',
        color: 'white',
        height: 36,
      },
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        '& button': {
          width: '100%',
          margin: 5,
        },
      },
    },
    btn: {
      backgroundColor: '#1999F9',
      color: 'white',
    },
    noMargin: {
      margin: 0,
    },
    redBtn: {
      color: red[500],
      borderColor: red[500],
      '&:hover': {
        borderColor: red[700],
      },
    },
    blueBtn: {
      color: indigo[300],
      borderColor: indigo[300],
      '&:hover': {
        borderColor: indigo[500],
      },
    },
    cyanBtn: {
      color: cyan[500],
      borderColor: cyan[500],
      '&:hover': {
        borderColor: cyan[700],
      },
    },
    buttonLink: {
      background: 'none',
      padding: 0,
      textTransform: 'none',
      transition: 'color ease 0.3s',
      color: 'white',
      fontSize: '0.875rem',
      '&:hover': {
        background: 'none',
        color: theme.palette.secondary.main,
      },
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    iconSmall: {
      fontSize: 20,
    },
    footer: {
      textAlign: 'center',
      padding: 5,
      background: theme.palette.grey[100],
      fontSize: 14,
      position: 'relative',
    },
    welcomeWrap: {
      position: 'relative',
    },
    tab: {
      margin: `${theme.spacing(3)}px 0 ${theme.spacing(1)}px`,
    },
    link: {
      fontSize: '0.875rem',
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    socmedFull: {
      textAlign: 'center',
      width: '100%',
      margin: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
      '& button': {
        width: '100%',
        display: 'block',
        margin: `0 auto ${theme.spacing(2)}px`,
      },
      [theme.breakpoints.up('sm')]: {
        '& button': {
          width: 400,
        },
      },
    },
    lockWrap: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    lockForm: {
      display: 'flex',
      alignItems: 'baseline',
    },
    unlockBtn: {
      top: -4,
    },
    notifyForm: {
      alignItems: 'baseline',
      [theme.breakpoints.down('xs')]: {
        '& button': {
          marginTop: theme.spacing(3),
          width: '100%',
        },
      },
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
        '& button': {
          width: 'auto',
        },
      },
    },
    lockField: {
      marginRight: theme.spacing(1),
      '& label': {
        color: `${theme.palette.common.white} !important`,
      },
      '& label + div': {
        background: fade(theme.palette.primary.light, 0.3),
        border: 'none',
        '& svg': {
          fill: fade(theme.palette.common.white, 0.7),
        },
      },
    },
    avatar: {
      width: 150,
      height: 150,
      [theme.breakpoints.up('lg')]: {
        marginRight: theme.spacing(3),
      },
      boxShadow: theme.glow.medium,
    },
    userName: {
      color: theme.palette.common.white,
      fontWeight: theme.typography.fontWeightMedium,
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(3),
        textAlign: 'center',
      },
    },
    hint: {
      padding: theme.spacing(1),
    },
    brandCenter: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: theme.spacing(3),
    },
    centerAdornment: {
      justifyContent: 'center',
      '& > div': {
        width: '100%',
      },
      '& aside': {
        top: -10,
        [theme.breakpoints.up('sm')]: {
          left: 10,
        },
        position: 'relative',
      },
    },
    centerV: {
      justifyContent: 'center',
    },
    optArea: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: `0 ${theme.spacing(0.5)}px`,
    },
  } as any)
