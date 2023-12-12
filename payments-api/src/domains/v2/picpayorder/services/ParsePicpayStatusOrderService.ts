import { IPicpayStatus } from "../../../../support/interfaces/picpay.plugin"

const parsedStatusOrder: Record<IPicpayStatus, string> = {
  paid: 'payment_made',
  completed: 'payment_made',
  created: 'pending',
  expired: 'rejected',
  analysis: 'pending',
  refunded: 'reversed',
  chargeback: 'payment_made',
}

interface RequestParsePicpayStatusOrderServiceDTO {
  status: IPicpayStatus
}

class ParsePicpayStatusOrderService {

  public parseStatusOrder({ status }: RequestParsePicpayStatusOrderServiceDTO) {

    return parsedStatusOrder[status]

  }

}

export default ParsePicpayStatusOrderService