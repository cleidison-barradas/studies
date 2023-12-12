const path = require('path');
const appRouter = require('express').Router();

const allRoutes = [require('./v1'), require('./v2')];

allRoutes.forEach((route) => {
  const { name, routes } = route;
  Object.keys(routes).forEach(key => {
    const _route = routes[key]
    appRouter.use(path.join('/', name, key), _route.bind(this))
  })
})

module.exports = appRouter
