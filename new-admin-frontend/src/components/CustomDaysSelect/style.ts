export default (theme: any) => ({
    select: {
        width: 144,
        background: 'transparent',
        outline: 'none',
        border: 'none',
        borderBottom : '1px solid black',
        color: 'black',
        opacity: 0.7,
        marginBottom: 5,
        [theme.breakpoints.down('sm')]: {
          width: '100%',
        },
        [theme.breakpoints.down('md')]: {
          width: '50%',
        },
      },
      selectMenu: {
        "& .MuiPaper-root": {
          backgroundColor: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.secondary.dark
        },
      },
      selected: {
        color: theme.palette.select.light
      },
}) as any