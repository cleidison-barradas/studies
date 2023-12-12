export default (theme: any) =>
    ({
        buttonText: {
            color: theme.palette.white.dark,
            fontSize: 14,
            paddingLeft: 30,
            paddingRight: 30,
        },

        title: {
            fontSize: 24,
            color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
        },
    } as any)
