const router = require('express').Router();
const mongoose = require('mongoose');
const { ObjectId } = require('bson');
const { paginationParser } = require('myp-admin/helpers');
const { getModelByTenant } = require('myp-admin/database/mongo');
const { objectIdValidation } = require('myp-admin/http/middlewares');

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const SalesHistory = getModelByTenant(req.tenant, 'OrderSchema');
    const { id } = req.params;
    const {
      page = 1,
      limit = 20,
      prefix = '',
      search = '',
      statusOrder = '',
      orderMethod,
    } = req.query;

    const filter = {};

    if (id) {
      const saleHistory = await SalesHistory.findById(id);

      if (!saleHistory) {
        return res.status(404).json({
          error: 'order_not_found',
        });
      }

      return res.json({
        saleHistory,
      });
    }

    if (search.trimEnd().length > 0) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        filter['_id'] = new ObjectId(search);
      } else {
        filter['$or'] = [
          { 'sequence': search },
          { 'customer.fullName': new RegExp(search, 'i') }
        ]
      }
    }

    if (statusOrder.length > 0) {
      filter['statusOrder._id'] = new ObjectId(statusOrder);
    }

    if (prefix.length > 0) {
      if (prefix !== "E-commerce") {
        filter['prefix'] = prefix
      } else {
        filter['prefix'] = { $nin: ['Pluggto', 'iFood'] }
      }
    }

    if (orderMethod) {
      filter['paymentMethod.paymentOption.name'] = orderMethod;
    }

    const paginationOptions = {
      page,
      limit,
      sort: { createdAt: -1 },
    };

    const pagination = await SalesHistory.paginate(filter, paginationOptions);

    return res.json(paginationParser('salesHistory', pagination));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      salesHistory: [],
    });
  }
});

module.exports = router;
