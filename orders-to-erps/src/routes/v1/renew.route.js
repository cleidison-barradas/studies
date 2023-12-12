const router = require('express').Router();
const database = require('../../database');

const { jwtSign, jwtVerify } = require('../../jwt');

router.get('/', async (req, res) => {
    try {
        var auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).json({
                error: 'Missing authorization'
            })
        }
        let token = auth.replace('Bearer ', '');
        const payload = await jwtVerify(token);
        const { customer_id, email, password } = payload;

        const user = await database.user.findOne({
            where: {
                integration_user_id: customer_id
            }
        })
        if (!user) {
            return res.status(404).json({
                error: 'user_not_found'
            })
        }
        await jwtSign(customer_id, email, password);
        await user.update({ token });

        res.json({
            access_token: token,
            user: {
                user_id: user.integration_user_id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        return res.status(500).json({
            error: 'internal_server_error'
        })
        
    }
})

module.exports = router;