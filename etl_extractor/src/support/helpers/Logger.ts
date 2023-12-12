import {
  IntegrationErpRepository,
  IntegrationLogRepository,
  IntegrationUserErpRepository,
  ORM,
} from "@mypharma/api-core";
import { ObjectID } from "bson";
const { DATABASE_INTEGRATION_NAME } = process.env;

export async function CreateLog(tenant: string, total: number, userId: string) {
  await ORM.setup(undefined, DATABASE_INTEGRATION_NAME);

  const exists = await IntegrationLogRepository.repo(
    DATABASE_INTEGRATION_NAME
  ).findOne({ tenant });

  const id = new ObjectID(userId);

  const user = await IntegrationUserErpRepository.repo().findById(id);

  if (!user) {
    throw new Error("user_integration_not_found");
  }

  const erpId = new ObjectID(user.erpId.pop());

  const erp = await IntegrationErpRepository.repo(
    DATABASE_INTEGRATION_NAME
  ).findById(erpId);

  if (!erp) {
    throw new Error("erp_not_found");
  }

  const store = user.store.pop();

  if (!exists) {
    return IntegrationLogRepository.repo(DATABASE_INTEGRATION_NAME).createDoc({
      tenant,
      erpName: erp.name,
      storeUrl: store.url,
      storeName: store.name,
      received: total,
      lastSeen: new Date(),
      createdAt: new Date(),
      extras: {
        userId,
        origin: "etl_extractor",
      },
    });
  }

  await IntegrationLogRepository.repo(DATABASE_INTEGRATION_NAME).updateOne(
    { tenant },
    {
      $set: {
        received: total,
        erpName: erp.name,
        lastSeen: new Date(),
        updatedAt: new Date(),
        extras: {
          userId,
          origin: "etl_extractor",
        },
      },
    }
  );
}
