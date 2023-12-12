export default (theme: any) => ({
    dialogContainer: {
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },
    leftColumn: {
      flex: '0.01',
      backgroundColor: '#EDEDED',
      padding: '10px 1px 5px 10px',
      [theme.breakpoints.down('sm')]: {
        flex: 'none',
        width: '100%',
      },
    },
    rightColumn: {
      flex: '0.99',
      [theme.breakpoints.down('sm')]: {
        flex: 'none',
        width: '100%',
      },
    },
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
      borderTop: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
    },
    titleText: {
      fontFamily: 'Raleway',
      fontSize: '24px',
      fontWeight: '480',
      textAlign: 'left',
      color: '#3E9DFF',
    },
  }) as any