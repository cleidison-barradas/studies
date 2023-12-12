export default (theme: any) =>
  ({
    paperWidthSm: {
      width: '100%',
      maxWidth: 600,
    },
    productInformations: {
      flexDirection: 'column',
      display: 'flex',
      gap: 10,
    },
    productName: {
      fontSize: 20,
    },
    productEAN: {
      fontSize: 15,
    },
    pricesBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    },
    priceBox: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 20,
      marginY: 8,
    },
    deskPrice: {
      width: '20%',
    },
    priceField: {
      maxWidth: 100,
    },
    currencyinput: {
      maxWidth: 100,
      height: '35px',
      borderRadius: '20px',
      backgroundColor: 'transparent',
      border: '1px solid #999',
      padding: '5px 5px',
    },
  } as any)
