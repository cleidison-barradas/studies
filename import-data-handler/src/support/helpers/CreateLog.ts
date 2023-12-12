import {
    IntegrationErpRepository,
    IntegrationLogRepository,
    IntegrationUserErpRepository,
    ORM,
    ObjectID,
} from "@mypharma/api-core";
const { DATABASE_INTEGRATION_NAME } = process.env;

export const CreateLog = async (tenant: string, total: number, userId: string) => {
    await ORM.setup(null, DATABASE_INTEGRATION_NAME)

    const exists = await IntegrationLogRepository.repo(DATABASE_INTEGRATION_NAME).findOne({ tenant })
    const id = new ObjectID(userId)
    const user = await IntegrationUserErpRepository.repo().findById(id)

    if (!user) {
        throw new Error("user_integration_not_found")
    }

    const erpId = new ObjectID(user.erpId.pop())

    const erp = await IntegrationErpRepository.repo(
        DATABASE_INTEGRATION_NAME
    ).findById(erpId)

    if (!erp) {
        throw new Error("erp_not_found")
    }

    const store = user.store.find((s: any) => s.tenant.toString() === tenant)

    if (!store) {
        throw new Error('store_not_found')
    }

    if (!exists) {
        const logDoc: any = {
            tenant,
            received: total,
            erpName: erp.name,
            storeUrl: store.url,
            storeName: store.name,
            createdAt: new Date(),
            lastSeen: new Date(),
            extras: {
                origin: 'erp_api',
            },
        }

        return IntegrationLogRepository.repo(DATABASE_INTEGRATION_NAME).createDoc(logDoc)
    }

    const updateData = {
        $set: {
            received: total,
            erpName: erp.name,
            lastSeen: new Date(),
            updatedAt: new Date(),
            extras: {
                origin: 'erp_api',
            },
        },
    }

    await IntegrationLogRepository.repo(DATABASE_INTEGRATION_NAME).updateOne({ tenant }, updateData)
}