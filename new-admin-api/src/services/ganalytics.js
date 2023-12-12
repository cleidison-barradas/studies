const { google } = require('googleapis');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

module.exports = {
  async queryData(data, store, res) {
    try {
      const {
        dimensions,
        metrics,
        startDate,
        endDate,
        sort
      } = data;

      const {
        ga_client_email,
        ga_private_key,
        gaview,
        config_analytics_id
      } = store.settings;

      if (!gaview) {
        return res.status(404).json({
          error: 'gaview_not_registered'
        });
      }

      const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
      const privateKey = ga_private_key.replace(/\\n/g, '\n');
      const isVersion4 = config_analytics_id.startsWith('G-');

      if (isVersion4) {
        const analyticsDataClient = new BetaAnalyticsDataClient({
          credentials: {
            client_email: ga_client_email,
            private_key: privateKey,
          }
        });

        const [response] = await analyticsDataClient.runReport({
          property: `properties/${gaview}`,
          dateRanges: [
            {
              startDate,
              endDate,
            },
          ],
          dimensions: [
            {
              name: dimensions,
            },
          ],

          metrics: [{ name: metrics }],
        });

        return res.json(response);

      } else {

        const jwt = new google.auth.JWT({
          email: ga_client_email,
          key: privateKey,
          scopes
        });

        await jwt.authorize();

        const analytics = google.analytics('v3');
        const queryParams = {
          auth: jwt,
          'ids': 'ga:' + gaview,
          'dimensions': dimensions,
          'metrics': metrics,
          'start-date': startDate,
          'end-date': endDate
        };

        if (sort) {
          queryParams.sort = sort;
        }


        const response = await analytics.data.ga.get(queryParams)

        return res.json(response.data);
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};






