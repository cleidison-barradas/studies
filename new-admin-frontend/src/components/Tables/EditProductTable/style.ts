export default (theme: any) => ({
    titleimg: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.white.dark : theme.palette.white.light,
        borderRadius: 4,
        width: 24,
        height: 24,
        marginRight: theme.spacing(1)
    },
    title: {
        textAlign: 'center'
    },
    row: {
        display: 'flex',
    },
    cell: {
        border: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
        '& .MuiInput-root': {
            border: 'none !important ',
            width : 125,
        }
    },
    container: {
        [theme.breakpoints.up('md')]: {
            width: '99%'
        }
    },
    formcontrol:{
        width : '100%',
        minWidth : 150,
    },
    currencyinput: {
      width : '100%',
      height: '36px',
      borderRadius: '20px',
      border: '1px solid #707070'
    }

}) as any