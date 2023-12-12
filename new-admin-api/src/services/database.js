const { Mongo } = require('../database')

const databaseMiddleware = async(req,res,next) => {

    const {database = 'db'} = req.headers
    process.env['MONGO_DATABASE_NAME'] = database;
  
    await Mongo.init(true)
    next()
}


module.exports = {
    databaseMiddleware,
}