import {create} from "apisauce"

const api = create({
  baseURL: "https://service.sitemercado.com.br/api/v1",
  headers: {
    Accept: "text/plain",
    "Content-Type": "application/*+json",
  }
});


export default class iFoodService {
  clientId: string;
  clientSecret: string;
  constructor(clientId: string, clientSecret: string) {
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
        }
      );
      const { access_token } = res.data as any
      return access_token;
    } catch (err) {
      return err;
    }
  }

  async getEvents() {
    try {
      const token = await this.auth();
      api.setHeader("Authorization", `Bearer ${token}`)
      const res = await api.get("/pedido/eventos");
      return res.data;
    } catch (error) {
      return error;
    }
  }
};
