

const parsedStatusOrder: Record<number, string> = {
  1: 'pending',
  2: 'pending',
  3: 'payment_made',
  4: 'pending',
  5: 'pending',
  6: 'reversed',
  7: 'rejected',
}

interface RequestParsePicpayStatusOrderServiceDTO {
  status: number
}

class ParsePicpayStatusOrderService {

  public parseStatusOrder({ status }: RequestParsePicpayStatusOrderServiceDTO): string {

    return parsedStatusOrder[status]

  }
}

export default ParsePicpayStatusOrderService