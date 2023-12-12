export default (theme: any) =>
    ({
        deletebtn: {
            marginRight: theme.spacing(2),
            color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
        },
        textfield: {
            '& .MuiInput-root,.MuiOutlinedInput-root': {
                borderRadius: 4,
            },
            '& .MuiOutlinedInput-input': {
                padding: '16px 16px',
            },
            '& .MuiInputLabel-formControl': {
                top: 12,
            },
        },
        textarea: {
            '& .MuiInput-root,.MuiOutlinedInput-root': {
                borderRadius: 4,
            },
            '& .MuiOutlinedInput-input': {
                height: 100,
            },
        },
        title: {
            marginBottom: theme.spacing(2),
            fontSize: 20,
        },
        autocomplete: {
            '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
                padding: 0,
            },
        },
        section: {
            marginBottom: theme.spacing(2),
        },
        select: {
            borderRadius: 4,
            '& .MuiInput-root': {
                borderRadius: 4,
                '& .MuiInput-input': {
                    color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
                },
            },
            '& .MuiOutlinedInput-input': {
                padding: '16px 16px',
            },
            '& .MuiInputLabel-formControl': {
                top: 12,
            },
        },
        boldtext: {
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
        sellingchanneltext: {
            fontSize: 14,
            marginLeft: theme.spacing(2),
        },
        text: {
            fontSize: 14,
        },
        locktext: {
            fontSize: 14,
            fontWeight: 'bold',
        },
        organizationsection: {
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(5),
        },
        arrowup: {
            transform: 'rotate(180deg)',
            marginLeft: theme.spacing(1),
        },
        arrowdown: {
            marginLeft: theme.spacing(1),
        },
        addmediaurlbtn: {
            textTransform: 'none',
            fontSize: 14,
            color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        },
        imagesrow: {
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            marginTop: theme.spacing(2),
        },
        image: {
            height: 240,
            width: 240,
            minWidth: 240,
            borderRadius: 20,
            marginRight: theme.spacing(2),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: theme.transitions.create('brightness', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            '&:hover': {
                cursor: 'pointer',
                filter: 'brightness(0.7)',
                '& $deleteicon': {
                    opacity: 1,
                },
            },
        },
        deleteicon: {
            opacity: 0,
        },
        uploadertext: {
            textAlign: 'center',
            fontSize: 16,
            color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
            marginTop: theme.spacing(2),
        },
        link: {
            color: '#707070',
            textDecoration: 'none',
            marginTop: theme.spacing(2),
        },
        caption: {
            fontSize: 14,
            fontWeight: 400,
            color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        },
        divider: {
            marginBottom: theme.spacing(3),
            marginTop: theme.spacing(3),
        },
        currencyinput: {
            width: '100%',
            height: '50px',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            border: '1px solid #999',
            padding: '5px 10px',
        },
        currencyDiv : {
          position: 'relative',
        },
        currencyLabel: {
          position: 'absolute',
          top: -8,
          background: '#fff',
          left: 8,
          padding: '0 5px 0 5px',
          fontSize: 15,
          color: '#999'
        },
    } as any)
