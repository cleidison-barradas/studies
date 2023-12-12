import { JsonController, Get, Res, Param } from "@mypharma/api-core"
import { Response } from "express"
import OrderService from "./orders.service"

@JsonController('/v1/orders')
export default class OrderController {
    @Get('/:tenant')
    async getIFoodOrders(@Res() response: Response, @Param('tenant') tenant: string): Promise<unknown> {
        try {
            const orderService = new OrderService()
            const ifoodOrders = await orderService.getIFoodOrders(tenant)
            const orders = await orderService.getRegularOrders(tenant)
            return { ifoodOrders, orders }
        } catch (error) {
            return response.status(500).json({error})
        }
    }
}
