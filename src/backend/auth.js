const { comparePassword, hashPassword } = require('../functions/extra');
const { query } = require('../database');

module.exports = function (app, session) {
    app.post('/auth/login', async (req, res) => {
        const { username, password } = req.body;
        const user = await query('SELECT * FROM users WHERE username = ?', [username]);
        if (user.length === 0) {
            res.status(401).send({
                message: 'Invalid username or password',
            });
            return;
        }
        const match = await comparePassword(password, user[0].password);
        if (!match) {
            res.status(401).send({
                message: 'Invalid username or password',
            });
            return;
        }
        req.session.user = {
            id: user[0].id,
            username: user[0].username,
            rank: user[0].rank,
            email: user[0].email
        };
        res.redirect('/');
    });

    app.post('/auth/register', async (req, res) => {
        const { username, password, email } = req.body;
        const user = await query('SELECT * FROM users WHERE username = ?', [username]);
        if (user.length > 0) {
            res.status(400).send({
                message: 'Username already exists',
            });
            return;
        }
        const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (email && !emailRegex.test(email)) {
            res.status(400).send({
                message: 'Invalid email',
            });
            return;
        }
        if (email) {
            const userByEmail = await query('SELECT * FROM users WHERE email = ?', [email]);
            if (userByEmail.length > 0) {
                res.status(400).send({
                    message: 'Email already exists',
                });
                return;
            }
        }
        const hashedPassword = await hashPassword(password);
        await query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email || 'anonymous@litter.com']);
        res.status(200).send({
            message: 'User registered successfully',
        })
    });


    app.get('/auth/logout', async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });
};