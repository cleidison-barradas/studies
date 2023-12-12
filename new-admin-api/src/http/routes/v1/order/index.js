const router = require("express").Router();
const { celebrate, Segments, Joi } = require('celebrate')
const moment = require("moment")
const path = require("path")

const {
  Mongo: {
    getModelByTenant,
    Models: {
      StoreSchema,
      PbmOrderSchema,
      StatusOrderSchema
    }
  },
} = require("myp-admin/database")


const {
  refoundOrder,
  cancelPayment,
  refoundStoneOrder
} = require("myp-admin/utils/payment-gateway");

const { ObjectId } = require("bson");

const { Pluggto } = require("myp-admin/services/ErpOrdersService/PluggtoService");

const { sendMail } = require("../../../../sendEmail");
const { main_queue } = require('../../../../plugins/queues')
const handlebarsTemplate = require("myp-admin/services/handlebarsConfig");

const { objectIdValidation } = require("myp-admin/http/middlewares");
const { isERPIntegrated } = require('../../../../helpers/isERPIntegrated')
const { paginationParser, updateFieldsParser } = require("myp-admin/helpers");

const { sendNfeToExternalApi, sendShippingToExternalApi, isValidShippingData } = require('./order.service')

const UpdateOrderService = require('./services/UpdateOrderService')
const GetOrderByOrderIdService = require('./services/GetOrderByOrderIdService')
const PbmGetPreOrderService = require('../pbm/services/PbmGetPreOrderService')
const PbmUpdatePreOrderService = require('../pbm/services/PbmUpdatePreOrderService')

const EpharmaService = require('../../../../services/ErpOrdersService/EpharmaService')

router.get("/:id?", objectIdValidation, async (req, res) => {
  try {
    const Order = getModelByTenant(req.tenant, "OrderSchema");
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (id) {
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ order });
      }

      return res.json({ order });
    }
    const paginationOptions = {
      page,
      limit,
      sort: "-createdAt",
    };

    const pagination = await Order.paginate({}, paginationOptions);

    return res.json(paginationParser("orders", pagination));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Alterar status do pedido
