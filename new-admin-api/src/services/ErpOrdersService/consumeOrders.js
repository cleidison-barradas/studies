/*
    This service will consume the queue, parse the data and send to ERP
    If the send service does not work, the message will be published in a dead queue
*/
const { main_queue, dead_queue } = require('../../plugins/queues')
const { parseOrder, sendToTrier } = require('./TrierService')

const consumeOrder = async () => {
    main_queue.on('erp-main-queue', async(payload) => {
        console.log("Consuming order")
        const { tenant, order, erp } = payload.data.content
        try{
            let parsedOrder
            if(erp.userName === 'trier'){
                parsedOrder = await parseOrder(tenant, order)
                await sendToTrier(parsedOrder, erp)
            }
        } catch(error){
            console.log(error)
            console.log('Erro de integração trier, mandando para dead queue')
            await dead_queue.publish('erp-dead-queue', { order, erp })
        }
        await main_queue.ack('erp-main-queue', payload.msg)
    })
    await main_queue.consume('erp-main-queue')
}

module.exports = { consumeOrder }