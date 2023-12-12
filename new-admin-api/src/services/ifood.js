const axios = require("axios");

const api = axios.create({
  baseURL: "https://service.sitemercado.com.br/api/v1",
});

module.exports = class iFoodService {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
  async auth() {
    try {
      const res = await api.post(
        "/oauth/token",
        {
          grant_type: "client_credentials",
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        {
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/*+json",
          },
        }
      );

      return res.data.access_token;
    } catch (err) {
      if(err.response.status === 401){
        throw new Error('Credenciais do iFood Inválidas')
      }
  
      throw new Error(err);
    }
  }

  async getHeaders() {
    try {
      const token = await this.auth();
      const headersAuth = {
        Accept: "text/plain",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      return headersAuth;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getEvents() {
    try {
      let headers = await this.getHeaders();
      const res = await api.get("/pedido/eventos", { headers });
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async queryEvent(eventCode) {
    try {
      let headers = await this.getHeaders();
      const res = await api.get(`/pedido/${eventCode}`, { headers });
      return res.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateEvent(eventId) {
    try {
      let headers = await this.getHeaders();
      const data = [{ id: eventId }];
      const res = await api.post(`/pedido/eventos/verificado`, data, {
        headers,
      });

      return res;
    } catch (error) {
      throw new Error(error);
    }
  }
};
