import "dotenv/config";
import { ORM, colors, logger } from "@mypharma/api-core";
import config from "./config/database";
import RemarketingServices from './domains/remarketing/services'

export default (async () => {
  try {
    ORM.config = config;
    await ORM.setup(config)

    await RemarketingServices()
    logger('Remarketing service initialized!', colors.FgGreen)

  } catch (error) {
    console.log(error)
    logger('Remarketing service initialize Failure!', colors.FgRed)
  }
})();
