const router = require('express').Router()
const { Mongo: { Models: { UserSchema } } } = require('myp-admin/database')

const { hash } = require('bcrypt')
const sha1 = require('js-sha1')

const { paginationParser } = require('myp-admin/helpers')
const updateFieldsParser = require('myp-admin/helpers/update-fields.parser')

const { rulesMiddleware, objectIdValidation } = require('myp-admin/http/middlewares')
const authMiddleware = require('myp-admin/http/middlewares/auth.middleware');
const requestRules = require('./rules');
const { StoreSchema } = require('myp-admin/database/mongo/models');

router.get('/:id?', authMiddleware, objectIdValidation, async (req, res) => {
  const User = UserSchema.Model();
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;

  if (id) {
    const user = await User.findById(id)

    if (!user) {

      return res.status(404).json({ error: 'user not found' });
    }

    return res.json({ user })
  }
  const paginationOptions = {
    page,
    limit,
    select: ['_id', 'userName', 'email', 'refreshToken']
  };

  const pagination = await User.paginate({}, paginationOptions);

  return res.json(paginationParser('users', pagination));

})

router.put('/', async (req, res) => {
  const User = UserSchema.Model()
  const Store = StoreSchema.Model()
  let { userName, password, email, store, external_id, name, plan, role, status } = req.body

  const userNameExists = await User.exists({ userName });

  if (userNameExists) {
    return res.status(400).json({ message: 'userName already use try another' })
  }

  const emailExists = await User.exists({ email });

  if (emailExists) {
    return res.status(400).json({ message: 'email already use try another' })
  }

  store = await Store.find({_id : {
    $in : store
  }}).select('-settings')

  const salt = Math.random().toString(36).substring(7);
  const encryptedPassword = sha1(salt + sha1(salt + sha1(password)));

  const newUser = await User.create({
    userName,
    password: encryptedPassword,
    email,
    salt,
    store: store.map(store => store),
    external_id,
    name,
    plan,
    role,
    status
  })

  const user = await User.findById(newUser._id)

  return res.json({
    user
  })
});

router.post('/:id', authMiddleware, objectIdValidation, async (req, res) => {
  const User = UserSchema.Model();
  const Store = StoreSchema.Model();

  const { id } = req.params;
  const { userName, password, email, store, external_id, name, plan, role, status } = req.body;
  let hasedPassword;
  let userExists = await User.findById(id);

  if (!userExists) {
    return res.status(404).json({ error: 'user not found' });
  }

  const userNameExists = await User.exists({ userName });

  if (userNameExists) {
    return res.status(400).json({ error: 'userName already use try another' });
  }
  const emailExists = await User.exists({ email });

  if (emailExists) {
    return res.status(400).json({ error: 'email already use try another' });
  }

  if (password) {
    hasedPassword = await hash(password, 8);
  }

  const stores = await Promise.all(
    store.map(store => {
      const found = Store.findById(store).select(['name','tenant','url','_id','originalId'])
      return found
    })
  )

  const updatedFields = updateFieldsParser({
    userName,
    password: hasedPassword,
    email,
    store : stores,
    external_id,
    name,
    plan,
    role,
    status
  });

  await userExists.updateOne({
    ...updatedFields,
    updatedAt: Date.now(),
  });

  const user = await User.findById(id);

  return res.json({ user });

});

router.delete('/:id', authMiddleware, objectIdValidation, async (req, res) => {
  const { id } = req.params;
  const User = UserSchema.Model();

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: 'user does not found' });
  }
  await user.delete();

  return res.json({ deletedId: id });
});

module.exports = router
