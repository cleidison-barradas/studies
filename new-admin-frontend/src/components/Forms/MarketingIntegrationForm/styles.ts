export default (theme: any) => ({
  textarea: {
    '& .MuiInput-root,.MuiOutlinedInput-root': {
      borderRadius: 4,
    },
    '& .MuiOutlinedInput-input': {
      height: 100
    },
  },
  link: {
    fontSize: 14,
    color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    textDecoration: 'none',
  },
  title: {
    fontSize: 20,
    color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark
  },
  caption: {
    fontSize: 14,
    color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    textDecoration: 'none',
    '& .MuiSvgIcon-root': {
      marginLeft: theme.spacing(1)
    }
  },
  divider: {
    height: '20px !important ',
    alignSelf: 'center !important',
  },
  input: {
    '& .MuiInput-root': {
      borderRadius: 4,
      borderColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 4,
    }
  },
  greencolor: {
    color: theme.palette.green.light
  },
  textfield: {
    '& .MuiInput-root,.MuiOutlinedInput-root': {
      borderRadius: 4,
    },
    '& .MuiOutlinedInput-input': {
      padding: '16px 16px',
    },
    '& .MuiInputLabel-formControl': {
      top: 12
    }
  },
  descriptionfield: {
    '& .MuiOutlinedInput-root,.MuiOutlinedInput-root': {
      borderRadius: 4,
      height: 116,
    },
    '& .MuiInputLabel-formControl': {
      top: 14
    },
  },
}) as any