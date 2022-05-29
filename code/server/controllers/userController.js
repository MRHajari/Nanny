const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const db = require('../../lib/db.js');
const userMiddleware = require('../../middleware/users.js');

const SECRET_TOKEN = process.env.SECRET_TOKEN || 'SECRETKEY';



// http://localhost:3333/api/user/register
exports.register = (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
        req.body.username
      )});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'Dieser Benutzername wird bereits verwendet!'
                });
            } else {
                // username is available
                bcrypt.hash(req.body.password, 13, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg: err
                        });
                    } else {
                        // has hashed pw => add to database
                        db.query(
                            `INSERT INTO users (user_id, username, password, registered) VALUES ('${uuid.v4()}', ${db.escape(
                  req.body.username
                )}, ${db.escape(hash)}, now())`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                    return res.status(400).send({
                                        msg: err
                                    });
                                }
                                return res.status(201).send({
                                    msg: `${db.escape(req.body.username)} eingetragen`
                                });
                            }
                        );
                    }
                });
            }
        }
    );
};




//http://localhost:3333/api/user/login
exports.login = async(req, res, next) => {
    try {
        db.query(
            `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
            (err, result) => {
                // user does not exists
                if (err) {
                    throw err;
                    res.status(400).send({
                        msg: err
                    });
                }

                if (!result.length) {
                    res.status(401).send({
                        msg: 'Benutzername oder Passwort ist falsch!'
                    });

                } else {
                    // check password
                    bcrypt.compare(
                        req.body.password,
                        result[0]['password'],
                        (bErr, bResult) => {
                            // wrong password
                            if (bErr) {

                                throw bErr;
                                res.status(401).send({
                                    msg: 'Benutzername oder Passwort ist falsch!'
                                });
                            }
                            if (bResult) {
                                const accessToken = jwt.sign({
                                        username: result[0].username,
                                        user_id: result[0].user_id
                                    },
                                    SECRET_TOKEN, {
                                        expiresIn: '1d'
                                    }
                                );
                                const refreshToken  = jwt.sign({
                                    username: result[0].username,
                                    user_id: result[0].user_id
                                    },
                                    SECRET_TOKEN, {
                                        expiresIn: '5d'
                                    }
                                );

                                res.cookie('refreshToken', refreshToken, {
                                    httpOnly: true,
                                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                                })

                                db.query(
                                    `UPDATE users SET last_login = now() WHERE user_id = '${result[0].user_id}'`
                                );

                                return  res.status(200).send({
                                    msg: 'Einloggen erfolgreich',
                                        accessToken,
                                        refreshToken,
                                        user: result[0]
                                });
                            }
                            res.status(401).send({
                                msg: 'Benutzername oder Passwort ist falsch!'
                            });
                        }
                    );

                }
            }
        );

    } catch (err) {
        throw err;
        res.status(400).send({
            msg: err
        });
    }
};



//http://localhost:3333/api/user/userslist
exports.userlist = (req, res, next) => {
    db.query(
        `SELECT * FROM users ORDER BY username;`, (err, result) => {

            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis'
                });
            } else if (result) {
                return res.status(200).send({
                    user: result
                })
            }
        }
    )
}



//http://localhost:3333/api/user/userfind
exports.userfind = (req, res, next) => {
    let searchTerm = req.body.textForSearch;
    db.query(
        `SELECT * FROM users WHERE username LIKE ?;`, [`%` + searchTerm + `%`], (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis'
                });
            } else if (result) {
                return res.status(200).send({
                    user: result
                })
            }
        }
    )
}




//http://localhost:3333/api/user/editUser
exports.editUser = (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
        req.body.username
      )});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'Dieser Benutzername wird bereits verwendet!'
                });
            } else {

                bcrypt.hash(req.body.password, 13, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                            msg: err
                        });
                    } else {
                        db.query(
                            `UPDATE users SET username =  ${db.escape(
                    req.body.username
                    )}, password =  ${db.escape(hash)} WHERE user_id =  ${db.escape(
                                    req.body.user_id
                                    )};`,
                            (err, result) => {
                                if (err) {
                                    throw err;
                                    return res.status(400).send({
                                        msg: 'Update fehlgeschlagen'
                                    });
                                } else if (result) {
                                    return res.status(200).send({
                                        msg: 'Erfolg aktualisieren'
                                    })
                                }
                            }
                        )
                    }
                });
            }


        });

}


//http://localhost:3333/api/user/deleteUser
exports.deleteUser = (req, res) => {
    try {
        db.query(
            `DELETE FROM users WHERE user_id= ${db.escape(req.body.user_id)};`)
        return res.status(200).send({
            msg: `${db.escape(req.body.username)} wurde gelöscht.`,
        })
    } catch (err) {
        throw err;
        return res.status(400).send({
            msg: err
        })
    }
}




// verify token
//http://localhost:3333/api/user/currentUser
exports.currentUser = (req, res) => {
    // authorization = req.get('authorization')
    // const token = authorization.split(' ')[1];
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(
              token,
              SECRET_TOKEN,
             (err, userData) => {
                if (err){
                    return res.status(401).send({ 
                        message: 'Sie Sind nicht eingeloggt'
                    });
                } else if (userData){
                    return res.send(userData);
                }
            });
}





//http://localhost:3333/api/user/logout
exports.logout = (req, res) => {
    console.log('logout')


    // const refreshToken = req.header("x-auth-token");

    // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

//     res.cookie('jwt', '', { maxAge: 0 })
//     res.clearCookie("jwt");
//     res.clearCookie('accessToken')

    res.send({
       message: 'Abmeldung erfolgreich'
     });
}