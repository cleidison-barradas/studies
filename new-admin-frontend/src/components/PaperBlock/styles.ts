export default (theme: any) =>
  ({
    container: {
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(1),
    },
    group: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'start',
    },
    header: {
      width: '100%',
    },
    body: {
      height: '100%',
      flex: 1,
    },
    title: {
      fontSize: 24,
    },
    titleCenter: {
      textAlign: 'center',
    },
  } as any)