router.post("/:id", objectIdValidation, async (req, res) => {
  try {
    const Store = StoreSchema.Model()
    const Status = StatusOrderSchema.Model()
    const PbmOrder = PbmOrderSchema.Model()

    const Order = getModelByTenant(req.tenant, "OrderSchema")
    const History = getModelByTenant(req.tenant, "HistoryOrderSchema")
    const PaymentMethod = getModelByTenant(req.tenant, "PaymentMethodSchema")
    const pbmGetPreOrderService = new PbmGetPreOrderService(PbmOrder)
    const pbmUpdatePreOrderService = new PbmUpdatePreOrderService(PbmOrder)

    const { id } = req.params

    const {
      comments = '',
      notify = false,
      trackingCode = null,
      statusOrder: statusOrderId = null
    } = req.body

    const trierAcceptableStatus = ['accepted', 'Aceito']

    const store = await Store.findOne({ tenant: req.tenant })

    if (!store) {

      throw new Error('store_not_found')
    }

    if (!id) {

      throw new Error('order_id_not_provided')
    }

    let order = await Order.findById(id);

    if (!order) {

      throw new Error('order_not_found')
    }

    if (!statusOrderId) {

      throw new Error('status_order_not_provided')
    }

    const statusOrder = await Status.findById(statusOrderId)

    if (!statusOrder) {

      throw new Error('status_order_not_found')
    }

    /*Sending to queue to ERPs*/
    const erpData = await isERPIntegrated(['Trier'], req.tenant) // here you put the erps (correct name please)

    if ((trierAcceptableStatus.includes(statusOrder.type) || trierAcceptableStatus.includes(statusOrder.name)) && erpData.length > 0) {

      await main_queue.publish('erp-main-queue',
        { tenant: req.tenant, order, status: statusOrder.type, erp: erpData[0] }
      )
    }

    if (statusOrder.type === 'delivery_made' && order.prefix === "Pluggto") {
      const externalId = order.externalMarketplace.externalId
      const external_shipping_id = order.shippingData.external_shipping_id

      const pluggto = new Pluggto()
      await pluggto.setup(req.tenant, externalId, external_shipping_id)
      await pluggto.authentication()
      await pluggto.sendDeliveryMadeStatus()
    }

    if (statusOrder.type === 'rejected' || statusOrder.type === 'reversed' && order.paymentMethod) {
      const StoneOrder = getModelByTenant(req.tenant, "StoneOrderSchema")
      const PicpayOrder = getModelByTenant(req.tenant, "PicpayOrderSchema")
      const PagseguroOrder = getModelByTenant(req.tenant, "PagseguroOrderSchema")

      const paymentId = order.paymentMethod._id

      const paymentMethod = await PaymentMethod.findById(paymentId)

      const pbmOrder = await pbmGetPreOrderService.getPreOrder(id)

      if (pbmOrder && pbmOrder.saleReceipt) {
        const epharmaService = new EpharmaService({ settings: store.settings })
        const accessToken = await epharmaService.authenticate()

        const { saleId, items, storeSequenceId, fiscalDocument } = pbmOrder

        const response = await epharmaService.cancelPbmSale({ accessToken, saleId, items, storeSequenceId, fiscalDocument })

        if (!response.error) {
          pbmOrder.status = 'CANCEL'

          await pbmUpdatePreOrderService.updatePbmOrder({ pbmOrder })
        }
      }

      if (!paymentMethod) {

        throw new Error('payment_method_not_found')
      }

      const { paymentOption } = paymentMethod

      switch (paymentOption.name.toLowerCase()) {
        case 'stone':
          const stoneOrder = await StoneOrder.findOne({ 'order._id': new ObjectId(id) })
          if (stoneOrder && stoneOrder.charge_id && stoneOrder.charge_id.length > 0) {
            const charge_id = stoneOrder.charge_id
            let [secret_key, _] = paymentMethod.extras

            secret_key = String(secret_key).replace(/\s/g, '')

            const stoneResponse = await refoundStoneOrder(charge_id, secret_key)

            if (stoneResponse === 'not_ok') {
              console.log(stoneResponse)
              return res.status(500).json({
                error: 'Não foi possível realizar o estorno da Stone'
              })
            }
          }

          break;

        case 'picpay':

          const picpayOrder = await PicpayOrder.findOne({ 'order._id': id })

          if (picpayOrder && picpayOrder.status.includes('paid')) {
            const picpayResponse = await cancelPayment(req.tenant, id);

            if (!picpayResponse.ok) {
              console.log(picpayResponse)
              return res.status(500).json({
                error: picpayResponse.data.error
              });
            }
          }

          break;

        case 'pagseguro':
          const pagseguroOrder = await PagseguroOrder.findOne({ 'order._id': id })

          if (pagseguroOrder && Number(pagseguroOrder.status) === 3) {
            const pagseguroResponse = await refoundOrder(req.tenant, id)

            if (!pagseguroResponse.ok) {
              console.log(pagseguroResponse)
              return res.status(500).json({
                error: pagseguroResponse.data.error
              })
            }
          }

          break;

        default:
          break;
      }
    }

    const updateFields = updateFieldsParser({
      statusOrder,
      trackingCode
    })

    if (order.statusOrder._id.toString() !== statusOrderId.toString()) {

      await order.updateOne({
        ...updateFields,
        updatedAt: Date.now(),
      })

      await History.create({
        order,
        status: statusOrder,
        comments,
        notify: notify.toString(),
      })
    }

    order = await Order.findById(id);

    if (notify) {
      const template = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "views",
        "emails",
        "order_approved.hbs"
      );

      const {
        _id,
        customer: { fullName, email },
        updatedAt,
      } = order;

      const { url, name: storeName } = store

      const orderLink = url.slice(-1) === '/' ?
        `${url}pedido/${_id}` :
        `${url}/pedido/${_id}`

      await sendMail({
        subject: `Pedido nº ${_id}`,
        destination: email,
        isContentHtml: true,
        content: await handlebarsTemplate({
          template,
          variables: {
            storeId: _id,
            name: fullName,
            store: storeName,
            status: statusOrder.name,
            comments,
            updatedAt: moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            link: orderLink,
          },
        }),
      });

      if (trackingCode) {
        const template = path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "views",
          "emails",
          "tracking_code_provided.hbs"
        );

        const {
          _id,
          customer: { fullName, email },
          updatedAt,
        } = order;

        const { url } = store

        await sendMail({
          subject: `Pedido nº ${_id}`,
          destination: email,
          isContentHtml: true,
          content: await handlebarsTemplate({
            template,
            variables: {
              trackingCode: trackingCode,
              storeId: _id,
              name: fullName,
              store: url,
              updatedAt: moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            },
          }),
        });
      }
    }

    return res.json({
      order
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message
    })
  }
})

