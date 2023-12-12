export default (theme: any) =>
    ({
        caption: {
            color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        },
        input: {
            background: 'transparent',
            border: 'none',
            outline: 'none',
        },
        text: {
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
            fontSize: 14,
            width: '90%',
            height: 38,
        },
        edit: {
            borderColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
            border: '1px solid',
            borderRadius: 20,
            background: 'transparent',
        },

        row: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 'none',
            height: 60,
        },

        cellrowroot: {
            borderBottom: 'none',
        },

        rowroot: {
            borderBottom: 'none',
            borderTop: `1px solid ${
                theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark
            }`,
        },

        deletebtn: {
            height: 36,
            '& .MuiSvgIcon-root': {
                color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
            },
        },

        paginationarrows: {
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
            '& .Mui-disabled': {
                color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
            },
        },

        paginationroot: {
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
            '& .MuiSelect-icon': {
                color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
            },
        },

        tableHeadTitle: {
            fontWeight: 'bold',
            fontSize: 14,
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
        },
        fetchingcontainer: {
            width: '100%',
            height: '90%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tableroot: {
            minWidth: 'auto',
        },
    } as any)
