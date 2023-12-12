
interface IgetShippingOptionsParams {
  orderId: string
  receipt: boolean
  own_hand: boolean
  platform: string
  insurance_value: number

}
export function getShippingOptions({ insurance_value, receipt, own_hand, platform, orderId }: IgetShippingOptionsParams) {

  const url = new URL(`/sales/${orderId}`, process.env.BASE_ADMIN_ORDERS).href

  return {
    insurance_value,
    receipt,
    own_hand,
    reverse: false,
    non_commercial: true,
    platform,
    tags: [
      {
        tag: orderId,
        url,
      },
    ],
  }
}
