/*
    This service works with dead messages (the messages that does not have been sent)
    If the queue lenght reach 10 messages, an email will be sent to notify (e-mail do carlos carlos.soccol@mypharma.net.br)
*/
const { main_queue, dead_queue } = require('../../plugins/queues')
const { parseOrder, sendToTrier } = require('./TrierService')
const { sendMail } = require('../../sendEmail')
const handlebarsTemplate = require("myp-admin/services/handlebarsConfig");
const path = require('path')
const { CronJob } = require('cron')

let job = null
let deadOrders = new Array()


const cronDeadOrder = async() => {
  job = new CronJob('*/15 * * * *', async () => {
    console.log("Retrieving dead orders")
    console.log(deadOrders.length, " dead orders")
    if(deadOrders.length >= 10){
      deadOrders.forEach(async({order, erp}, index) => {
        try{
          let parsedOrder
          if(erp.userName === 'trier'){
              parsedOrder = await parseOrder(order)
              await sendToTrier(parsedOrder, erp)
              deadOrders.splice(index)
          }
        } catch(error){
          console.log("erro na dead queue")
        }
     })
    }
  }, null, true, 'America/Sao_Paulo')
}

const consumeDeadOrder = async () => {
    dead_queue.on('erp-dead-queue', async(payload) => {
        const { order, erp } = payload.data.content
        if(deadOrders.length >= 3){
          const template = path.resolve(
            __dirname,
            "..",
            "..",
            "views",
            "emails",
            "erp.hbs"
          );
    
          await sendMail({
            subject: `Falha em integrações ERP`,
            destination: "leonardo@mypharma.com.br",
            isContentHtml: true,
            content: await handlebarsTemplate({
              template,
              variables: {
                name: erp.userName,
                comments: `Algo está dando falha nos ERPS do new-admin. Loja do token: ${erp.token} OrderID: ${order._id}`
              }
            }),
          });
        } else {
          deadOrders.push({order, erp})
        }
        await dead_queue.ack('erp-dead-queue', payload.msg)
    })
    await dead_queue.consume('erp-dead-queue')
}

module.exports = { cronDeadOrder, consumeDeadOrder }