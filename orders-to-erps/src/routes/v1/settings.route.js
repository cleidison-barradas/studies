const router = require('express').Router();
const database = require('../../database');
const sha1 = require('js-sha1');

const auth = require('../../middlewares/auth.middleware');

router.use(auth);

router.post('/settings-user', async (req, res) => {
    try {
        const { user_id, is_admin, username, email, password: secret } = req.body;
        
        const user = await database.user.findOne({
            where: {
                integration_user_id: user_id
            }
        })
        let updateFields = {}; 

        if (user) {

            if (is_admin !== undefined) {
                updateFields = {
                    ...updateFields,
                    is_admin
                }
            }

            if (username) {
                updateFields = {
                    ...updateFields,
                    username
                }
            }

            if (email) {
                updateFields = {
                    ...updateFields,
                    email
                }
            }

            if (secret) {
                const password = sha1(secret);

                updateFields = {
                    ...updateFields,
                    password
                }
            }

            if (Object.keys(updateFields).length > 0) {
                user.update(updateFields)
            }

            delete user.password

            return res.json({
                user: {
                    user_id: user.integration_user_id,
                    username: user.username,
                    email: user.email
                }
            })

        } else {
            res.status(404).json({
                error: 'user_not_found'
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error'
        })
       
    }
})

module.exports = router;