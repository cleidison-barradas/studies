import { Theme } from '@material-ui/core'

const styles = (theme: Theme) => ({
  textfield: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 4,
    },
    '& .MuiInputLabel-outlined': {
      top: 12,
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: 16,
      paddingBottom: 16,
    },
    'input::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    'input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    'input[type=number]': {
      '-moz-appearance': 'textfield',
    },
    minHeight: 50,
  },
  textfieldover: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 4,
    },
    '& .MuiInputLabel-outlined': {
      top: 12,
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: 16,
      paddingBottom: 16,
    },
    border: '1px solid black',
  },
  caption: {
    fontSize: 16,
    color: theme.palette.grey.primary.dark,
  },
  boldtitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconbtn: {
    borderRadius: 4,
    backgroundColor: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
    height: 36,
    width: 36,
  },
  headertxt: {
    fontSize: 24,
    color: theme.palette.type === 'dark' ? theme.palette.white.dark : theme.palette.primary.main,
  },
  headerBack: {
    marginBottom: 10,
  },
  deliveryFeeBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deliveryFeeTolltipIcon: {
    cursor: 'pointer',
  },
  generateTemplateBtn: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
    color: theme.palette.white.light,
    '&:hover': {
      backgroundColor: theme.palette.type !== 'light' ? theme.palette.green.light : theme.palette.green.dark,
    },
  },
  contentBox: {
    width: '70%',
    '@media (max-width: 960px)': {
      width: '100%',
    },
  },
  pricesBox: {
    display: 'flex',
    gap: '20px',
    width: '70%',
    '@media (max-width: 960px)': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  textFieldCurrency: {
    paddingLeft: 16,
    width: '200px',
  },
  paymentlink: {
    width: '70%',
    '@media (max-width: 960px)': {
      width: '100%',
    },
  },
})

export default styles as any