router.put("/invoice/:orderId",
  objectIdValidation,
  celebrate({
    [Segments.PARAMS]: {
      orderId: Joi.string().required()
    },
    [Segments.BODY]: Joi.object().keys({
      fiscalDocumentLink: Joi.string(),
      fiscalDocumentSerie: Joi.string(),
      fiscalDocumentReceipt: Joi.string(),
      fiscalDocumentKey: Joi.string().required(),
      fiscalDocumentType: Joi.alternatives(100, 200, 300).required(),
    })
  }),
  async (req, res) => {
    try {
      const Order = getModelByTenant(req.tenant, "OrderSchema")
      const PbmOrder = PbmOrderSchema.Model()
      const Store = StoreSchema.Model()

      const updateOrderService = new UpdateOrderService(Order)
      const pbmGetPreOrderService = new PbmGetPreOrderService(PbmOrder)
      const getOrderByOrderIdService = new GetOrderByOrderIdService(Order)
      const pbmUpdatePreOrderService = new PbmUpdatePreOrderService(PbmOrder)

      const orderId = req.params.orderId

      const {
        fiscalDocumentKey,
        fiscalDocumentLink,
        fiscalDocumentType,
        fiscalDocumentSerie,
        fiscalDocumentReceipt,
      } = req.body

      let order = await getOrderByOrderIdService.getOrderByOrderId({ orderId })

      let pbmOrder = await pbmGetPreOrderService.getPreOrder(orderId)

      const store = await Store.findById(req.store)

      if (!store) {

        return res.status(404).json({
          error: 'store_not_found'
        })
      }

      order.nfe_data = {
        nfe_key: fiscalDocumentKey,
        nfe_link: fiscalDocumentLink,
        nfe_serie: fiscalDocumentSerie,
        nfe_number: fiscalDocumentReceipt,
      }

      if (pbmOrder && pbmOrder.status !== 'COMPLETED') {
        pbmOrder.status = 'COMPLETED'
        pbmOrder.fiscalDocument = {
          fiscalPrinter: fiscalDocumentSerie,
          fiscalReceipt: fiscalDocumentReceipt,
          fiscalDocumentType: Number(fiscalDocumentType)
        }
      }

      const externalApiResponse = await sendNfeToExternalApi(order.nfe_data, req.tenant, order, store.settings, pbmOrder)

      order = await updateOrderService.updateOrder({ order, orderId })

      if (pbmOrder && externalApiResponse) {
        const { data } = externalApiResponse
        pbmOrder.saleId = data.saleId
        pbmOrder.saleReceipt = data.saleReceipt
      }
      if (pbmOrder) {
        await pbmUpdatePreOrderService.updatePbmOrder({ pbmOrder })
      }

      order = await updateOrderService.updateOrder({ order, orderId })

      return res.json({
        saleHistory: order
      })

    } catch (error) {
      console.error(error)
      return res.status(500).json({
        error: error.message
      });
    }
  })

router.put("/shipping/:orderId", objectIdValidation, celebrate({
  [Segments.PARAMS]: {
    orderId: Joi.string().required()
  },
  [Segments.BODY]: Joi.object().keys({
    trackCode: Joi.string(),
    trackUrl: Joi.string().required(),
    shippingMethod: Joi.string().required(),
    shippingCompany: Joi.string().required()
  })
}), async (req, res) => {
  try {
    const Order = getModelByTenant(req.tenant, "OrderSchema")
    const updateOrderService = new UpdateOrderService(Order)
    const getOrderByOrderIdService = new GetOrderByOrderIdService(Order)

    const orderId = req.params.orderId

    let order = await getOrderByOrderIdService.getOrderByOrderId({ orderId })

    const { shippingCompany, shippingMethod, trackCode, trackUrl } = req.body



    order.shippingData = {
      ...order.shippingData,
      trackUrl,
      trackCode,
      shippingCompany,
      shippingMethod
    }

    await sendShippingToExternalApi({
      shippingCompany,
      shippingMethod,
      trackCode,
      trackUrl
    },
      req.tenant,
      order)

    if (order.shippingData) {
      if (order.shippingData.external_shipping_id) {
        shippingData.external_shipping_id = order.shippingData.external_shipping_id
      }
    }

    order = await updateOrderService.updateOrder({ order, orderId })

    return res.json({
      saleHistory: order
    })

  } catch (error) {
    console.error(error)
    return res.json({
      error: "internal_server_error",
    });
  }
})

module.exports = router
