export default (theme: any) =>
  ({
    actions: {
      flexWrap: 'wrap',
      [theme.breakpoints.down('sm')]: {
        '& button': {
          width: '100%',
          marginLeft: '0px !important',
          marginBottom: theme.spacing(2),
        },
      },
    },
    bordertop: {
      paddingTop: theme.spacing(2),
      borderTop: `1px solid ${
        theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark
      }`,
    },

    contentBox: {
      minWidth: '300px',
    },
    expirationCount: {
      color: theme.palette.success.main,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      gap: 5,
    },
    expiredLink: {
      color: theme.palette.error.main,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    informationsBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    productsBox: {
      display: 'flex',
    },
  } as any)
