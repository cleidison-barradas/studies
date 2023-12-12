import { logger, OrderRepository, ORM, StoreRepository } from "@mypharma/api-core"
import iFoodService from "../../services/ifood"
const { DATABASE_MASTER_NAME } = process.env

export default class OrderService{
    async getIFoodOrders(tenant: string){
        const store = await StoreRepository.repo(DATABASE_MASTER_NAME).findOne({ tenant })

        if(!store){
            throw new Error("Loja não encontrada")
        }

        const { settings: { config_ifood_client_id, config_ifood_client_secret }} = store
    
        if(!config_ifood_client_id || !config_ifood_client_secret) {
            logger("Loja não cadastrada no iFood!");
            return [];
        }
        const ifoodService = new iFoodService(config_ifood_client_id, config_ifood_client_secret)
        
        const orders = await ifoodService.getEvents();

        return orders
    }

    async getRegularOrders(tenant: string) {
        await ORM.setup(undefined, tenant);

        const orders = await OrderRepository.repo(tenant).find({
            where: {
                createdAt: { $gte: new Date(new Date().getTime() - 1000 * 60 * 2) }
            }
        });

        return orders
    }
}

