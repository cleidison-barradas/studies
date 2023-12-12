import { IProcessType, NotificationCustomerRepository } from "@mypharma/api-core"

interface GetCustomerNotificationServiceDTO {
  process: IProcessType
}

class GetCustomerNotificationService {
  constructor(private repository?: any) { }

  public async getCustomerNotifications({ process }: GetCustomerNotificationServiceDTO) {

    return NotificationCustomerRepository.repo().find({
      where: {
        process
      },
    })

  }
}

export default GetCustomerNotificationService