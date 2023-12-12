export default (theme: any) =>
  ({
    emptyContainer: {
      width: '100%',
      height: '90%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      fontSize: 24,
    },

    carousel: {
      height: '100% !important',
      '& .slick-track,.slick-slide,.slick-list,.slick-slide > div': {
        height: '100% !important',
      },
      '& .slick-next:before, .slick-prev:before': {
        fontSize: 25,
      },
    },

    item: {
      padding: 15,
      background: 'transparent !important',
      width: '100% !important',
      height: '100% !important',
      border: '1px solid ',
      borderRadius: 20,
      display: 'flex !important',
      flexDirection: 'column',
      gap: theme.spacing(3),
    },

    itemTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      gap: theme.spacing(1),
    },

    description: {
      color: theme.palette.black.primary.light,
      textAlign: 'justify',
      flex: 1,
    },

    buttons: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
    },

    button: {
      border: 'none',
      background: 'transparent',
      outline: 'none',
      textAlign: 'center',
      letterSpacing: 1.25,
      textTransform: 'uppercase',
      fontSize: 14,
      color: theme.palette.black.primary.light,
    },
  } as any)
