export default (theme: any) =>
({
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
  },
  paperWidthSm: {
    width: '100%',
    maxWidth: 550,
  },
  caption: {
    fontSize: 12,
    color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
  },
  generatebtn: {
    textDecoration: 'underline',
    fontSize: 12,
    textTransform: 'none',
  },
  adornment: {
    '& .MuiTypography-root': {
      color: `${theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark} !important`,
    },
  },
  inputitle: {
    fontSize: 14,
  },
  boldtitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputuses: {
    width: 56,
    marginRight: theme.spacing(1),
  },
  textarea: {
    '& .MuiInputBase-input': {
      padding: 0,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 4,
    },
    '& .MuiInputBase-root': {
      display: 'block',
    },
  },
  datepicker: {
    maxWidth: 150,
  },
} as any)
