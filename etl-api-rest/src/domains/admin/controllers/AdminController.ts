import sha1 from "sha1";
import {
  Get,
  JsonController,
  UseBefore,
  LogMiddleware,
  UseAfter,
  Params,
  StoreRepository,
  IntegrationErpRepository,
  IntegrationErpVersionRepository,
  IntegrationUser,
  IntegrationUserRepository,
  Validate,
  Post,
  Body,
  IntegrationErpVersion,
  ObjectID,
} from "@mypharma/api-core";
import { AdminMiddleware } from "../../../support/middlewares/AdminMiddleware";

@JsonController("/v1/admin")
@UseAfter(LogMiddleware)
@UseBefore(AdminMiddleware)
export class AdminController {
  @Get("/stores")
  public async listStores() {
    const stores = await StoreRepository.repo(
      process.env.DATABASE_MASTER_NAME
    ).find({
      select: ["_id", "name", "url"],
    });

    return {
      stores,
    };
  }

  @Get("/erps")
  public async listErps() {
    const erps = await IntegrationErpRepository.repo().find({
      select: ["_id", "name"],
    });

    return {
      erps,
    };
  }

  @Get("/erp-versions/:erpId")
  @Validate({ erpId: "required|objectId" })
  public async listErpVersions(@Params() params: any) {
    const erpVersions = await IntegrationErpVersionRepository.repo().find({
      select: ["_id", "erpId", "name", "sql"],
      where: {
        erpId: new ObjectID(params.erpId),
      },
    });

    for await (const version of erpVersions) {
      const erp = await IntegrationErpRepository.repo().findOne({
        select: ["_id", "name"],
        where: {
          _id: version.erpId,
        },
      });

      if (erp) {
        (version as any).erp = erp;
      }
    }

    return {
      erpVersions,
    };
  }

  @Post("/user/create")
  @Validate({
    username: "required|string|not_exists:IntegrationUser,integration",
    password: "required|string",
    erpVersionId: "required|objectId|exists:IntegrationErpVersion,integration",
    storeId: "required|objectId|exists:Store",
  })
  public async saveIntegrationUser(@Body() data: any) {
    const { username, password, erpVersionId, storeId } = data;

    // Get store
    const store = await StoreRepository.repo(
      process.env.DATABASE_MASTER_NAME
    ).findById(storeId);
    // Get Erp Version
    const erpVersion = await IntegrationErpVersionRepository.repo(
      "integration"
    ).findById(erpVersionId);
    // Get last user
    const lastUser = await IntegrationUserRepository.repo().findOne({
      select: ["originalId"],
      order: {
        originalId: -1,
      },
    });

    const salt = Math.random().toString(36).substring(7);
    const encryptedPassword = sha1(salt + sha1(salt + sha1(password)));

    let originalId = Number(lastUser.originalId);
    if (originalId < 9000) {
      originalId += 9000;
    }

    let user = IntegrationUser.load({
      originalId: originalId + 1,
      username,
      password: encryptedPassword,
      salt,
      storeOriginalId: store.originalId,
      storeOriginalName: store.name,
      store,
      erpVersion,
      active: true,
    });

    user = await IntegrationUserRepository.repo().createDoc(user);

    return {
      user: {
        _id: user._id.toString(),
        originalId: user.originalId,
        username: user.username,
        store: {
          _id: store._id.toString(),
          name: store.name,
          url: store.url,
        },
        erpVersion: {
          _id: erpVersion._id.toString(),
          name: erpVersion.name,
          sql: erpVersion.sql,
        },
      },
    };
  }

  @Post("/erp-version")
  @Validate({
    name: "required|string",
    erpId: "required|objectId|exists:IntegrationErp,integration",
    sql: "required|string",
    sequence: "number",
  })
  public async saveErpVersion(@Body() data: any) {
    const sequence = data.sequence || 1;

    // Get last erp version
    const lastErpVersion = await IntegrationErpVersionRepository.repo().findOne(
      {
        select: ["originalId"],
        order: {
          originalId: -1,
        },
      }
    );

    let originalId = Number(lastErpVersion.originalId);
    if (originalId < 9000) {
      originalId += 9000;
    }

    let erpVersion = IntegrationErpVersion.load({
      name: data.name,
      erpId: new ObjectID(data.erpId),
      originalId: originalId + 1,
      sql: [
        {
          sequence,
          command: data.sql,
        },
      ],
      schema: {
        name: {
          required: true,
          delta: true,
        },
        laboratory: {
          required: false,
        },
        presentation: {
          required: false,
          mergeable: true,
        },
        activePrinciple: {
          mergeable: true,
        },
        price: {
          required: true,
          delta: true,
        },
        erp_pmc: {
          delta: true,
          mergeable: true,
          type: "number",
        },
        quantity: {
          required: true,
          delta: true,
        },
      },
    });

    erpVersion = await IntegrationErpVersionRepository.repo().createDoc(
      erpVersion
    );

    const erp = await IntegrationErpRepository.repo().findOne({
      select: ["_id", "name"],
      where: {
        _id: erpVersion.erpId,
      },
    });

    return {
      erpVersion: {
        _id: erpVersion._id.toString(),
        name: erpVersion.name,
        originalId: erpVersion.originalId,
        sql: erpVersion.sql,
        erp,
      },
    };
  }
}
