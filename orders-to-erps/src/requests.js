const rules = [
    {
        request: '/v1/register',
        body: [
            {
                name: 'username',
                required: true
            },
            {
                name: 'email',
                required: true
            },
            {
                name: 'password',
                required: true
            },
        ]
    },
    {
        request: '/v1/session',
        body: [
            {
                name: 'email',
                required: true
            },
            {
                name: 'password',
                required: true
            }
        ]
    }
]

module.exports = rules;