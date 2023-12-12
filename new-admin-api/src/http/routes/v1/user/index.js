const router = require('express').Router();

const { paginationParser, updateFieldsParser } = require('../../../../helpers')
const { objectIdValidation } = require('../../../middlewares')

const {
  Mongo: {
    Models: { UserSchema },
  },
} = require('../../../../database');
const { PlanSchema, StoreSchema } = require('myp-admin/database/mongo/models');

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const User = UserSchema.Model();

      if (id) {
        const user = await User.findById(id);

        if (!user) {
          return res.status(404).json({
            error: 'user not found',
          });
      }

      return res.json({ user });
    } 

    const paginationOptions = {
      page,
      limit,
    };

    const pagination = await User.paginate({}, paginationOptions);

    return res.json(paginationParser('users', pagination));

    } catch (error) {
      return res.status(400).json({ error: error.message});
    } 
});

router.put('/', async (req, res) => {
  try {
    let { 
      originalId, 
      email, 
      avatar, 
      plan, 
      role, 
      status,
      name,
      userName,
      refreshToken
    } = req.body;

    const User = UserSchema.Model()
    const Plan = PlanSchema.Model()

    plan = await Plan.findById(plan)
  
    const user = await User.create({
      originalId, 
      email, 
      avatar, 
      plan, 
      role, 
      status,
      name,
      userName,
      refreshToken
    });
  
    return res.json({ user });

  } catch (error) {
    return res.status(400).json({ error: error.message});    
  }
});

router.post('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    let {
      originalId, 
      email, 
      avatar, 
      plan, 
      role, 
      status,
      name,
      userName,
      refreshToken
     } = req.body;

    const User = UserSchema.Model();
    const Plan = PlanSchema.Model();
  
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'status does not found' });
    }

    if(plan){
      plan = await Plan.findById(plan)
    }
  
    const updateFields = updateFieldsParser({
      originalId, 
      email, 
      avatar, 
      plan, 
      role, 
      status,
      name,
      userName,
      refreshToken
     });
  
    await user.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    });
  
    user = await User.findById(id);
  
    return res.json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message});        
  }

});

router.delete('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const User = UserSchema.Model();
  
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    
    await user.delete();
    return res.json({ deletedId: id });
  } catch (error) {
    return res.status(400).json({ error: error.message});            
  }
});

module.exports = router;
