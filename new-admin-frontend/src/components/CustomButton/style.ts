export default (theme: any) => ({
    buttonSuccess:{
        transition: theme.transitions.create('background', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        background  : theme.palette.type === 'light' ? `${theme.palette.green.light} !important` : `${theme.palette.green.dark} !important`,
        color :  theme.palette.type === 'light' ? `${theme.palette.white.light} !important` : `${theme.palette.white.dark} !important`
    },
    buttonError:{
        transition: theme.transitions.create('background', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        background  : theme.palette.type === 'light' ? `${theme.palette.red.light} !important` : `${theme.palette.red.dark} !important`,
        color :  theme.palette.type === 'light' ? `${theme.palette.white.light} !important` : `${theme.palette.white.dark} !important`
    },
    colorPrimary : {
        color : 'white'
    }
}) as any