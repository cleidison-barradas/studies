module.exports = function parseOrder(ifoodOrder){
    const { cliente, items, valorMercado, valorConveniencia, valorEntrega, valorTotal, valorTroco, enderecoEntrega, codigo } = ifoodOrder;
    let enderecoEntregaParsed = ""
    if(enderecoEntrega){
        const { logradouro, numero, complemento, bairro, cidade } = enderecoEntrega;
        enderecoEntregaParsed = `${logradouro} ${numero} ${complemento} ${bairro} ${cidade}`
    }
    const customer = parseCustomer(cliente, enderecoEntrega)
    const products = parseProducts(items)

    const order = {
        prefix: "iFood",
        comment: codigo,
        orderTotals: [
            {
                code: "sub_total",
                title: "Sub-total",
                value: valorMercado
            },
            {
                code: "shipping",
                title: "Frete + Taxas",
                value: Number(valorConveniencia + valorEntrega)
            },
            {
                code: "total",
                title: "Total",
                value: valorTotal
            }
        ],
        deliveryMode: enderecoEntregaParsed === "" ? "store_pickup" : undefined, 
        deliveryData: {
            feePrice: Number(valorConveniencia + valorEntrega),
            neighborhood: {
                name: enderecoEntregaParsed
            }
        },
        paymentMethod: {
            paymentOption: {
                name: "iFood"
            }
        },
        totalOrder: valorTotal,
        paymentCode: "iFood",
        moneyChange: valorTroco,
        customer,
        products,
        cpf: customer.cpf
    }

    return order;

}

function parseCustomer(ifoodCustomer, enderecoEntrega){
    let logradouro = "";
    let numero = 0;
    let bairro = "";
    let cidade = "";
    if(enderecoEntrega){
        logradouro = enderecoEntrega.logradouro;
        numero = enderecoEntrega.numero;
        bairro = enderecoEntrega.bairro;
        cidade = enderecoEntrega.cidade;
    }
    const { id, nome, email, cpf, telefoneCelular, dataNascimento } = ifoodCustomer;
    const firstname = nome.split(' ')[0];
    const lastname = nome.split(' ').slice(1).join(' ');
    const body = {
        firstname,
        lastname,
        fullName: nome,
        email,
        cpf,
        phone: formatPhone(telefoneCelular),
        birthdate: dataNascimento,
        originalId: id,
        addresses: [
            {
                street: logradouro,
                number: numero,
                neighborhood: {
                    name: bairro,
                    city: {
                        name: cidade
                    }
                }

            }
        ]
    }
    return body;
}

function parseProducts(ifoodProducts){
    return ifoodProducts.map(item => {
        const { codigoBarra, quantidade, valor, produto } = item;
        return {
            product: {
                name: produto,
                EAN: codigoBarra
            },
            amount: quantidade,
            unitaryValue: valor
        }
    });
}

function formatPhone(phone) {
    if(phone.length === 11){
        return `(${phone.substring(0,2)}) ${phone.substring(2,7)}-${phone.substring(7,11)}`
    }
    return phone;
}