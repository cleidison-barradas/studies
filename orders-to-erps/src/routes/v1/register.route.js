const router = require('express').Router();
const Sequelize = require('sequelize');
const database = require('../../database');
const sha1 = require('js-sha1');
const { jwtSign } = require('../../jwt');

const requestRules = require('../../middlewares/rules.middleware');
router.use(requestRules);

router.post('/', async (req, res) => {
    const { username, email, password, is_admin } = req.body;
    const encryptedPassword = sha1(password);

    try {

        const userExist = await database.user.findOne({
            where: {
                email:{
                    [Sequelize.Op.eq]: email.toLowerCase()
                }
            }
        })

        if (userExist) {
            return res.status(403).json({
                error: 'email_already_exists'
            })
        }

        const user = await database.user.create({
            username,
            email,
            password: encryptedPassword,
            is_admin: is_admin !== undefined ? is_admin : undefined
        })

        const token = await jwtSign(user.integration_user_id,user.email, user.password);

        await user.update({ token });

        return res.json({
            access_token: token,
            user: {
                user_id: user.integration_user_id,
                username: user.username,
                email: user.email
            }

        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error'
        })    
    }

});

module.exports = router;