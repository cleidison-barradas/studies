const axios = require('axios');

const { FARMACIAS_APP_API_URL } = process.env;

const api = axios.create({
  baseURL: FARMACIAS_APP_API_URL,
});

module.exports = {
  callFirstLoad: async (payload) => {
    const { id, document, clientId, clientSecret } = payload;
    const headers = {
      'Content-Type': 'application/json',
    };

    const body = {
      id,
      document,
      clientId,
      clientSecret,
    };

    const { data, error } = await api.post('/sellers/mypharma', body, {
      headers,
    });

    if (error) throw new Error(error);

    return data;
  },
};
