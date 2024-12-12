/*
┌──────────────────────────────────────────┐
│               PasteLitter                │ 
│            All rights Reserved           │ 
└──────────────────────────────────────────┘*/

const { query } = require('../database');
const extra = require('../functions/extra');

module.exports = function(app, session) {
    app.get('/api/session/info', async (req, res) => {
        if (req.session.user) {
            res.status(200).send({
                status: 'success',
                data: req.session.user
            });
        } else {
            res.status(401).send({
                status: 'error',
                message: 'Not logged in'
            });
        }
    })


    app.post('/api/force/logout/:uid', async (req, res) => {
        if (req.session.user && ['owner', 'admin'].includes(req.session.user.rank)) {
            const uid = req.params.uid;
            const data = await query('SELECT * FROM sessions');
            let found = false;
            for (const session of data) {
                const parsedSession = JSON.parse(session.data);
                if (parsedSession.user && parsedSession.user.id === Number(uid)) {
                    await query('DELETE FROM sessions WHERE session_id = ?', [session.session_id]);
                    found = true;
                    break;
                }
            }

            if (found) {
                res.status(200).send({
                    status: 'success',
                    message: 'Successfully logged out'
                });
            } else {
                res.status(404).send({
                    status: 'error',
                    message: 'User not found'
                });
            }
        } else {
            res.status(401).send({
                status: 'error',
                message: 'You do not have permission to perform this action'
            });
        }
    })

    app.get('/api/users', async (req, res) => {
        if (req.session.user && ['owner', 'admin'].includes(req.session.user.rank)) {
            const { limit = 10, shift = 0, filter = null } = req.query;

            let data;
            if (filter !== null) {
                data = await query('SELECT id, username, email, rank FROM users WHERE username LIKE ? LIMIT ? OFFSET ?', [`%${filter}%`, limit, shift]);
            } else {
                data = await query('SELECT id, username, email, rank FROM users LIMIT ? OFFSET ?', [limit, shift]);
            }
            
            res.status(200).send({
                status: 'success',
                data: data
            });
        } else {
            res.status(401).send({
                status: 'error',
                message: 'You do not have permission to perform this action'
            });
        }
    })

    app.get('/api/logs', async (req, res) => {
        if (req.session.user && ['owner', 'admin'].includes(req.session.user.rank)) {
            const { limit = 100, shift = 0, filter = null } = req.query;

            try {
                let data;
                if (filter !== null) {
                    data = await query('SELECT id, username, action_desc, created_at FROM logs WHERE username LIKE ? LIMIT ? OFFSET ?', [`%${filter}%`, limit, shift]);
                } else {
                    data = await query('SELECT id, username, action_desc, created_at FROM logs LIMIT ? OFFSET ?', [limit, shift]);
                }
                
                res.status(200).send({
                    status: 'success',
                    data: data
                });
            } catch (err) {
                res.status(500).send({
                    status: 'error',
                    message: 'SQL injection detected or SQL syntax error'
                });
            }
        } else {
            res.status(401).send({
                status: 'error',
                message: 'You do not have permission to perform this action'
            });
        }
    })

}