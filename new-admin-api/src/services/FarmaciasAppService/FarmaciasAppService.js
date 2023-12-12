const { callFirstLoad } = require('./requests');

module.exports = class FarmaciasAppService {
  constructor(props) {
    const {
      config_farmaciasapp_client_secret,
      config_farmaciasapp_client_id,
      config_farmaciasapp_seller_id,
      cnpj,
    } = props;
    this.client_id = config_farmaciasapp_client_id;
    this.client_secret = config_farmaciasapp_client_secret;
    this.seller_id = config_farmaciasapp_seller_id;
    this.cnpj = cnpj;
  }

  async callFirstLoad() {
    const data = await callFirstLoad({
      id: this.seller_id,
      document: this.cnpj,
      clientId: this.client_id,
      clientSecret: this.client_secret,
    });

    return data;
  }
};
