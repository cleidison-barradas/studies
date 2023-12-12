const { remove } = require("myp-admin/services/aws");
const { getModelByTenant } = require("myp-admin/database/mongo");

const getFilter = (key, tenant = "") => {
  let filterQuery = {};
  switch (key) {
    case "tarja_vermelha_nao_generico":
      filterQuery = {
        stripe : "non-generic-red-stripe"
      };
      return filterQuery;
    case "generico_tarja_vermelha":
      filterQuery = {
        stripe: "generic-red-stripe"
      };
      return filterQuery;

    case "tarja_preta_nao_generico":
      filterQuery = {
        stripe : "non-generic-black-stripe"
      };
      return filterQuery;

    case "generico_tarja_preta":
      filterQuery = {
        stripe : "generic-black-stripe"
      };
      return filterQuery;

    case "generico_otc":
      filterQuery = {
        stripe : "generic-otc"
      };
      return filterQuery;

    case "sem_imagem":
      filterQuery = {
        $and: [
          {
            $or: [
              { "image.key": "mockups/sem-imagem-padrao.jpg" },
              { "image.key": `${tenant}/mockups/sem_imagem.jpg` },
              { image: null },
            ],
          },
          {
            "category.name": new RegExp("Perfumaria", "gi"),
          },
        ],
      };
      return filterQuery;
    default:
      return filterQuery;
  }
};

const handleDeletion = async (mockups, tenant) => {
  const {
    tarja_vermelha_nao_generico,
    generico_tarja_vermelha,
    tarja_preta_nao_generico,
    generico_tarja_preta,
    generico_otc,
    sem_imagem,
  } = mockups;

  try {
    const File = getModelByTenant(tenant, "FileSchema");
    const Product = getModelByTenant(tenant, "ProductSchema");
    const Category = getModelByTenant(tenant, "CategorySchema");

    let path = "";
    if (!tarja_vermelha_nao_generico) {
      path = `${tenant}/mockups/tarja_vermelha_nao_generico.jpg`;
      const file = await File.findOne({ key: path });
      if (file) {
        file.deleteOne();
      }
      await remove(path);

      const filter = getFilter("tarja_vermelha_nao_generico", tenant);
      const mock = await File.findOne({
        key: `mockups/tarja-vermelha-nao-generico.jpg`,
      });
      await Product.updateMany(filter, { image: mock });
    }

    if (!generico_tarja_vermelha) {
      path = `${tenant}/mockups/generico_tarja_vermelha.jpg`;
      const file = await File.findOne({ key: path });
      if (file) {
        file.deleteOne();
      }
      await remove(path);

      const filter = getFilter("generico_tarja_vermelha", tenant);
      const mock = await File.findOne({
        key: `mockups/generico-tarja-vermelha.jpg`,
      });
      await Product.updateMany(filter, { image: mock });
    }

    if (!tarja_preta_nao_generico) {
      path = `${tenant}/mockups/tarja_preta_nao_generico.jpg`;
      const file = await File.findOne({ key: path });
      if (file) {
        file.deleteOne();
      }
      await remove(path);

      const filter = getFilter("tarja_preta_nao_generico", tenant);
      const mock = await File.findOne({
        key: `mockups/tarja-preta-nao-generico.jpg`,
      });
      await Product.updateMany(filter, { image: mock });
    }

    if (!generico_tarja_preta) {
      path = `${tenant}/mockups/generico_tarja_preta.jpg`;
      const file = await File.findOne({ key: path });
      if (file) {
        file.deleteOne();
      }
      await remove(path);

      const filter = getFilter("generico_tarja_preta", tenant);
      const mock = await File.findOne({
        key: `mockups/generico-tarja-preta.jpg`,
      });
      await Product.updateMany(filter, { image: mock });
    }

    if (!generico_otc) {
      path = `${tenant}/mockups/generico_otc.jpg`;
      const file = await File.findOne({ key: path });
      if (file) {
        file.deleteOne();
      }
      await remove(path);

      const filter = getFilter("generico_otc", tenant);
      const mock = await File.findOne({
        key: `mockups/generico_otc.jpg`,
      });
      await Product.updateMany(filter, { image: mock });
    }

    if (!sem_imagem) {
      path = `${tenant}/mockups/sem_imagem.jpg`;
      const file = await File.findOne({ key: path });
      if (file) {
        file.deleteOne();
      }
      await remove(path);

      const filter = getFilter("sem_imagem", tenant);
      const mock = await File.findOne({
        key: `mockups/sem-imagem-padrao.jpg`,
      });
      await Product.updateMany(filter, { image: mock });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { getFilter, handleDeletion };
