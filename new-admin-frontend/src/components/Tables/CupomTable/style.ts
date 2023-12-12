export default (theme: any) => ({
    tablerow: {
        border: 'none'
    },
    tablecell: {
        border: 'none',
    },
    tablecellbody: {
        paddingLeft: '0px'
    },
    statuscontainer: {
        borderRadius: 20,
        width: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        padding: 8,
        height: 36,
    },
    statustext: {
        fontSize: 14,
    },
    on: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark
    },
    off: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark
    }
}) as any