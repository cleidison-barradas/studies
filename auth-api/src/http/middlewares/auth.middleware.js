// Database
const { Mongo } = require('../../database');
const mongoose = require('mongoose')
// JWT
const {
  jwt: { jwtVerify },
} = require('../../services');

module.exports = async (req, res, next) => {
  const {
    headers: { authorization },
  } = req;

  // If we doesn't have a authorization header, we do not need check permission
  if (!authorization) {
    return res.status(403).json({
      error: 'missing_authorization',
    });
  }
  const token = authorization.replace('Bearer ', '');

  let requestUrl = req.originalUrl;
  if (requestUrl[requestUrl.length - 1] === '/')
    requestUrl = requestUrl.substring(0, requestUrl.length - 1);

  try {

    const jwtPayload = await jwtVerify(token);

    const {
      Models: { UserSchema },
    } = Mongo;

    const UserModel = UserSchema.Model();

    // Load user

    const user = await UserModel.findById(jwtPayload.objectId)
    
    // If user doesn't exists, so we just can say that :P
    if (!user) {
      return res.status(401).json({
        error: 'invalid_session',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'user_disabled'
      })
    }

    req.user = user
    req.tenant = jwtPayload.tenant
    req.store = jwtPayload.store
    next();

  } catch (error) {
    if (error) {
      // Token has expired
      if (error.name === 'TokenExpiredError') {
        return res.status(403).json({
          error: 'session_expired',
        });
      }

      // Token isn't valid
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({
          error: 'invalid_token',
        });
      }
    }

    return res.status(500).json({
      error,
    });
  }
};
