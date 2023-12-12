export default (theme: any) => ({
    helpertext: {
        fontSize: 14,
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
    },
    headertxt: {
        fontSize: 24,
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.white.dark
    },
    link: {
        fontSize: 14,
        color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        textDecoration: 'none',
    },
}) as any