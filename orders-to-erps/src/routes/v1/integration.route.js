const router = require('express').Router();
const Sequelize = require('sequelize');
const uuid = require('uuid');
const database = require('../../database');


const decodeToken = require('../../middlewares/decodeToken.middleware');
const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.post('/products', decodeToken, async (req, res) => {
    const storeId = req.storeId;
    const { page = 1 } = req.query;
    const pageSize = 30;

    if (storeId) {
        const allOrder = await database.order.findAll({ where: { store_id: storeId, order_status_id: { [Sequelize.Op.or]: [3, 17, 19] } } });
        let totalPages = Math.ceil(allOrder.length / pageSize);
        const orders = await database.order.findAll({

            where: {
                store_id: storeId,
                order_status_id: {
                    [Sequelize.Op.or]: [3, 17, 19]
                }
            },
            limit: pageSize,
            offset: (page - 1) * pageSize,
            attributes: [
                'order_id',
                'store_name',
                'store_url',
                'firstname',
                'lastname',
                'email',
                'cpf',
                'telephone',
                'shipping_company',
                'shipping_address_1',
                'shipping_address_2',
                'shipping_city',
                'shipping_postcode',
                'shipping_zone',
                'shipping_country',
                'total',
                'order_status_id',
                'payment_method',
                'date_added'
            ],
            include: [
                {
                    model: database.orderProduct,
                    include: [
                        {
                            model: database.product,
                            attributes: [
                                'ean',
                                'ms'
                            ]
                        }
                    ],
                    attributes: [
                        'model',
                        'quantity',
                        'price',
                        'total'
                    ]
                },
                {
                    model: database.paymentOrder,
                    attributes: [
                        'money_change',
                        'conven_id',
                        'conven_password'
                    ],
                    include: [
                        {
                            model: database.paymentOption,
                            attributes: [
                                'name',
                                'type'
                            ]
                        }
                    ]

                },
                {
                    model: database.orderTotal,
                    attributes: [
                        'code',
                        'title',
                        'value'
                    ]
                },
                {
                    model: database.orderStatus
                }
            ],
            order: [
                ['date_added', 'DESC']
            ]
        })
        const items = orders.map(order => {
            const {
                order_id,
                store_name,
                store_url,
                firstname,
                lastname,
                email,
                cpf,
                telephone,
                shipping_company,
                shipping_address_1,
                shipping_address_2,
                shipping_city,
                shipping_postcode,
                shipping_zone,
                shipping_country,
                total,
                order_status_id,
                payment_method,
                date_added,
                orderProducts,
                paymentOrders,
                deliveryData,
                orderTotals,
                orderStatus 
            } = order
            const iswithdrawInStore = shipping_address_1.indexOf('RETIRAR') !== -1

            return {
                order_id,
                store_name,
                store_url,
                firstname,
                lastname,
                email,
                cpf,
                telephone,
                shipping_company,
                shipping_address_1,
                shipping_address_2,
                shipping_city,
                shipping_postcode,
                shipping_zone,
                shipping_country,
                total,
                order_status_id,
                payment_method,
                date_added,
                withdraw_in_store: iswithdrawInStore,
                orderProducts,
                paymentOrders,
                deliveryData,
                orderTotals,
                orderStatus,
            }
        })
        return res.json({
            orders: items,
            items: orders.length,
            pages: totalPages
        })

    } else {
        res.status(400).json({
            error: 'store_not_informed'
        })
    }
});

router.post('/setUserToStore', async (req, res) => {
    const { store_id, user_id } = req.body;

    try {
        const integrationExist = await database.orderIntegration.findOne({
            where: {
                integration_user_id: user_id,
                store_id
            }
        })

        if (integrationExist) {
            return res.status(403).json({
                error: 'user_have_integration_with_store'
            })

        } else {
            const token = uuid.v4();
            const userExist = await database.user.findOne({
                where: {
                    integration_user_id: user_id
                }
            })
            if (!userExist) {
                return res.status(404).json({
                    error: 'user_not_found'
                })
            }

            const response = await database.orderIntegration.create({
                store_id,
                integration_user_id: user_id,
                token
            })

            return res.json({
                token: response.token
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'internal_server_error'
        })

    }
});

router.get('/list-integrations', async (req, res) => {
    try {
        const users = await database.orderIntegration.findAll(
            {
                include: [
                    {
                        model: database.user,
                        attributes: [
                            "username",
                            "email",
                        ]
                    },
                    {
                        model: database.store,
                        attributes: [
                            "name",
                            "url"
                        ]
                    }
                ]
            }
        );

        if (users.length > 0) {
            return res.json({
                users
            })
        }
        return res.status(400).json({
            error: 'users_not_found'
        })

    } catch (error) {
        return res.status(500).json({
            error: 'internal_server_error'
        })
    }
})

router.get('/list-stores', async (req, res) => {
    try {
        const stores = await database.store.findAll(
            {
                attributes: [
                    "store_id",
                    "name",
                    "url"
                ]
            }
        );

        if (stores) {
            return res.json({
                stores
            })
        } else {
            res.status(400).json({
                error: 'stores_not_found'
            })
        }
    } catch (error) {
        return res.status(500).json({
            error: 'internal_server_error'
        })
    }
})

router.get('/list-users', async (req, res) => {
    try {
        const users = await database.user.findAll({
            where: {
                is_admin: {
                    [Sequelize.Op.not]: true
                }
            },
            attributes: [
                "integration_user_id",
                "username",
                "is_admin"
            ]

        });

        if (users) {
            return res.json({
                users
            })
        } else {
            res.status(400).json({
                error: 'users_not_found'
            })
        }
    } catch (error) {
        return res.status(500).json({
            error: 'internal_server_error'
        })
    }
})

module.exports = router;