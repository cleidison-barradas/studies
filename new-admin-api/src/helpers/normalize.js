const { format } = require('date-fns')

const formater = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const {processOrderStatus} = require('./processSumOrderStatus')

module.exports = {
    normalizeCustomer(customers) {
        const normalizedFields = {
            fullName: 'Nome inteiro',
            firstname: 'Nome',
            lastname: 'Sobrenome',
            email: 'email',
            phone: 'Telefone',
            createdAt: 'Data de registro',
            birthdate: 'Data de nascimento',
        }

        return customers.map(({ _doc: { addresses, ...customer } }) => {
            const normalized = {}

            customer.createdAt = format(new Date(customer.createdAt), 'dd/MM/yyyy')

            Object.keys(normalizedFields).map((key) => {
                normalized[normalizedFields[key]] = customer[key]
            })

            addresses.map((address, index) => {
                const { neighborhood } = address
                let endereco = "";
                endereco = `${address.street},${address.complement}`;

                if (neighborhood) {
                  endereco += `,${neighborhood.name}`;
                  if (neighborhood.city) {
                      endereco += `,${neighborhood.city.name}`;
                      if (neighborhood.city.state)
                          endereco += `,${neighborhood.city.state.name}`;
                  }
                }
                normalized[`Endereco-${index + 1}`] = endereco;
            })

            return normalized
        })

    },

    normalizeOrders(orders = []) {
        const records = []
        let totalSold = 0

        const statusCounts = {
            totalPending: 0,
            totalRejected: 0,
            totalDelivery_made: 0,
            totalReversed: 0,
            totalOut_delivery: 0,
            totalPayment_made: 0,
            totalDefault: 0,
            totalAccepted: 0,
            totalInstallmentsFee: 0
          }

        const normalizedFields = {
            prefix: 'Origem',
            _id: 'ID do pedido',
            customer: 'Nome do Cliente',
            email: 'Email',
            status: 'Status do pedido',
            createdAt: 'Data do pedido',
            cupom: 'Cupom',
            totalOrder: 'Valor total dos pedidos',
        }

        orders.forEach(({ _doc }) => {
            if (_doc && _doc !== null) {
                let record = {}
                const { products = [] } = _doc

                processOrderStatus(_doc, statusCounts)

                if (_doc.paymentMethod && _doc.paymentMethod.details && _doc.paymentMethod.details.payment_quota) {
                  statusCounts.totalInstallmentsFee += _doc.paymentMethod.details.payment_quota
                }

                totalSold += _doc.totalOrder
                _doc._id = "" + _doc._id
                _doc.email = _doc.customer.email
                _doc.status = _doc.statusOrder.name
                _doc.customer = _doc.customer.fullName
                _doc.totalOrder = formater.format(_doc.totalOrder)
                _doc.prefix = _doc.prefix === 'iFood' ? 'iFood' : 'Ecommerce'
                _doc.createdAt = format(new Date(_doc.createdAt), 'dd/MM/yyyy')

                if(_doc.installedApp){
                    if(_doc.installedApp === true && _doc.prefix === 'Ecommerce'){
                        _doc.prefix ='Ecommerce (APP)'
                    }
                }

                if (typeof _doc.cupom !== "object" || _doc.cupom === null) {
                    _doc.cupom = "Não Utilizou";
                }
                else
                    _doc.cupom = _doc.cupom.code

                Object.keys(normalizedFields).forEach(key => {
                    record[normalizedFields[key]] = _doc[key]
                })

                products.forEach((_product, index) => {
                    if (_product.product) {
                        record[`Produto-${index + 1}`] = `${_product.amount}x - ${_product.product.EAN} - ${formater.format(_product.unitaryValue)} (${_product.product.name})`
                    }
                })

                records.push(record)
            }

        })
        records.unshift(
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Pendentes: ${formater.format(statusCounts.totalPending)}`
            },
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Aceitos: ${formater.format(statusCounts.totalAccepted)}`
            },
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Rejeitados: ${formater.format(statusCounts.totalRejected)}`
            },
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Entregues: ${formater.format(statusCounts.totalDelivery_made)}`
            },
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Estornados: ${formater.format(statusCounts.totalReversed)}`
            },
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Saíram para entrega: ${formater.format(statusCounts.totalOut_delivery)}`
            },
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Pagamento realizado: ${formater.format(statusCounts.totalPayment_made)}`
            },
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Aguardando: ${formater.format(statusCounts.totalDefault)}`
            },
            {
              'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
              'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
              'Valor total dos pedidos': `Eventuais taxas (parcelamento, serviços externos...): ${formater.format(statusCounts.totalInstallmentsFee)}`,
               'Produto-1': 'Esse valor não entra no total, serve somente para informação.'
          },
            {
                'Origem': ' ', 'ID do pedido': ' ', 'Nome do Cliente': ' ', 'Email': ' ',
                'Status do pedido': ' ', 'Data do pedido': ' ', 'Cupom': ' ',
                'Valor total dos pedidos': `Total: ${formater.format(totalSold)}`
            },
        )


        if (records) {
            const lastElement = records.pop()
            if (lastElement !== undefined) { //prevent that last element cause erros
                records.push(lastElement)
            }
            return records
        }
    },

    /**
   * [Get how many units of each product has been sold from an array of orders]
   * @param  {[array]} orders [Array of objects containing orders data]
   * @return {[array]} ordersProducts [Array of objects containing  products EANs, Names and units sold]
    */
    getOrdersProducts(orders = []) {
        var productsRank = []
        orders.forEach(({ _doc }) => {
            if (_doc) {
                const { products = [] } = _doc
                products.forEach((_product, index) => {
                    let productsHistory = {}
                    productsHistory['EAN'] = _product.product.EAN
                    productsHistory['Nome'] = _product.product.name
                    productsHistory['Quantidade'] = _product.amount
                    productsRank.push(productsHistory)
                })
            }
        })

        const reduceOrdersProducts = productsRank.reduce((val, cur) => {
            val[cur.EAN] = val[cur.EAN] ? val[cur.EAN] + parseInt(cur.Quantidade) : 1;
            return val;
        }, {});


        let ordersProducts = Object.keys(reduceOrdersProducts).map((key) => {
            const productName = productsRank.find(p => p.EAN === key)
            if (productName) {
                return {
                    EAN: key,
                    Nome: productName.Nome,
                    'Vendidos': reduceOrdersProducts[key]
                }
            }
        }
        );

        if (ordersProducts) {
            ordersProducts.sort((a, b) => (b.Vendidos) - (a.Vendidos));
            const lastElement = ordersProducts.pop()
            if (lastElement !== undefined) { //prevent that last element cause erros
                ordersProducts.push(lastElement)
            }
            return ordersProducts
        }
        //return getProductsTotalSold(productsRank)
    },

    /**
   * [Stores Emails, Names and total orders from customers of an array of orders]
   * @param  {[array]} content [Array of objects containing orders data]
   * @return {[array]} ordersCustomers [Array of objects containing orders customers and it's informations]
    */
    getOrdersEmails(content = []) {
        content.shift() //remove a soma do total de todos os pedidos
        const reduceOrdersEmails = content.reduce((val, cur) => {
            val[cur.Email] = val[cur.Email] ? val[cur.Email] + 1 : 1;
            return val;
        }, {});
        let ordersCustomers = Object.keys(reduceOrdersEmails).map((key) => {
            const customerName = content.find(p => p.Email == key)
            if (customerName) {
                return {
                    Email: key,
                    Nome: customerName['Nome do Cliente'],
                    'Quantidade de Pedidos': reduceOrdersEmails[key]
                }
            }
        }
        );
        if (ordersCustomers) {
            ordersCustomers.sort((a, b) => (b['Quantidade de Pedidos']) - (a['Quantidade de Pedidos']))
            const lastElement = ordersCustomers.pop()
            if (lastElement !== undefined) { //prevent that last element cause erros
                ordersCustomers.push(lastElement)
            }
            return ordersCustomers
        }
    }


}
