export default (theme: any) => ({
    gobackbtn: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        borderRadius: 4,
        padding: '0px',
        height: 36,
        width: 36,
        minWidth: '0px'
    },
    headertxt: {
        fontSize: 24,
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark
    },
    link: {
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
        textDecoration: 'none',
        fontSize : 14,
    },
    caption: {
        fontSize : 14,
        textDecoration: 'none',
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
    },
    divider:{
        height : 20,
        alignSelf : 'center'
    }
}) as any