export default (theme: any) => ({
    tablecellroot: {
        paddingLeft: '0px'
    },
    checkbox: {
        padding: '0px'
    },
    checkboxbtn: {
        textTransform: 'none',
        paddingLeft: '8px'
    },
    deletebtn: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        '&:hover': {
            backgroundColor: theme.palette.red.dark,
            color: theme.palette.white.dark,
        }
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
            color: theme.palette.primary.main
        }
    }
}) as any