const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: (req, res, next) => {
        // username min length 4
        if (!req.body.username || req.body.username.length < 3) {
            return res.status(400).send({
                msg: 'Username must be at least 3 characters'
            });
        }

        // password min 6 chars
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                msg: 'Password must be at least 6 characters'
            });
        }

        // password (repeat) does not match
        if (!req.body.password_repeat ||
            req.body.password != req.body.password_repeat
        ) {
            return res.status(400).send({
                msg: 'Both passwords must match'
            });
        }
        next();
    }
};



// isLoggedIn: (req, res, next) => {
//     if (!req.headers.authorization) {
//         return res.status(400).send({
//             message: '1- Your session is not valid!',
//         })
//     }
//     try {
//         const SECRET_TOKEN = process.env.SECRET_TOKEN || 'SECRETKEY';

//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(
//             token,
//             SECRET_TOKEN
//         );
//         req.userData = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).send({
//             msg: '2- Your session is not valid!'
//         });
//     }
// }