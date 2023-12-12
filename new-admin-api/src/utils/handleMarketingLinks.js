const { checkExistence } = require("../services/aws");
const { AWS_S3_URL } = process.env;

/*
  Arquivo aparentemente não utilizado!
  Links carregados em routes/v1/store
*/

async function handleMarketingLinks(tenant) {
  try {
    const links = {
      facebook_shopping: `produtos_para_facebook/${tenant}/produtos_facebook_${tenant}.csv`,
      google_shopping: `produtos_para_google/${tenant}/produtos_para_google_${tenant}.xml`,
      consulta_remedios: `produtos_consulta_remedios/${tenant}/produtos_consultaremedios_${tenant}.csv`,
      cote_facil: `produtos_cotefacil/${tenant}/produtos_ifood_drogacentro.csv`,
      farmacia_marketplace: `produtos_guia_da_farmacia/${tenant}/produtos_guia_da_farmacia_${tenant}.csv`,
      cliquefarma: `produts_cliquefarma/${tenant}/produtos_cliquefarma_${tenant}.xml`,
      buscape: `produtos_buscape/${tenant}/produtos_buscape_${tenant}.xml`

    };

    if (!(await checkExistence(links.facebook_shopping))) {
      delete links.facebook_shopping;
    }
    if (!(await checkExistence(links.google_shopping))) {
      delete links.google_shopping;
    }
    if (!(await checkExistence(links.consulta_remedios))) {
      delete links.consulta_remedios;
    }
    if (!(await checkExistence(links.cote_facil))) {
      delete links.cote_facil;
    }
    if (!(await checkExistence(links.farmacia_marketplace))) {
      delete links.farmacia_marketplace;
    }
    if (!(await checkExistence(links.cliquefarma))){
      delete links.cliquefarma;
    }
    if (!(await checkExistence(links.buscape))){
      delete links.buscape;
    }

    Object.keys(links).forEach((elem) => {
      links[elem] = `${AWS_S3_URL}${links[elem]}`;
    });
    return links;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = handleMarketingLinks;
