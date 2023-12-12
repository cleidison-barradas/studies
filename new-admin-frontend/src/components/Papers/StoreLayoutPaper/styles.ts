export default (theme: any) =>
  ({
    grid: {
      display: 'grid',
      gridTemplateColumns: '30% 70%',
      gridTemplateRows: '100%',
      columnGap: 20,
      height: '95%',
      padding: 40,
      paddingLeft: 20,
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: theme.spacing(5),
      },
    },
    title: {
      color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
      fontSize: 14,
      fontWeight: 'bold',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },
    preview: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    iframe: {
      width: '100%',
      height: '100%',
      minHeight: 700,
      [theme.breakpoints.down('sm')]: {
        height: 360,
        minHeight: 360,
      },
      borderRadius: 20,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      '&::-webkit-scrollbar': {
        width: 6,
      },

      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },

      '&::-webkit-scrollbar-thumb': {
        background: '#fff',
      },
    },
    saveBtnDisabled: {
      backgroundColor: `${theme.palette.primary.main} !important `,
    },
  } as any)
