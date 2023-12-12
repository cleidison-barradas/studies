export default (theme: any) => ({
    backbtn: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        borderRadius: 4,
    },
    headertxt: {
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark,
        fontSize: 24,
    },
    emptycontainer: {
        width: '100%',
        height: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection : 'column'
    },
    emptyicon: {
        height: '100%',
        maxHeight: 250,
        width: '100%',
        maxWidth: 250,
        flex: 1
    },
    emptytext : {
        fontSize : 36,
        textAlign : 'center'
    }
}) as any