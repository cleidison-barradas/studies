const router = require("express").Router();
const multer = require("multer");
const crypto = require("crypto")
const multerConfig = require("myp-admin/services/multer");
const { put, checkExistence } = require("myp-admin/services/aws");

const { getModelByTenant } = require("myp-admin/database/mongo");
const AsyncLoop = require("myp-admin/utils/async-loop");
const ImageCompress = require("myp-admin/utils/fileHelper");
const { getFilter, handleDeletion } = require("./handleMockup");

router.post("/", async (req, res) => {
  try {
    const File = getModelByTenant(req.tenant, "FileSchema");
    let { file, folder } = req.body

    const hash = crypto.randomBytes(16).toString("hex");
    const name = `${hash}${file.name}`;

    const originalContent = file.content;

    file.content = await ImageCompress(originalContent, {
      width: undefined,
      height: undefined,
    });

    const path = `${req.tenant}/${folder}/${file.name}`
    const { Location, Key } = await put(path, file)

    const image = await File.create({
      name,
      url: Location,
      key: Key,
      folder,
    });

    return res.json({
      image,
    });
  } catch (error) {
    return res.status(500).json({
      error: "internal_server_error",
    });
  }


});

router.get("/mockups", async (req, res) => {
  try {
    const File = getModelByTenant(req.tenant, "FileSchema");

    const mockupsUrls = {
      tarja_vermelha_nao_generico: `${req.tenant}/mockups/tarja_vermelha_nao_generico.jpg`,
      generico_tarja_vermelha: `${req.tenant}/mockups/generico_tarja_vermelha.jpg`,
      tarja_preta_nao_generico: `${req.tenant}/mockups/tarja_preta_nao_generico.jpg`,
      generico_tarja_preta: `${req.tenant}/mockups/generico_tarja_preta.jpg`,
      generico_otc: `${req.tenant}/mockups/generico_otc.jpg`,
      sem_imagem: `${req.tenant}/mockups/sem_imagem.jpg`,
    };

    const mockups = await File.find({
      $or: [
        { key: mockupsUrls.tarja_preta_nao_generico },
        { key: mockupsUrls.tarja_vermelha_nao_generico },
        { key: mockupsUrls.generico_tarja_preta },
        { key: mockupsUrls.generico_tarja_vermelha },
        { key: mockupsUrls.generico_otc },
        { key: mockupsUrls.sem_imagem },
      ],
    });
    const defaultMockups = {
      tarja_vermelha_nao_generico: `mockups/tarja-vermelha-nao-generico.jpg`,
      generico_tarja_vermelha: `mockups/generico-tarja-vermelha.jpg`,
      tarja_preta_nao_generico: `mockups/tarja-preta-nao-generico.jpg`,
      generico_tarja_preta: `mockups/generico-tarja-preta.jpg`,
      generico_otc: `mockups/generico_otc.jpg`,
      sem_imagem: `mockups/sem-imagem-padrao.jpg`,
    };
    if (mockups && mockups.length === 0) {
      return res.json({ mockups: defaultMockups });
    }
    await AsyncLoop(Object.keys(mockupsUrls), async (key) => {
      const exists = await checkExistence(mockupsUrls[key]);
      if (exists) {
        defaultMockups[key] = mockupsUrls[key];
      }
    });
    return res.json({ mockups: defaultMockups });
  } catch (error) {
    return res.json({ error: "internal_server_error" });
  }
});

router.put("/mockups", async (req, res) => {
  const { mockups } = req.body;

  try {
    const File = getModelByTenant(req.tenant, "FileSchema");
    const Product = getModelByTenant(req.tenant, "ProductSchema");

    await handleDeletion(mockups, req.tenant);
    await AsyncLoop(Object.keys(mockups), async (key) => {
      if (mockups[key] && typeof mockups[key] === "object") {
        const { content } = mockups[key];
        mockups[key].content = await ImageCompress(content, 250);
        const path = `${req.tenant}/mockups/${key}.jpg`;
        const { Location, Key } = await put(path, mockups[key]);
        const file = await File.create({
          name: `${key}.jpg`,
          key: Key,
          url: Location,
          folder: "mockups",
        });
        const updateQuery = {
          image: file,
        };

        const filterQuery = getFilter(key);

        await Product.updateMany(filterQuery, updateQuery);
      }
    });
    return res.json({ message: "OK" });
  } catch (error) {
    return res.json({ error: "internal_server_error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const File = FileSchema.Model();
    const { id } = req.params;

    if (id) {
      const image = await File.findById(id);

      if (!image) {
        return res.status(404).json({
          error: "image_not_found",
        });
      }

      await multerConfig.remove(image.key);
      await image.deleteOne();

      return res.json({
        deletedId: id,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

module.exports = router;
