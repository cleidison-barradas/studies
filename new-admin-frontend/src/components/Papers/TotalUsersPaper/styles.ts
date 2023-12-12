export default (theme: any) => ({

    container: {
        width: '100%',
        height: '100%',
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'space-between',
    },
    fetchingcontainer:{
        width: '100%',
        height: '90%',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
    },

    totalUsers: {
        fontSize: 18
    },

    userChartContainer: {
        width: '100%',
        height: '50%',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        fontSize: 12,
    },

    hr: {
        marginTop: 10,
        marginBottom: 10,
        opacity: 0.3
    },

    value: {
        marginLeft: 25,
        marginTop: 20,
        marginBottom: 25,
        fontWeight: 'bold',
        fontSize: 34,
        color : theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    },

    caption: {
        marginLeft: 8,
        marginTop: 27,
        marginBottom: 20,
        fontSize: 16,
        color : theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
    },

    row: {
        display: 'flex',
        '& img': {
            marginLeft: 20,
        },
        alignItems: 'center',
    },

    percentage: {

        fontSize: 14,
        marginLeft: 20
    },

    red: {
        color: '#E72222',
    },

    green: {
        color: '#00BF91'
    },

    select: {
        width: '30%',
        background: 'transparent',
        outline: 'none',
        border: 'none',
        color: 'white',
        opacity: 0.7,
        marginBottom : 5,
        [theme.breakpoints.down('sm')]: {
            width : '100%',
        },
        [theme.breakpoints.down('md')]: {
            width : '50%',
        },
    },

    lastHr: {
        margin: '0px 0px 0px 0px',
        marginTop:10    ,
        marginBottom:5,
        opacity: 0.3
    },

    empty : {
        fontSize : 34,
        color: '#F4FAFF',
        opacity: 0.25,
    }

}) as any