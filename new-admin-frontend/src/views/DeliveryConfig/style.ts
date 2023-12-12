export default (theme: any) => ({
    saveButton: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
        marginBottom: theme.spacing(3),
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        fontSize: 14,
        borderRadius: 20,
        paddingLeft : 40,
        paddingRight : 40,

    },
}) as any