const axios = require('axios')

const { getStoreCep } = require('../../helpers/getStoreCep')

const parseCpf = (cpf) => {
    cpf = cpf.trim()
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`
}

const parseNumbers = (phone) => {
    const numberPattern = /\d+/g
    return phone.match(numberPattern).join('')
}

const trimString = (value, maxLength) => {
    if (value) {
        return value.slice(0, maxLength)
    }
    return ''
}

const formatPhoneNumber = (phoneNumber) => {
    const digitsOnly = phoneNumber.replace(/\D/g, "")

    if (digitsOnly.length === 10) {
        return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2-$3")
    }
    if (digitsOnly.length === 11) {
        return digitsOnly.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "$1 $2 $3-$4")
    }
    return digitsOnly
}

const parseAddress = (address, storeCep) => {
    const street = address?.street || ''
    const number = address?.number ? trimString(address.number, 5) : 'S/'
    const complement = address?.complement ? trimString(address.complement, 20) : ''
    const cep = address?.postcode ? trimString(parseNumbers(address.postcode), 8) : trimString(parseNumbers(storeCep), 8)
    const neighborhood = address?.neighborhood?.name ? trimString(address.neighborhood.name, 35) : ''
    const city = address?.neighborhood?.city?.name ? trimString(address.neighborhood.city.name, 50) : ''
    const state = address?.neighborhood?.city?.state?.code ? trimString(address.neighborhood.city.state.code, 2) : 'NI'

    return {
        logradouro: street,
        numero: number,
        complemento: complement,
        referencia: '',
        bairro: neighborhood,
        cidade: city,
        estado: state.toString(),
        cep: cep,
    }
}

const parseClient = (customer, cpfOrder) => {
    const { fullName, phone, email, cpf } = customer
    const cpfTrier = cpf ?? cpfOrder

    return {
        codigo: 1,
        nome: trimString(fullName, 40),
        numeroCpfCnpj: cpfTrier ? trimString(parseCpf(cpfTrier), 18) : "",
        numeroRGIE: "",
        sexo: "F",
        dataNascimento: null,
        celular: phone ? trimString(formatPhoneNumber(phone), 14) : "",
        fone: phone ? trimString(formatPhoneNumber(phone), 14) : "",
        email: email ? trimString(email, 80) : "",
    }
}

const parsePayments = (payment, moneyChange, total) => {
    const money = moneyChange ? moneyChange : 0.00
    if (payment.paymentOption.type === 'money') {
        return {
            pagamentoRealizado: false,
            valorParcela: total,
            dataVencimento: null,
            valorDinheiro: Number(Number(total - money).toFixed(2)),
            valorTroco: money > 0 ? Number(Number(money).toFixed(2)) : 0.00,
            numeroAutorizacao: null,
        }
    }
    return {
        pagamentoRealizado: true,
        valorParcela: total,
        dataVencimento: null,
        valorDinheiro: 0.00,
        valorTroco: 0.00,
        numeroAutorizacao: null,
    }
}

const parseProducts = (products) => {
    const parsedProducts = []
    products.forEach(product => {
        parsedProducts.push({
            codigoProduto: product && product.product && product.product.sku ? parseInt(product.product.sku) : 1,
            nomeProduto: product && product.product && product.product.name ? trimString(product.product.name, 30) : '',
            quantidade: product && product.amount ? product.amount : 0,
            valorUnitario: product && product.promotionalPrice ? Number((product.promotionalPrice).toFixed(2)) : product.unitaryValue ? Number((product.unitaryValue).toFixed(2)) : 0.00,
            valorDesconto: 0.00
        })
    })
    return parsedProducts
}

const parseOrder = async (tenant, order) => {
    const { deliveryMode, customer, cpf, paymentMethod, moneyChange, products, deliveryData } = order
    const storeCep = await getStoreCep(tenant)
    const total = order && order.totalOrder ? Number(Number(order.totalOrder).toFixed(2)) : 0.00
    const parsed = {
        numeroPedido: "1",
        dataPedido: new Date(order.createdAt).toISOString().split('T')[0],
        valorTotalVenda: total ? total : 0.00,
        valorFrete: deliveryData && deliveryData.feePrice ? deliveryData.feePrice : 0.00,
        entrega: deliveryMode === 'store_pickup' ? false : true,
        cliente: parseClient(customer, cpf),
        enderecoEntrega: parseAddress(customer.addresses[0], storeCep),
        pagamento: parsePayments(paymentMethod, moneyChange, total),
        produtos: parseProducts(products)
    }
    return (parsed)
}

const sendToTrier = async (data, erp) => {
    const { baseUrl, token } = erp

    try {
        const apiUrl = `${baseUrl}/rest/integracao/venda/ecommerce/efetuar-venda-v1`
        const api = await axios({
            method: "POST",
            url: apiUrl,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: data,
        })

        console.log(`Orders send sucess:${api.status}`)
    } catch (error) {
        console.log(error)
        throw new Error("integration error")
    }
}

module.exports = {
    parseProducts,
    parsePayments,
    formatPhoneNumber,
    parseCpf,
    parseOrder,
    parseNumbers,
    trimString,
    sendToTrier,
    parseAddress,
    parseClient
}