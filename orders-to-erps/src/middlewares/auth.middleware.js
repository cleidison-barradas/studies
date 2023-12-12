// JWT
const { jwtVerify } = require("../jwt");

// Database
const database = require("../database");

const auth = (req, res, next) => {
  var auth = req.headers.authorization;
  if (!auth) {
    res.status(403).json({ error: "Missing authorization" });
  } else {
    const token = auth.replace("Bearer ", "");
    jwtVerify(token).then(
      result => {
        const { customer_id, email, password } = result;

        if (result.customer_id !== undefined) {
          database.user
            .findOne({
              where: {
                integration_user_id: customer_id,
                token: token
              }
            })
            .then(user => {
              if (user === null)
                res
                  .status(403)
                  .json({ status: "error", code: "invalid_token" });
              else {
                req.jwtPayload = {
                  user_id: customer_id,
                  email,
                  password
                };

                next();
              }
            });
        } else {
          res.status(403).json({ status: "error", code: "invalid_token" });
        }
      },
      error => {
        res.status(403).json({ error: error });
      }
    );
  }
};

module.exports = auth;
