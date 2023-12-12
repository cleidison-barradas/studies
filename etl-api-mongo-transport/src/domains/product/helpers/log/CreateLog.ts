import {
  IntegrationErpRepository,
  IntegrationLogRepository,
  IntegrationUserRepository,
  ObjectID,
  ORM,
  Store,
} from "@mypharma/api-core";
import { database_integration } from "../../../../config/database";

export async function CreateLog(store: Store, userId: number, total: number) {

  const exist = await IntegrationLogRepository.repo(
    database_integration
  ).findOne({ tenant: store.tenant });

  const user = await IntegrationUserRepository.repo(
    database_integration
  ).findOne({ originalId: userId });

  if (!user) {
    throw new Error("user_not_found");
  }

  const id = new ObjectID(user.erpVersion.erpId.toString());

  const erp = await IntegrationErpRepository.repo(
    database_integration
  ).findById(id);

  if (!erp) {
    throw new Error("erp_not_found");
  }

  if (!exist) {
    return IntegrationLogRepository.repo(database_integration).createDoc({
      tenant: store.tenant,
      received: total,
      storeName: store.name,
      storeUrl: store.url,
      erpName: erp.name,
      lastSeen: new Date(),
      createdAt: new Date(),
      extras: {
        userId,
        origin: "etl_core",
      },
    });
  }

  await IntegrationLogRepository.repo(database_integration).updateOne(
    { tenant: store.tenant },
    {
      $set: {
        received: total,
        erpName: erp.name,
        lastSeen: new Date(),
        updatedAt: new Date(),
        extras: {
          userId,
          origin: "etl_core",
        },
      },
    }
  );
}
