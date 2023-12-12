const router = require('express').Router()

const { Mongo: { Models: { StoreSchema } } } = require('myp-admin/database')

const { paginationParser } = require('myp-admin/helpers')
const updateFieldsParser = require('../../../../helpers/update-fields.parser')

const { rulesMiddleware, objectIdValidation } = require('myp-admin/http/middlewares')
const authMiddleware = require('myp-admin/http/middlewares/auth.middleware');
const requestRules = require('./rules')
router.use((req, res, next) => rulesMiddleware(req, res, next, requestRules))


router.get('/:id?', authMiddleware, objectIdValidation, async (req, res) => {
  const Store = StoreSchema.Model();
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;

  if (id) {
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ error: 'store not found'});
    }
  }

  paginationOptions = {
    page,
    limit,
    select: ['_id', 'name','url' ,'tenant']
  };
  const pagination = await Store.paginate({}, paginationOptions);

  return res.json(paginationParser('store', pagination));
});

router.put('/', async (req, res) => {

  const { name, url, tenant } = req.body

  const Store = StoreSchema.Model()

  const store = await Store.create({
    name, url, tenant
  })

  return res.json({
    store
  })
});

router.post('/:id', authMiddleware, objectIdValidation , async (req, res) => {
  const Store = StoreSchema.Model();
  const { id } = req.params;
  const { name, url, tenant } = req.body;

  let storeExists = Store.findById(id);

  if (!storeExists) {
    return res.status(404).json({ error: 'store not found'});
  }
  const updatedFields = updateFieldsParser({
    name, url, tenant
  })

  await storeExists.upadateOne({
    ...updatedFields,
    updatedAt: Date.now(),
  });

  const store = await Store.findById(id);

  return res.json({ store });
});

router.delete('/:id', authMiddleware, objectIdValidation, async (req, res) => {
  const { id } = req.params;
  const Store = StoreSchema.Model();

  const store = await Store.findById(id);

  if (!store) {
    return res.status(404).json({ error: 'Store does not found' });
  }
  await store.delete();

  return res.json({ deletedId: id });
});

module.exports = router
