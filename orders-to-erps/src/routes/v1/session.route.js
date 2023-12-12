const Sequelize = require('sequelize');
const router = require('express').Router();
const sha1 = require('js-sha1');
const { jwtSign } = require('../../jwt');
const database = require('../../database');

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const decoded = sha1(password)
    try {
        const user = await database.user.findOne({
            where: {
                email,
                password: decoded
            }
        })

        if (user) {
            const token = await jwtSign(user.integration_user_id, user.email, user.password);
            await user.update({ token });

            res.json(({
                access_token: token,
                user: {
                    user_id: user.integration_user_id,
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin
                }
            }))

        } else {
            res.status(401).json({
                error: 'invalid_credentials'
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error'
        })     
    }
});

module.exports = router;
