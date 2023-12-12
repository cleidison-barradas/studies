export default (theme: any) =>
  ({
    title: {
      fontSize: 24,
      marginBottom: theme.spacing(1),
    },
    formcontrol: {
      marginTop: theme.spacing(2),
      '& .MuiOutlinedInput-root': {
        height: 56,
        borderRadius: 4,
      },
      '& .MuiInputLabel-formControl': {
        top: 15,
      },
    },
    loadingcontainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textfield: {
      '& .MuiOutlinedInput-root': {
        height: 56,
        borderRadius: 4,
      },
      '& .MuiInputLabel-formControl': {
        top: 15,
      },
    },
    searchfield: {
      width: '100%',
      maxWidth: 350,
      marginRight: theme.spacing(3),
    },
    cancelbtn: {
      color: theme.palette.type === 'dark' ? theme.palette.grey.primary.dark : theme.palette.grey.primary.light,
    },
    link: {
      color: theme.palette.type === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    select: {
      '&.NewShowcase-formcontrol-312 .MuiOutlinedInput-root': {
        height: 'auto',
        borderRadius: 20,
      },
      '& .MuiOutlinedInput-root': {
        paddingTop: 4,
        borderColor: theme.palette.grey.primary.light,
      },
      '& .MuiInputLabel-formControl': {
        top: 6,
        color: 'black',
      },
    },
  } as any)
