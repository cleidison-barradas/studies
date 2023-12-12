export default (theme: any) => ({
    title: {
        fontSize: 24,
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark
    },
    helptext: {
        fontSize: 14,
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
        textDecoration: 'none'
    },
    infotext: {
        fontSize: 14,
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        textDecoration: 'none'
    }
}) as any