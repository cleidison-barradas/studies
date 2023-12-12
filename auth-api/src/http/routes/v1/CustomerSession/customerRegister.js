module.exports = {

    parseUserRegisterREQ(customer){
        customer.email = customer.email.toString().toLowerCase()

        if (customer.cpf && customer.cpf.length > 0) {
            customer.cpf = customer.cpf.toString().replace(/\D/g, '') 
        }
        else customer.cpf = ''

        customer.telephone = customer.telephone.toString().replace(/\D/g, '')

        return customer
    }

}